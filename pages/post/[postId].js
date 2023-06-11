import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { AppLayout } from "../../components/AppLayout/AppLayout";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { getSession } from "@auth0/nextjs-auth0";
import { getAppProps } from "../../utils/getAppProps";

export default function Post(props) {
  console.log("PROPS on postID: ", props);
  return (
    <div>
      <div className="overflow-auto h-screen">
        <div className="max-w-screen-sm mx-auto">
          <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
            SEO title and meta description
          </div>
          <div className="p-4 my-2 border border-stone-200 rounded-md">
            <div className="text-blue-600 text-2xl fon-bold">{props.title}</div>
            <div className="mt-2">{props.metaDescription}</div>
          </div>
          <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
            Keywords
          </div>
          <div className="flex flex-wrap pt-2 gap-1">
          {props.keywords.split(',').map((keyword, i) => (
            <div key={i} className="p-2 rounded-full bg-slate-800 text-white">
              <FontAwesomeIcon icon={faHashtag} /> {keyword}
              </div>
            ))}
          </div>
          <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
            Blog post
          </div>
          <div dangerouslySetInnerHTML={{ __html: props.postContent || "" }} />
        </div>
      </div>
    </div>
  );
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db("BlogStandard");
    const user = await db.collection("users").findOne({
      auth0Id: userSession.user.sub,
    });

     // Log the received postId
     console.log(`ctx.params.postId: ${ctx.params.postId}`);

  // Check if postId is defined
  if (!ctx.params || !ctx.params.postId) {
    throw new Error("PostId is missing");
  }

  // Check if postId is a valid ObjectId
  if (!ObjectId.isValid(ctx.params.postId)) {
    throw new Error("PostId is not a valid ObjectId");
  }


    const post = await db.collection("posts").findOne({
      _id: new ObjectId(ctx.params.postId),
      userId: user._id,
    });

    // Log the fetched posts data
  console.log(post);

    if (!post) {
      return {
        redirect: {
          destination: "/post/new",
          permanent: false,
        },
      };
    }
    return {
      props: {
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
        ...props,
      },
    };
  },
});

import { getSession ,withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Configuration, OpenAIApi } from "openai";
import clientPromise from "../../lib/mongodb";


/////move this into new fucntion handle submit
export default withApiAuthRequired (async function handler(req, res) {
const {user}= await getSession(req, res);
const client = await clientPromise;
const db = client.db("BlogStandard");
const userProfile = await db.collection("users").findOne({
    auth0Id: user.sub
});

/////move this into new fucntion handle submit
if(!userProfile?.availableTokens){
    res.status(403);
    return;
}

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);
  const { topic, keywords } = req.body;

  

  if(!topic || !keywords){
    res.status(422);
    return;
  }

  if(topic.length > 80 || keywords.lenght > 80) {
    res.status(422);
    return;
  }

  try {
    const postContentResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: "You are a blog post generator",
        },
        {
          role: "user",
          content: `Write a long and detailed SEO-friendly structured blog post with headings, paragraphs, and lists, formatted in HTML about ${topic}, that targets the following comma-sperated keywords.
          The content should be formatted in seo-friendly HTLM, so that is can printed to the web page.
          Only use the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul., nothing else such as <HTML> or <!DOCTYPE html>`,
        },
      ],
      temperature: 0,
    });

    const postContent = postContentResponse.data.choices[0]?.message?.content || "";

    const titleResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: 'You are a blog post generator.',
        },
        {
          role: 'user',
          content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
        The response should be formatted in SEO-friendly HTML, 
        limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.`,
        },
        {
          role: 'assistant',
          content: postContent,
        },
        {
          role: 'user',
          content: 'Generate appropriate title tag text for the above blog post',
        },
      ],
      temperature: 0,
    });

    const metaDescriptionResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: 'You are a blog post generator.',
        },
        {
          role: 'user',
          content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
        The response should be formatted in SEO-friendly HTML, 
        limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.`,
        },
        {
          role: 'assistant',
          content: postContent,
        },
        {
          role: 'user',
          content:
            'Generate SEO-friendly meta description content for the above blog post',
        },
      ],
      temperature: 0,
    });

    const title = titleResponse.data.choices[0]?.message?.content || "";
    const metaDescription = metaDescriptionResponse.data.choices[0]?.message?.content || "";

    console.log('POST CONTENT: ', postContent);
    console.log('TITLE: ', title);
    console.log ('META DESCRIPTION: ', metaDescription);


    //////move to new//////
 await db.collection("users").updateOne(
    {
        auth0Id: user.sub
    }, 
    {
        $inc: {
            availableTokens: -1
        }
    }
    );

    //////move to new/////////
    const post = await db.collection('posts').insertOne({
    postContent: postContent || '',
    title: title || '',
    metaDescription: metaDescription || '',
    topic,
    keywords,
    userId: userProfile._id,
    created: new Date(),
  });

  console.log("post: ", post)
    
  // Send the results back to the client
    res.status(200).json({
      postId: post.insertedId,
    });
  } catch (error) {
    // Handle the error here
    console.error(error);

   
    // Send an error status back to the client
    res.status(500).json({ error: 'An error occurred during the post generation.' });
  }
})

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout/AppLayout";
import { getAppProps } from "../utils/getAppProps";

export default function TokenTopup() {
  const handleClick = async () => {
    const results = await fetch(`api/addTokens`, {
      method: "POST",
    });

    const json = await results.json();
    console.log("RESULTS: Topup js 12: ", json);
    window.location.href = json.session.url;
  };
  return (
    <div>
      <div className="w-full h-full flex flex-col overflow-auto">
        <div className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200">
          <div className="justify-center items-center text-center">
            <h2>
              <strong>Add Tokens to your account</strong>
            </h2>
            <button className="btn" onClick={handleClick}>
              Add tokens
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});

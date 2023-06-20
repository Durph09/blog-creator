'use client'

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout/AppLayout";
import { useState } from "react";
import { useRouter } from "next/router";
import { getAppProps } from "../../utils/getAppProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { redirect } from "next/dist/server/api-utils";
import {useCompletion} from 'ai/react'

export default function NewStream (props) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [generating, setGenerating] = useState(false);
  const [postResponse, setPostResponse] = useState("");
  


  const {
    completion,
   
    handleSubmit
  } = useCompletion({
    api: '/api/generatepost1',
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ topic, keywords }),
  
  })
    

    
 

  return (
    <div className="h-full overflow-hidden">
      
     
       
        <div className="overflow-auto">
        <div className="max-w-screen-sm mx-auto">
          <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
            SEO title and meta description
          </div>
          <div className="p-4 my-2 border border-stone-200 rounded-md">
            <div className="text-blue-600 text-2xl font-bold">{completion}</div>
            <div className="mt-2">{completion}</div>
          </div>
          <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
            Keywords
          </div>
          <div className="flex flex-wrap pt-2 gap-1">
            
              <div className="p-2 rounded-full bg-slate-800 text-white">
                {keywords}
              </div>
           
          </div>
          <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
            Blog post
          </div>
         {completion}
          </div>
          </div>
        
        
      
      <div className="w-full h-full flex flex-col overflow-auto">
        <form onSubmit={handleSubmit} className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200">
        <div >
          <label>
            <strong>Generate a blog post on the topic of:</strong>
          </label>
          <textarea
            className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            maxLength={80}
          />
          <small className="block mb-2">
            Seperate keywords with a comma
          </small>
        </div>

        <div>
          <label>
            <strong>Targeting the following keywords: </strong>
          </label>
          <textarea
            className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            maxLength={80}
          />
        </div>

        <button className="btn" type="submit" disabled={!topic.trim() || !keywords.trim()} > 
          Generate
        </button>
      </form>
      </div>
     
    </div>
    
  )
}

NewStream.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
}

export const getServerSideProps = withPageAuthRequired ({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);

    if(!props.availableTokens){
      return {
      redirect: {
        destination: "/token-topup",
        permanent: false,
      }
    }
    }
    return {
      props
    };
  }
});

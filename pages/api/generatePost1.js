import {OpenAIStream, StreamingTextResponse} from 'ai'
import { Configuration, OpenAIApi } from "openai-edge";


  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);
  

  export const runtime ='edge'

 export async function POST (req) {
const { topic, keywords } = await req.body;
  
    const postContentResponse = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: "You are a blog post generator",
        },
        {
          role: "user",
          content: `Write a long and detailed SEO-friendly structured blog post with headings, paragraphs, and lists, formatted in HTML about ${topic}, that targets the following comma-sperated keywords ${keywords}.
          The content should be formatted in seo-friendly HTLM, so that is can printed to the web page.
          Only use the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul., nothing else such as <HTML> or <!DOCTYPE html>`,
        },
      ],
      temperature: 0,
    });

    
const postStream = OpenAIStream(postContentResponse)
    
   
    
  // Send the results back to the client
  return new StreamingTextResponse(postStream);

}

import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);
  const { topic, keywords } = req.body;

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
    });

    const postContent = postContentResponse.data.choices[0]?.message?.content || "";

    const titleResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: "You are a blog post generator",
        },
        {
          role: "user",
          content: `Generate appropriate title tag text for the above blog post`,
        },
      ],
    });

    const metaDescriptionResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: "You are a blog post generator",
        },
        {
          role: "user",
          content: "Generate SEO-friendly meta description content for the above blog post",
        },
      ],
    });

    const title = titleResponse.data.choices[0]?.message?.content || "";
    const metaDescription = metaDescriptionResponse.data.choices[0]?.message?.content || "";

    console.log('POST CONTENT: ', postContent);
    console.log('TITLE: ', title);
    console.log ('META DESCRIPTION: ', metaDescription);

    // Send the results back to the client
    res.status(200).json({
      postContent: postContent,
      title: title,
      metaDescription: metaDescription,
    });
  } catch (error) {
    // Handle the error here
    console.error(error);

    // Send an error status back to the client
    res.status(500).json({ error: 'An error occurred during the post generation.' });
  }
}

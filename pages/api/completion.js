export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Extract the `prompt` from the body of the request
    const { prompt } = req.body;

    // Ask OpenAI for a streaming completion given the prompt
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      stream: true,
      prompt
    })

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response)

    // Respond with the stream
    res.status(200).send(new StreamingTextResponse(stream))
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

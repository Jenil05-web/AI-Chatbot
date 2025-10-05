import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4", // Fix model name (was "gpt-4o")
      messages: [{ role: "user", content: message }], // Use message parameter instead of req.body.message
    }),
  };

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error(err);
    throw err; // Throw error instead of using res.status
  }
};

export default getOpenAIAPIResponse; // we export this function so that we can use it in other parts of our application, such as in route handlers or controllers

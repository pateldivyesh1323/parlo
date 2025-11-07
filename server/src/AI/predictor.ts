import Groq from "groq-sdk";
import environments from "../environments";

const groq = new Groq({
  apiKey: environments.GROQ_API_KEY,
});

const predictNextText = async (text: string) => {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a fast, minimal text autocompletion engine. Continue the text naturally without repeating it, without quotes, and without explanations.",
      },
      {
        role: "system",
        content:
          "Never repeat the user's input. Start directly from where their text left off.",
      },
      {
        role: "user",
        content: `${text}`,
      },
    ],
    model: "openai/gpt-oss-20b",
    temperature: 1,
    max_completion_tokens: 128,
    top_p: 1,
    stream: true,
    // reasoning_effort: "low",
    stop: null,
  });

  for await (const chunk of chatCompletion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
};

export { predictNextText };

import Groq from "groq-sdk";
import environments from "../environments";

const groq = new Groq({
  apiKey: environments.GROQ_API_KEY,
});

const predictNextText = async (text: string) => {
  try {
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
          role: "system",
          content:
            "Keep completions SHORT - maximum 3-5 words. Complete the current thought and stop.",
        },
        {
          role: "user",
          content: `${text}`,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.15,
      max_completion_tokens: 15,
      top_p: 0.9,
      stream: true,
      stop: null,
    });

    let completedText = "";
    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || "";
      process.stdout.write(content);
      completedText += content;
    }
    return completedText;
  } catch (error) {
    console.error("❌ Prediction error:", error);
    return "";
  }
};

export { predictNextText };

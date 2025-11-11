import Groq from "groq-sdk";
import environments from "../environments";
import { redisClient } from "../lib/redis";
import Message from "../model/message";

const groq = new Groq({
  apiKey: environments.GROQ_API_KEY,
});

// Loading some messages in redis to give context to ai for prediction
const loadInitialContext = async ({ chatId }: { chatId: string }) => {
  const redisKey = `chat:${chatId.toString()}:context`;
  const contextExist = await redisClient.exists(redisKey);
  if (contextExist) return;

  const messages = await Message.find({ chat: chatId })
    .populate({
      path: "originalContent",
      select: "value",
    })
    .sort({ timestamp: -1 })
    .limit(20)
    .lean();

  if (messages.length == 0) return;

  const pipeline = redisClient.multi();
  messages.reverse().forEach((message) => {
    const originalContent = message.originalContent as any;
    pipeline.rPush(
      redisKey,
      JSON.stringify({
        sender: message.sender.toString(),
        message: originalContent?.value || originalContent,
      }),
    );
  });

  pipeline.expire(redisKey, 300);
  await pipeline.exec();
};

// Append new message to context
const appendMessageToContext = async ({ chatId, message }: any) => {
  const redisKey = `chat:${chatId.toString()}:context`;

  redisClient
    .multi()
    .rPush(
      redisKey,
      JSON.stringify({
        sender: message.sender.toString(),
        message: message.originalContent.value,
      }),
    )
    .lPop(redisKey)
    .expire(redisKey, 300)
    .exec();
};

const buildPrompt = async ({ chatId, partialText }: any) => {
  await loadInitialContext({ chatId });
  const redisKey = `chat:${chatId.toString()}:context`;
  const messages = await redisClient.lRange(redisKey, 0, -1);
  const contextText = messages
    .map((msg) => {
      const { sender, message } = JSON.parse(msg);
      return `${sender}: ${message}`;
    })
    .join("\n");

  if (contextText) {
    return `${contextText}\n${partialText}`;
  }
  return partialText;
};

const predictNextText = async ({
  chatId,
  partialText,
}: {
  chatId: string;
  partialText: string;
}) => {
  try {
    const prompt = await buildPrompt({ chatId, partialText });
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
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 1,
      max_completion_tokens: 128,
      top_p: 1,
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

export { predictNextText, loadInitialContext, appendMessageToContext };

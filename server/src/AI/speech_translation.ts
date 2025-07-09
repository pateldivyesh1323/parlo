import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import Groq from "groq-sdk";
import environments from "../environments";
import { TranslationServiceClient } from "@google-cloud/translate";
import { performance } from "perf_hooks";

const ttsClient = new TextToSpeechClient();
const groq = new Groq({
  apiKey: environments.GROQ_API_KEY,
});
const translationClient = new TranslationServiceClient();
const projectId = environments.PROJECT_ID;
const location = environments.LOCATION;

const speech_to_text = async ({ audio }: { audio: string }) => {
  if (!fs.existsSync(audio)) {
    throw new Error("Audio file does not exist");
  }

  const file = await fsPromises.readFile(audio);
  if (file.length === 0) {
    throw new Error("Audio file is empty");
  }

  try {
    const translation = await groq.audio.translations.create({
      file: fs.createReadStream(audio),
      model: "whisper-large-v3",
    });

    if (!translation.text || translation.text.trim().length === 0) {
      throw new Error("No text was translated from the audio file");
    }

    return { text: translation.text };
  } catch (error) {
    throw new Error(`Audio translation failed: ${(error as Error).message}`);
  }
};

const text_to_speech = async ({
  text,
  speechFilePath,
  languageCode = "gu-IN",
}: {
  text: string;
  speechFilePath: string;
  languageCode?: string;
}) => {
  const dir = path.dirname(speechFilePath);
  await fsPromises.mkdir(dir, { recursive: true });

  const [response] = await ttsClient.synthesizeSpeech({
    input: { text },
    voice: {
      languageCode,
      ssmlGender: "NEUTRAL",
    },
    audioConfig: {
      audioEncoding: "MP3",
    },
  });

  await fsPromises.writeFile(speechFilePath, response.audioContent as Buffer);
};

const translateText = async (
  text: string,
  targetLanguage: string,
): Promise<string> => {
  try {
    const mimeType = "text/plain";
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: [text],
      mimeType: mimeType,
      sourceLanguageCode: "en",
      targetLanguageCode: targetLanguage,
    };

    const [response] = await translationClient.translateText(request);
    if (!response.translations) {
      throw new Error("Translation result is empty");
    }
    return response.translations[0].translatedText as string;
  } catch (error) {
    throw new Error(`Translation failed: ${(error as Error).message}`);
  }
};

const speech_to_speech = async ({
  audio,
  speechFilePath,
  targetLanguage = "gu-IN",
  ttsLangCode = "gu-IN",
}: {
  audio: string;
  speechFilePath: string;
  targetLanguage?: string;
  ttsLangCode?: string;
}) => {
  try {
    const startTime = performance.now();

    const startTime1 = performance.now();
    const { text: englishText } = await speech_to_text({ audio });
    const endTime1 = performance.now();
    const duration1 = endTime1 - startTime1;
    console.log(`Time taken to translate text: ${duration1} milliseconds`);

    const startTime2 = performance.now();
    const translatedText = await translateText(englishText, targetLanguage);
    const endTime2 = performance.now();
    const duration2 = endTime2 - startTime2;
    console.log(`Time taken to translate text: ${duration2} milliseconds`);

    const startTime3 = performance.now();
    await text_to_speech({
      text: translatedText,
      speechFilePath,
      languageCode: ttsLangCode,
    });
    const endTime3 = performance.now();
    const duration3 = endTime3 - startTime3;
    console.log(`Time taken to translate text: ${duration3} milliseconds`);

    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`Total Time taken: ${duration} milliseconds`);
    return {
      originalText: englishText,
      translatedText: translatedText,
      success: true,
      duration: duration,
    };
  } catch (error) {
    throw error;
  }
};

export { speech_to_text, text_to_speech, speech_to_speech };

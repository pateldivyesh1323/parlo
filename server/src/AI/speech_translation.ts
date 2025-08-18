import fs from "fs";
import path from "path";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import Groq from "groq-sdk";
import environments from "../environments";
import { TranslationServiceClient } from "@google-cloud/translate";
import { performance } from "perf_hooks";
import os from "os";

const ttsClient = new TextToSpeechClient();
const groq = new Groq({
  apiKey: environments.GROQ_API_KEY,
});
const translationClient = new TranslationServiceClient();
const projectId = environments.PROJECT_ID;
const location = environments.LOCATION;

const speech_to_text = async ({ audio }: { audio: Buffer }) => {
  try {
    const tempId = crypto.randomUUID();
    const tempFilePath = path.join(os.tmpdir(), `${tempId}.wav`);
    await fs.promises.writeFile(tempFilePath, audio);

    const translation = await groq.audio.translations.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-large-v3",
    });

    if (!translation.text || translation.text.trim().length === 0) {
      throw new Error("No text was translated from the audio file");
    }

    fs.promises.unlink(tempFilePath).catch((err) => {
      console.error("Failed to delete temp file:", err);
    });

    return { text: translation.text };
  } catch (error) {
    throw new Error(`Audio translation failed: ${(error as Error).message}`);
  }
};

const text_to_speech = async ({
  text,
  languageCode = "gu-IN",
}: {
  text: string;
  languageCode?: string;
}) => {
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

  return response.audioContent as Buffer;
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
  targetLanguage = "gu-IN",
  ttsLangCode = "gu-IN",
}: {
  audio: Buffer;
  targetLanguage?: string;
  ttsLangCode?: string;
}) => {
  try {
    console.log("Target language:", targetLanguage);
    console.log("TTS Lang code:", ttsLangCode);
    const startTime = performance.now();

    let englishText: string;
    try {
      const result = await speech_to_text({ audio });
      englishText = result.text;
    } catch (error) {
      console.log("No valid text found in audio, skipping translation");
      return {
        originalText: "",
        translatedText: "",
        success: false,
        duration: 0,
        translatedAudio: null,
        error: "No valid text found in audio",
      };
    }

    const translatedText = await translateText(englishText, targetLanguage);

    const translatedAudio = await text_to_speech({
      text: translatedText,
      languageCode: ttsLangCode,
    });

    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`Total Time taken: ${duration} milliseconds`);
    return {
      originalText: englishText,
      translatedText: translatedText,
      success: true,
      duration: duration,
      translatedAudio,
    };
  } catch (error) {
    console.error("Speech to speech translation error:", error);
    return {
      originalText: "",
      translatedText: "",
      success: false,
      duration: 0,
      translatedAudio: null,
      error: (error as Error).message,
    };
  }
};

export { speech_to_text, text_to_speech, speech_to_speech };

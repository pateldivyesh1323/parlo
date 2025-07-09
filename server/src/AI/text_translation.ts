import { TranslationServiceClient } from "@google-cloud/translate";
import environments from "../environments";

const projectId = environments.PROJECT_ID;
const location = environments.LOCATION;

const translationClient = new TranslationServiceClient();

const detectLanguage = async (text: string): Promise<string> => {
  try {
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      content: text,
      mimeType: "text/plain",
    };

    const [response] = await translationClient.detectLanguage(request);
    if (!response.languages || response.languages.length === 0) {
      return "en";
    }

    const detectedLanguage = response.languages[0].languageCode;
    return detectedLanguage || "en";
  } catch (error) {
    return "en";
  }
};

const translateText = async (
  text: string,
  targetLanguage: string,
): Promise<string> => {
  try {
    const sourceLanguage = await detectLanguage(text);

    if (sourceLanguage === targetLanguage) {
      return text;
    }

    const mimeType = "text/plain";
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: [text],
      mimeType: mimeType,
      sourceLanguageCode: sourceLanguage,
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

export default translateText;

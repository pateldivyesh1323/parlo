import { BadRequestError } from "../middlewares/errorMiddleware";
import Message from "../model/message";
import Content from "../model/content";
import UserSettings from "../model/userSettings";
import Chat from "../model/chat";
import translateText from "../AI/text_translation";
import { CONTENT_TYPES } from "../constants";
import { processAndUploadAudio } from "../lib/firebaseAdmin";
import { speech_to_speech } from "../AI/speech_translation";

const createMessage = async ({
  chatId,
  content,
  contentType,
  senderId,
}: {
  chatId: string;
  content: string | Buffer;
  contentType: string;
  senderId: string;
}) => {
  const chat = await Chat.findById(chatId)
    .select("users")
    .populate({ path: "users", select: "_id" })
    .lean();

  let createdContent;
  let translatedContents;

  switch (contentType) {
    case CONTENT_TYPES.TEXT:
      // Translate the message if the user has a translation language set
      const textTranslationPromises =
        chat?.users
          .filter((user) => user._id.toString() !== senderId)
          .map(async (userId) => {
            const userSettings = await UserSettings.findOne({ userId })
              .select("translationLanguage")
              .lean();

            if (
              userSettings?.translationLanguage &&
              userSettings?.translationLanguage !== "en"
            ) {
              const translatedText = await translateText(
                content as string,
                userSettings?.translationLanguage,
              );
              const translatedContent = await Content.create({
                contentType: CONTENT_TYPES.TEXT,
                value: translatedText,
                uploadedBy: userId,
              });
              return {
                user: userId,
                language: userSettings?.translationLanguage,
                content: translatedContent._id,
              };
            }
            return null;
          }) || [];

      translatedContents = (await Promise.all(textTranslationPromises)).filter(
        Boolean,
      );

      createdContent = await Content.create({
        contentType,
        value: content,
        uploadedBy: senderId,
      });
      break;

    case CONTENT_TYPES.AUDIO:
      const uuid = crypto.randomUUID().split("-")[0];

      const audioUrl = await processAndUploadAudio(
        content as Buffer,
        `${chatId}-${senderId}-${uuid}.wav`,
      );

      createdContent = await Content.create({
        contentType,
        value: audioUrl,
        uploadedBy: senderId,
      });

      const audioTranslationPromises =
        chat?.users
          .filter((user) => {
            return user._id.toString() !== senderId;
          })
          .map(async (user) => {
            const userId = user._id.toString();
            const userSettings = await UserSettings.findOne({ userId })
              .select("translationLanguage")
              .lean();

            if (
              userSettings?.translationLanguage &&
              userSettings?.translationLanguage !== "en"
            ) {
              const result = await speech_to_speech({
                audio: content as Buffer,
                targetLanguage: userSettings?.translationLanguage,
                ttsLangCode: userSettings?.translationLanguage,
              });

              if (result.success && result.translatedAudio) {
                const audioUrl = await processAndUploadAudio(
                  result.translatedAudio,
                  `${chatId}-${userId}-${uuid}.wav`,
                );

                const translatedContent = await Content.create({
                  contentType: CONTENT_TYPES.AUDIO,
                  value: audioUrl,
                  uploadedBy: userId,
                });

                return {
                  user: userId,
                  language: userSettings?.translationLanguage,
                  content: translatedContent._id,
                };
              } else {
                console.log(
                  `Audio translation skipped for user ${userId}: ${
                    result.error || "No valid text found"
                  }`,
                );
              }
            }
            return null;
          }) || [];

      translatedContents = (await Promise.all(audioTranslationPromises)).filter(
        Boolean,
      );

      break;
  }

  const newMessage = await Message.create({
    chat: chatId,
    sender: senderId,
    originalContent: createdContent?._id,
    translatedContents,
  });

  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: newMessage._id,
  });

  await newMessage.populate("sender");
  await newMessage.populate("originalContent");
  await newMessage.populate("translatedContents.content");

  return newMessage.toObject();
};

const getAllMessages = async (userId: string, chatId: string) => {
  const checkAccess = await Chat.exists({
    _id: chatId,
    users: { $in: [userId] },
  });

  if (!checkAccess) {
    throw new BadRequestError("You are not authorized to access this chat");
  }

  const messages = await Message.find({ chat: chatId })
    .populate("sender")
    .populate("originalContent")
    .populate("translatedContents.content")
    .lean();

  return messages;
};

export { createMessage, getAllMessages };

import { BadRequestError } from "../middlewares/errorMiddleware";
import Message from "../model/message";
import Content from "../model/content";
import UserSettings from "../model/userSettings";
import Chat from "../model/chat";
import translateText from "../AI/text_translation";

const createMessage = async (
  chatId: string,
  message: string,
  userId: string,
) => {
  const chat = await Chat.findById(chatId)
    .select("users")
    .populate({ path: "users", select: "_id" })
    .lean();

  // Translate the message if the user has a translation language set
  const translationPromises =
    chat?.users
      .filter((user) => user._id.toString() !== userId)
      .map(async (userId) => {
        const userSettings = await UserSettings.findOne({ userId })
          .select("translationLanguage")
          .lean();

        if (
          userSettings?.translationLanguage &&
          userSettings?.translationLanguage !== "en"
        ) {
          const translatedText = await translateText(
            message,
            userSettings?.translationLanguage,
          );
          const content = await Content.create({
            contentType: "text/plain",
            value: translatedText,
            uploadedBy: userId,
          });
          return {
            user: userId,
            language: userSettings?.translationLanguage,
            content: content._id,
          };
        }
        return null;
      }) || [];

  const translatedContents = (await Promise.all(translationPromises)).filter(
    Boolean,
  );

  const content = await Content.create({
    contentType: "text/plain",
    value: message,
    uploadedBy: userId,
  });

  const newMessage = await Message.create({
    chat: chatId,
    sender: userId,
    originalContent: content._id,
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

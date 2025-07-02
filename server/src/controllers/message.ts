import { BadRequestError } from "../middlewares/errorMiddleware";
import Message from "../model/message";
import Content from "../model/content";
import User from "../model/user";
import Chat from "../model/chat";

const createMessage = async (
  chatId: string,
  message: string,
  firebaseId: string,
) => {
  const userId = await User.findOne({ firebaseId }).select("_id").lean();

  if (!userId) {
    throw new BadRequestError("User not found");
  }

  const content = await Content.create({
    contentType: "text/plain",
    value: message,
    uploadedBy: userId,
  });

  const newMessage = await Message.create({
    chat: chatId,
    sender: userId,
    originalContent: content._id,
    translatedContents: [],
  });

  await newMessage.populate("sender");
  await newMessage.populate("originalContent");

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
    .lean();

  return messages;
};

export { createMessage, getAllMessages };

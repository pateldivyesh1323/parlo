import { BadRequestError } from "../middlewares/errorMiddleware";
import Message from "../model/message";
import Content from "../model/content";
import User from "../model/user";

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
  return newMessage;
};

export { createMessage };

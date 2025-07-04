import Chat from "../model/chat";
import User from "../model/user";
import { BadRequestError } from "../middlewares/errorMiddleware";

const createChat = async ({
  userId,
  userEmails,
  name,
  isGroupChat,
}: {
  userId: string;
  userEmails: string[];
  name: string;
  isGroupChat: boolean;
}) => {
  const user = await User.findOne({ firebaseId: userId }).select("_id email");
  if (!user) {
    throw new BadRequestError("User not found");
  }

  // Check for duplicate participants
  const participantsSet = new Set(userEmails.map((email) => email.trim()));
  participantsSet.add(user.email);

  // Check if all participants exist
  const usersCount = await User.countDocuments({
    email: { $in: Array.from(participantsSet) },
  });

  // Get participants
  let participants;

  if (usersCount !== participantsSet.size) {
    throw new BadRequestError("One or more users not found");
  } else {
    participants = await User.find({
      email: { $in: Array.from(participantsSet) },
    }).select("_id");
  }

  // Create chat
  let chat;

  if (isGroupChat) {
    if (participants.length < 3) {
      throw new BadRequestError("Group chat must have at least 3 participants");
    }

    chat = await Chat.create({
      name,
      isGroupChat,
      users: participants.map((participant) => participant._id),
      admin: user._id,
    });
  } else {
    if (participants.length !== 2) {
      throw new BadRequestError(
        "Personal chat must have exactly 2 participants",
      );
    }

    const existingChat = await Chat.findOne({
      users: { $all: participants.map((participant) => participant._id) },
    });

    if (existingChat) {
      throw new BadRequestError("Chat already exists");
    }

    const [participant1, participant2] = participants;

    chat = await Chat.create({
      users: [participant1._id, participant2._id],
    });
  }

  return chat;
};

const getAllChats = async (userId: string) => {
  const user = await User.findOne({ firebaseId: userId }).select("_id").lean();
  if (!user) {
    throw new BadRequestError("User not found");
  }

  const chats = await Chat.find({ users: { $in: [user._id] } })
    .populate({
      path: "latestMessage",
      populate: { path: "originalContent" },
    })
    .populate("users");
  return chats;
};

const getAllChatIds = async (userId: string) => {
  const user = await User.findOne({ firebaseId: userId });
  if (!user) {
    throw new BadRequestError("User not found");
  }

  const chats = await Chat.find({ users: { $in: [user._id] } })
    .select("_id")
    .lean();
  return chats.map((chat) => chat._id);
};

const hasUserAccess = async (firebaseId: string, chatId: string) => {
  const user = await User.findOne({ firebaseId }).select("_id").lean();
  if (!user) {
    return false;
  }

  const chat = await Chat.findOne({ _id: chatId, users: { $in: [user._id] } });
  return !!chat;
};

export { createChat, getAllChats, getAllChatIds, hasUserAccess };

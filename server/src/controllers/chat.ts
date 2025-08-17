import Chat from "../model/chat";
import User from "../model/user";
import { BadRequestError } from "../middlewares/errorMiddleware";
import { chatNamespace } from "../sockets";
import { redisClient } from "../lib/redis";

const createChat = async ({
  userId,
  participantEmails,
  name,
  isGroupChat,
}: {
  userId: string;
  participantEmails: string[];
  name: string;
  isGroupChat: boolean;
}) => {
  const user = await User.findOne({ firebaseId: userId }).select("_id email");
  if (!user) {
    throw new BadRequestError("User not found");
  }

  // Check for duplicate participants
  const participantsSet = new Set(
    participantEmails.map((email) => email.trim()),
  );
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
      isGroupChat: false,
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

const getAllChats = async (userId: string, filter: any = {}) => {
  const user = await User.findOne({ _id: userId }).select("_id").lean();
  if (!user) {
    throw new BadRequestError("User not found");
  }

  const chats = await Chat.find({ users: { $in: [user._id] }, ...filter })
    .populate({
      path: "latestMessage",
      populate: { path: "originalContent" },
    })
    .populate("users");
  return chats;
};

const getAllChatIds = async (userId: string) => {
  const user = await User.findOne({ _id: userId });
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

const notifyContacts = async ({
  userId,
  status,
}: {
  userId: string;
  status: string;
}) => {
  try {
    const chats = await getAllChats(userId, { isGroupChat: false });

    const contacts = chats
      .map((chat) =>
        chat.users.filter((user) => user._id.toString() !== userId),
      )
      .flat();

    contacts.forEach((contact) => {
      chatNamespace.to(contact._id.toString()).emit("presence", {
        userId,
        status,
      });
    });
  } catch (error) {
    console.error("Error notifying contacts:", error);
  }
};

const getAllOnlineUsers = async (userId: string) => {
  const chats = await getAllChats(userId, { isGroupChat: false });
  const contacts = chats
    .map((chat) => chat.users.filter((user) => user._id.toString() !== userId))
    .flat();

  const onlineUsers = await Promise.all(
    contacts.map(async (contact) => {
      const onlineUser = await redisClient.get(`presence:${contact._id}`);
      if (onlineUser === "online") {
        return contact._id;
      }
    }),
  );

  return onlineUsers.filter(Boolean);
};

export {
  createChat,
  getAllChats,
  getAllChatIds,
  hasUserAccess,
  notifyContacts,
  getAllOnlineUsers,
};

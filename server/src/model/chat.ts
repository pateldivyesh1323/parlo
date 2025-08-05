import { Schema, model, Types } from "mongoose";

const chatSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [3, "Chat name must be at least 3 characters long"],
      maxlength: [50, "Chat name must be less than 50 characters long"],
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    photoURL: {
      type: String,
    },
    users: [
      {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    admin: {
      type: Types.ObjectId,
      ref: "User",
    },
    latestMessage: {
      type: Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true },
);

const Chat = model("Chat", chatSchema);

export default Chat;

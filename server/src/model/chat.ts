import { Schema, model, Types } from "mongoose";

const chatSchema = new Schema(
  {
    name: {
      type: String,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
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

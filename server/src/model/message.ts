import { Schema, model, Types } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    originalContent: {
      type: Types.ObjectId,
      ref: "Content",
      required: true,
    },
    translatedContents: [
      {
        user: {
          type: Types.ObjectId,
          ref: "User",
          required: true,
        },
        language: {
          type: String,
          required: true,
        },
        content: {
          type: Types.ObjectId,
          ref: "Content",
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

const Message = model("Message", messageSchema);

export default Message;

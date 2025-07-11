import { Schema, model, Types } from "mongoose";

const contentSchema = new Schema(
  {
    contentType: {
      type: String,
      default: "text/plain",
      enum: [
        "text/plain",
        "audio/wav",
        "audio/mpeg",
        "image/jpeg",
        "image/png",
        "video/mp4",
        "application/pdf",
        "application/octet-stream",
      ],
    },
    value: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

const Content = model("Content", contentSchema);

export default Content;

import { Schema, model, Types } from "mongoose";
import { CONTENT_TYPES } from "../constants";

const contentSchema = new Schema(
  {
    contentType: {
      type: String,
      default: "text/plain",
      enum: Object.values(CONTENT_TYPES),
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

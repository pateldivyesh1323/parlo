import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    firebaseId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    photoURL: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = model("User", userSchema);

export default User;

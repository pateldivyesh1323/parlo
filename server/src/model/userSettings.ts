import { model, Schema } from "mongoose";

const userSettingsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  translationLanguage: {
    type: String,
    default: "en",
  },
});

const UserSettings = model("UserSettings", userSettingsSchema);

export default UserSettings;

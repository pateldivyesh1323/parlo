import User from "../model/user";
import { admin } from "../lib/firebaseAdmin";
import { NotFoundError } from "../middlewares/errorMiddleware";
import UserSettings from "../model/userSettings";

const register = async ({ firebaseId }: { firebaseId: string }) => {
  const user = await User.findOne({ firebaseId });
  if (user) {
    return user;
  }
  const userData = await admin.auth().getUser(firebaseId);
  const newUser = new User({
    name: userData.displayName || "",
    email: userData.email,
    firebaseId,
    photoURL: userData.photoURL,
  });
  await newUser.save();
  return newUser;
};

const getUserByFirebaseId = async ({ firebaseId }: { firebaseId: string }) => {
  const user = await User.findOne({ firebaseId });
  if (user) {
    return user;
  }
  throw new NotFoundError("User not found");
};

const getUserPreferences = async ({ userId }: { userId: string }) => {
  const userSettings = await UserSettings.findOneAndUpdate(
    { userId },
    {}, // no updates, just trigger upsert
    { new: true, upsert: true },
  );
  return userSettings;
};

const updatePersonalInfo = async ({
  userId,
  data,
}: {
  userId: string;
  data: { name: string };
}) => {
  const user = await User.findByIdAndUpdate(userId, data, { new: true });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

const updatePreferences = async ({
  userId,
  data,
}: {
  userId: string;
  data: { translationLanguage: string };
}) => {
  const userSettings = await UserSettings.findOneAndUpdate({ userId }, data, {
    new: true,
    upsert: true,
  });

  if (!userSettings) {
    throw new NotFoundError("User settings not found");
  }

  return userSettings;
};

export {
  register,
  getUserByFirebaseId,
  updatePersonalInfo,
  updatePreferences,
  getUserPreferences,
};

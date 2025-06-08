import User from "../model/user";
import admin from "../lib/firebaseAdmin";
import { NotFoundError } from "../middlewares/errorMiddleware";

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

export { register, getUserByFirebaseId };

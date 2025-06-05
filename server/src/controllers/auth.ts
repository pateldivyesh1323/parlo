import User from "../model/user";
import admin from "../lib/firebaseAdmin";

const register = async ({ firebaseId }: { firebaseId: string }) => {
  const user = await User.findOne({ firebaseId });
  if (user) {
    return { message: "User already registered" };
  }
  const userData = await admin.auth().getUser(firebaseId);
  console.log("User Data", userData);
  const newUser = new User({
    name: userData.displayName,
    email: userData.email,
    firebaseId,
    photoURL: userData.photoURL,
  });
  await newUser.save();
};

export { register };

import admin from "firebase-admin";

const firebaseServiceAccount = require("../keys/firebase-service-account-key.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccount),
  });
}

export default admin;

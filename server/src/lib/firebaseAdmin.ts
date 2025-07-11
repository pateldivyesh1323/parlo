import admin from "firebase-admin";

const firebaseServiceAccount = require("../keys/firebase-service-account-key.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccount),
    storageBucket: "weather-app-370012.firebasestorage.app",
  });
}

const storage = admin.storage();

const uploadAudio = async (audio: Buffer, fileName: string) => {
  const bucket = storage.bucket();
  const file = bucket.file(`audio/${fileName}`);

  await file.save(audio, {
    metadata: {
      contentType: "audio/wav",
    },
  });

  return file;
};

export { admin, storage, uploadAudio };

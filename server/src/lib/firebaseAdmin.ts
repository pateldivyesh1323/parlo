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

  const token = crypto.randomUUID();

  await file.save(audio, {
    metadata: {
      contentType: "audio/wav",
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });

  const [metadata] = await file.getMetadata();

  return `https://firebasestorage.googleapis.com/v0/b/${
    metadata.bucket
  }/o/${encodeURIComponent(
    metadata?.name as string | number,
  )}?alt=media&token=${token}`;
};

export { admin, storage, uploadAudio };

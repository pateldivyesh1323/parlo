import admin from "firebase-admin";
import ffmpeg from "fluent-ffmpeg";
import streamifier from "streamifier";

const firebaseServiceAccount = require("../keys/firebase-service-account-key.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccount),
    storageBucket: "weather-app-370012.firebasestorage.app",
  });
}

const storage = admin.storage();
const bucket = storage.bucket();

// FFMPEG is used to add metadata to audio files
ffmpeg.setFfmpegPath("ffmpeg");
const processAndUploadAudio = async (
  audio: Buffer,
  fileName: string,
  contentType = "audio/wav",
) => {
  return new Promise(async (resolve, reject) => {
    const inputStream = streamifier.createReadStream(audio);
    const fullFileName = `audio/${fileName}`;
    const file = bucket.file(fullFileName);

    const token = crypto.randomUUID();

    const outputStream = file.createWriteStream({
      metadata: {
        contentType,
        firebaseStorageDownloadTokens: token,
      },
    });

    // Handle upload stream events
    outputStream.on("error", reject);
    outputStream.on("finish", () => {
      // This fires when the upload is complete
      resolve(
        `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(
          file.name as string | number,
        )}?alt=media&token=${token}`,
      );
    });

    ffmpeg(inputStream)
      .format("wav")
      .audioCodec("pcm_s16le")
      .on("error", reject)
      .pipe(outputStream, { end: true });
  });
};

export { admin, storage, processAndUploadAudio };

const meta = import.meta.env;

export default {
  firebase: {
    apiKey: meta.VITE_FIREBASE_API_KEY,
    authDomain: meta.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: meta.VITE_FIREBASE_PROJECT_ID,
    storageBucket: meta.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: meta.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: meta.VITE_FIREBASE_APP_ID,
    measurementId: meta.VITE_FIREBASE_MEASUREMENT_ID,
  },
  server: {
    origin: meta.VITE_SERVER_ORIGIN,
  },
};

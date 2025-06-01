import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import environments from "@/environments";

const firebaseConfig = {
  apiKey: environments.firebase.apiKey,
  authDomain: environments.firebase.authDomain,
  projectId: environments.firebase.projectId,
  storageBucket: environments.firebase.storageBucket,
  messagingSenderId: environments.firebase.messagingSenderId,
  appId: environments.firebase.appId,
  measurementId: environments.firebase.measurementId,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVaBB2TcMTFlhCgo2ju9dq5SAGyAgx7Ws",
  authDomain: "gripen-storage.netlify.app/",
  projectId: "gripen-storage",
  storageBucket: "gripen-storage.firebasestorage.app",
  messagingSenderId: "366298778338",
  appId: "1:366298778338:web:584cbbd3a47e554a232cbb",
  measurementId: "G-7QW7EX5YXQ",
};

if (!firebaseConfig.apiKey) {
  throw new Error(
    "Firebase API key is not configured. Please check your .env file."
  );
}

if (!firebaseConfig.authDomain) {
  throw new Error(
    "Firebase auth domain is not configured. Please check your .env file."
  );
}

if (!firebaseConfig.projectId) {
  throw new Error(
    "Firebase project ID is not configured. Please check your .env file."
  );
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

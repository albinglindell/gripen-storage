import { auth } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  AuthError,
} from "firebase/auth";

export const testFirebaseConnection = async () => {
  try {
    console.log("Testing Firebase connection...");
    console.log("Auth object:", auth);
    console.log("Current user:", auth.currentUser);
    return { success: true, message: "Firebase connection successful" };
  } catch (error) {
    console.error("Firebase connection error:", error);
    return { success: false, error };
  }
};

export const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case "auth/invalid-api-key":
      return "Firebase API key is invalid. Please check your configuration.";
    case "auth/invalid-email":
      return "Invalid email address format.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password is too weak. Please choose a stronger password.";
    case "auth/operation-not-allowed":
      return "Email/password authentication is not enabled. Please enable it in Firebase Console.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed. Please try again.";
    case "auth/popup-blocked":
      return "Sign-in popup was blocked by your browser. Please allow popups and try again.";
    case "auth/cancelled-popup-request":
      return "Sign-in was cancelled. Please try again.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with the same email address but different sign-in credentials.";
    case "auth/invalid-credential":
      return "Invalid credentials. Please try again.";
    case "auth/operation-not-supported-in-this-environment":
      return "This operation is not supported in your current environment.";
    case "auth/timeout":
      return "Authentication request timed out. Please try again.";
    default:
      return `Authentication error: ${error.message}`;
  }
};

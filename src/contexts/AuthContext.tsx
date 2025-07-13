import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { AuthContextType, User, UserProfile } from "../types/auth";
import { getUserProfile } from "../services/firebaseService";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "gripen_auth_user";

const saveUserToStorage = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

const loadUserFromStorage = (): User | null => {
  try {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error loading user from localStorage:", error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadUserFromStorage()
  );
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async (uid: string) => {
    try {
      const profile = await getUserProfile(uid);
      setUserProfile(profile);
    } catch (error) {
      console.error("Error refreshing user profile:", error);
      setUserProfile(null);
    }
  };

  const signup = async (email: string, password: string): Promise<void> => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      console.log(
        "Google sign-in pop-up attempted (or successful if no error)!"
      );
    } catch (error: any) {
      console.error("Error during Google sign-in:", error.code, error.message);

      if (error.code === "auth/popup-blocked") {
        console.warn(
          "The browser blocked the sign-in pop-up. Please allow pop-ups for this site."
        );
      } else if (error.code === "auth/popup-closed-by-user") {
        console.log("The user closed the sign-in pop-up before completing.");
      } else if (error.code === "auth/cancelled-popup-request") {
        console.warn(
          "A previous pop-up request was cancelled by a new one. Only one pop-up allowed at a time."
        );
      }
    }
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user: FirebaseUser | null) => {
        if (user) {
          const userData: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          };
          setCurrentUser(userData);
          saveUserToStorage(userData);

          // Fetch user profile from Firestore
          await refreshProfile(user.uid);
        } else {
          setCurrentUser(null);
          setUserProfile(null);
          saveUserToStorage(null);
        }
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const hasProfile = userProfile !== null;

  const value: AuthContextType = {
    currentUser,
    userProfile,
    login,
    signup,
    loginWithGoogle,
    logout,
    loading,
    hasProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

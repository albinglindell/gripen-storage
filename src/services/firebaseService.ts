import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { UserProfile, Room } from "../types/auth";
import { CardboardBox, StorageItem } from "../types/storage";

const USERS_COLLECTION = "users";
const ROOMS_COLLECTION = "rooms";
const BOXES_COLLECTION = "boxes";

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export const createUserProfile = async (
  uid: string,
  email: string | null,
  displayName: string | null,
  address: string,
  rooms: Room[]
): Promise<void> => {
  try {
    const userProfile: Omit<UserProfile, "createdAt" | "updatedAt"> = {
      uid,
      email,
      displayName,
      address,
      rooms,
    };

    await setDoc(doc(db, USERS_COLLECTION, uid), {
      ...userProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  try {
    await updateDoc(doc(db, USERS_COLLECTION, uid), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const addRoom = async (
  uid: string,
  room: Omit<Room, "id">
): Promise<string> => {
  try {
    const roomRef = await addDoc(collection(db, ROOMS_COLLECTION), {
      ...room,
      userId: uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return roomRef.id;
  } catch (error) {
    console.error("Error adding room:", error);
    throw error;
  }
};

export const getUserRooms = async (uid: string): Promise<Room[]> => {
  try {
    const roomsQuery = query(
      collection(db, ROOMS_COLLECTION),
      where("userId", "==", uid)
    );
    const querySnapshot = await getDocs(roomsQuery);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        boxCount: data.boxCount || 0,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Room;
    });
  } catch (error) {
    console.error("Error getting user rooms:", error);
    throw error;
  }
};

export const deleteRoom = async (roomId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, ROOMS_COLLECTION, roomId));
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
};

export const addBox = async (
  userId: string,
  roomId: string,
  box: {
    boxNumber: string;
    description?: string;
    items?: StorageItem[];
    imageUrl?: string;
  }
): Promise<string> => {
  try {
    const boxRef = await addDoc(collection(db, BOXES_COLLECTION), {
      userId,
      roomId,
      boxNumber: box.boxNumber,
      description: box.description || "",
      items: box.items || [],
      imageUrl: box.imageUrl || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return boxRef.id;
  } catch (error) {
    console.error("Error adding box:", error);
    throw error;
  }
};

export const getBoxesForRoom = async (
  userId: string,
  roomId: string
): Promise<CardboardBox[]> => {
  try {
    const q = query(
      collection(db, "boxes"),
      where("userId", "==", userId),
      where("roomId", "==", roomId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CardboardBox[];
  } catch (error) {
    console.error("Error fetching boxes for room:", error);
    return [];
  }
};

export const getAllBoxesForUser = async (
  userId: string
): Promise<CardboardBox[]> => {
  try {
    const q = query(collection(db, "boxes"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CardboardBox[];
  } catch (error) {
    console.error("Error fetching all boxes for user:", error);
    return [];
  }
};

export const deleteBox = async (boxId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "boxes", boxId));
  } catch (error) {
    console.error("Error deleting box:", error);
    throw error;
  }
};

export const getBoxById = async (
  boxId: string
): Promise<CardboardBox | null> => {
  try {
    const boxDoc = await getDoc(doc(db, BOXES_COLLECTION, boxId));
    if (boxDoc.exists()) {
      const data = boxDoc.data();
      return {
        id: boxDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as CardboardBox;
    }
    return null;
  } catch (error) {
    console.error("Error getting box:", error);
    throw error;
  }
};

export const updateBox = async (
  boxId: string,
  updates: {
    boxNumber?: string;
    description?: string;
    items?: StorageItem[];
    imageUrl?: string;
  }
): Promise<void> => {
  try {
    await updateDoc(doc(db, BOXES_COLLECTION, boxId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating box:", error);
    throw error;
  }
};

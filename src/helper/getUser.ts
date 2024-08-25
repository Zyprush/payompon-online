import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserDataInterface } from "./interface";

export async function getUserData(uid: string): Promise<UserDataInterface | null> {
  try {
    // Directly reference the user document using the UID
    const userRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data() as UserDataInterface;
    } else {
      console.error("User not found");
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching user data:", error.message);
    return null;
  }
}

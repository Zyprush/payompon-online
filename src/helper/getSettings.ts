import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export const fetchFromSettings = async (target: string) => {
  try {
    const docRef = doc(db, "settings", "barangayInfo");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data[target] || "error";
    } else {
      return "error";
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
    return "error";
  }
};

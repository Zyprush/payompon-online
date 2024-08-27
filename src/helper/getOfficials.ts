import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // Ensure this path is correct

interface OfficialData {
  id: string;
  name: string;
  status: string;
  address: string;
  chairmanship?: string;
  position: string;
  contact: string;
}

interface OfficialsResult {
  punongBarangay: string | null;
  treasurer: string | null;
  secretary: string | null;
  skChairman: string | null;
  kagawad: string[];
}

export const getOfficials = async (): Promise<OfficialsResult> => {
  const querySnapshot = await getDocs(collection(db, "officials"));
  const officialsData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as OfficialData[];

  console.log("Fetched Officials Data:", officialsData); // Add this line to debug

  const result: OfficialsResult = {
    punongBarangay: null,
    treasurer: null,
    secretary: null,
    skChairman: null,
    kagawad: [],
  };

  officialsData.forEach((official) => {
    switch (official.position) {
      case "Punong Barangay":
        result.punongBarangay = official.name;
        break;
      case "Treasurer":
        result.treasurer = official.name;
        break;
      case "Secretary":
        result.secretary = official.name;
        break;
      case "SK Chairman":
        result.skChairman = official.name;
        break;
      case "Barangay Kagawad":
        result.kagawad.push(official.name);
        break;
      default:
        console.warn("Unknown position:", official.position); // Add this to catch unexpected values
        break;
    }
  });
  return result;
};


"use client";
import React, { useState, useEffect } from "react";
import NavLayout from "@/components/NavLayout";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // Ensure this path is correct
import { IconPhone } from "@tabler/icons-react";

interface OfficialData {
  id: string;
  name: string;
  status: string;
  address: string;
  chairmanship?: string;
  position: string;
  contact: string;
}

const OfficialTable: React.FC = (): JSX.Element => {
  const [officials, setOfficials] = useState<OfficialData[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isEmpty, setIsEmpty] = useState(false); // Empty data state

  useEffect(() => {
    const fetchOfficials = async () => {
      setIsLoading(true); // Start loading
      const querySnapshot = await getDocs(collection(db, "officials"));
      let officialsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as OfficialData[];

      // Sort the officials
      officialsData = officialsData.sort((a, b) => {
        if (a.position === "Punong Barangay") return -1;
        if (b.position === "Punong Barangay") return 1;
        if (a.position === "Barangay Kagawad" && b.position !== "Punong Barangay") return -1;
        if (b.position === "Barangay Kagawad" && a.position !== "Punong Barangay") return 1;
        return 0;
      });

      setOfficials(officialsData);
      setIsLoading(false); // End loading

      if (officialsData.length === 0) {
        setIsEmpty(true); // Set empty state if no data
      } else {
        setIsEmpty(false);
      }
    };

    fetchOfficials();
  }, []);

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg md:text-xl font-bold text-primary">Barangay Officials</h2>
      <div className="mt-4">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="text-sm text-gray-500">Loading officials...</div>
          </div>
        ) : isEmpty ? (
          <div className="flex justify-center items-center">
            <div className="text-sm text-gray-500">No officials found.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 md:px-6 border-b-2 border-gray-200 text-xs md:text-sm text-left">
                    Name
                  </th>
                  <th className="py-2 px-4 md:px-6 border-b-2 border-gray-200 text-xs md:text-sm text-left">
                    Position
                  </th>
                  <th className="py-2 px-4 md:px-6 border-b-2 border-gray-200 text-xs md:text-sm text-left">
                    Contact
                  </th>
                </tr>
              </thead>
              <tbody>
                {officials.map((official) => (
                  <tr key={official.id} className="font-[300] text-zinc-600">
                    <td className="py-2 px-4 md:px-6 border-b text-xs md:text-sm">
                      {official.name}
                    </td>
                    <td className="py-2 px-4 md:px-6 border-b text-xs md:text-sm">
                      {official.position}
                    </td>
                    <td className="py-2 px-4 md:px-6 border-b text-xs md:text-sm">
                      <a href={`tel:${official.contact}`} className="flex items-center">
                        <IconPhone className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                        {official.contact}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

  );
};

export default OfficialTable;

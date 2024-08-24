"use client";
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // Make sure this path is correct
import UserNavLayout from "@/components/UserNavLayout";

interface Official {
  id: string;
  name: string;
  status: string;
  address: string;
  chairmanship?: string;
  position: string;
  contact: string; // Added contact field
}

const Officials: React.FC = (): JSX.Element => {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOfficials = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "officials"),
          where("status", "==", "active")
        );
        const querySnapshot = await getDocs(q);
        const fetchedOfficials: Official[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Official[];

        // Sort officials: Those with "chairman" in position at the top
        fetchedOfficials.sort((a, b) => {
          const isChairmanA = /chairman/i.test(a.position);
          const isChairmanB = /chairman/i.test(b.position);

          if (isChairmanA && !isChairmanB) return -1;
          if (!isChairmanA && isChairmanB) return 1;
          return 0;
        });

        setOfficials(fetchedOfficials);
      } catch (error) {
        console.error("Error fetching officials: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfficials();
  }, []);

  return (
    <UserNavLayout>
      <div className="p-1 md:p-4 md:pt-0">
        <h2 className="text-xl font-bold mb-4 text-primary drop-shadow">Active Officials</h2>
        {loading ? (
          <p>Loading...</p>
        ) : officials.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b text-left text-sm text-gray-600">Name</th>
                  <th className="px-4 py-2 border-b text-left text-sm text-gray-600">Position</th>
                  <th className="px-4 py-2 border-b text-left text-sm text-gray-600">Status</th>
                  <th className="px-4 py-2 border-b text-left text-sm text-gray-600">Contact</th> {/* Updated header */}
                  <th className="px-4 py-2 border-b text-left text-sm text-gray-600">Chairmanship</th>
                </tr>
              </thead>
              <tbody>
                {officials.map((official) => (
                  <tr key={official.id}>
                    <td className="px-4 py-2 border-b text-xs">{official.name}</td>
                    <td className="px-4 py-2 border-b text-xs">{official.position}</td>
                    <td className="px-4 py-2 border-b text-xs">{official.status}</td>
                    <td className="px-4 py-2 border-b text-xs">{official.contact}</td> {/* Updated cell */}
                    <td className="px-4 py-2 border-b text-xs">
                      {official.chairmanship || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No active officials found.</p>
        )}
      </div>
    </UserNavLayout>
  );
};

export default Officials;

"use client";
import React, { useState, useEffect } from "react";
import NavLayout from "@/components/NavLayout";
import AddOfficial from "./AddOfficial";
import EditOfficial from "./EditOfficial";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase"; // Ensure this path is correct
import { IconPhone } from "@tabler/icons-react";

interface OfficialData {
  id: string;
  name: string;
  address: string;
  chairmanship?: string;
  position: string;
  contact: string; // Updated to string
}

const Official: React.FC = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [officials, setOfficials] = useState<OfficialData[]>([]);
  const [currentOfficial, setCurrentOfficial] = useState<OfficialData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isEmpty, setIsEmpty] = useState(false); // Empty data state

  useEffect(() => {
    const fetchOfficials = async () => {
      setIsLoading(true); // Start loading
      const querySnapshot = await getDocs(collection(db, "officials"));
      const officialsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as OfficialData[];

      setOfficials(officialsData);
      setIsLoading(false); // End loading

      if (officialsData.length === 0) {
        setIsEmpty(true); // Set empty state if no data
      } else {
        setIsEmpty(false);
      }
    };

    fetchOfficials();
  }, [isModalOpen, editModalOpen]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this official?"
    );
    if (confirmed) {
      try {
        await deleteDoc(doc(db, "officials", id));
        setOfficials(officials.filter((official) => official.id !== id));

        if (officials.length === 1) {
          setIsEmpty(true); // Update empty state if last item is deleted
        }
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  };

  const handleEdit = (official: OfficialData) => {
    setCurrentOfficial(official);
    setEditModalOpen(true);
  };

  return (
    <NavLayout>
      <div className="p-4">
        <button
          className="py-2 px-4 bg-primary text-sm font-semibold text-white rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Add Official
        </button>
        <AddOfficial
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <EditOfficial
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          officialId={currentOfficial?.id || ""}
          initialData={{
            name: currentOfficial?.name || "",
            address: currentOfficial?.address || "",
            chairmanship: currentOfficial?.chairmanship || "",
            position: currentOfficial?.position || "",
            contact: currentOfficial?.contact || "",
          }}
        />

        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="text-sm text-gray-500">Loading officials...</div>
            </div>
          ) : isEmpty ? (
            <div className="flex justify-center items-center">
              <div className="text-sm text-gray-500">No officials found.</div>
            </div>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-200 text-sm text-left">
                    Name
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 text-sm text-left">
                    Address
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 text-sm text-left">
                    Chairmanship
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 text-sm text-left">
                    Position
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 text-sm text-left">
                    Contact
                  </th>{" "}
                  {/* Updated header */}
                  <th className="py-2 px-4 border-b-2 border-gray-200 text-sm text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {officials.map((official) => (
                  <tr key={official.id}>
                    <td className="py-2 px-4 border-b text-xs">
                      {official.name}
                    </td>
                    <td className="py-2 px-4 border-b text-xs">
                      {official.address}
                    </td>
                    <td className="py-2 px-4 border-b text-xs">
                      {official.chairmanship || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b text-xs">
                      {official.position}
                    </td>
                    <td className="py-2 px-4 border-b text-xs">
                      <a
                        href={`tel:${official.contact}`}
                        className="flex items-center"
                      >
                        <IconPhone className="h-5 w-5 mr-2" />
                        {official.contact}
                      </a>
                    </td>{" "}
                    {/* Updated cell */}
                    <td className="py-2 px-4 border-b flex space-x-2">
                      <button
                        className="btn btn-xs text-neutral btn-outline rounded-sm"
                        onClick={() => handleEdit(official)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-xs btn-error rounded-sm text-white"
                        onClick={() => handleDelete(official.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </NavLayout>
  );
};

export default Official;

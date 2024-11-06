"use client";

import React, { useState, useEffect } from "react";
import NavLayout from "@/components/NavLayout";
import AddStaff from "./AddStaff";
import EditStaff from "./EditStaff";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "@/firebase";

interface StaffData {
  id: string;
  name: string;
  sitio: string; // Updated to match the new schema
  position: string;
  contact: string;
  email: string;
  civilStatus?: string; // Optional if not present
  gender?: string; // Optional if not present
  account?: {
    email: string;
    password: string;
  };
}

const Staff: React.FC = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [staff, setStaff] = useState<StaffData[]>([]);
  const [currentStaff, setCurrentStaff] = useState<StaffData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      setIsLoading(true);
      const staffQuery = query(collection(db, "users"), where("role", "==", "staff"));
      const querySnapshot = await getDocs(staffQuery);
      const staffData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as StaffData[];

      setStaff(staffData);
      setIsLoading(false);

      if (staffData.length === 0) {
        setIsEmpty(true);
      } else {
        setIsEmpty(false);
      }
    };

    fetchStaff();
  }, [isModalOpen, editModalOpen]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this staff member?");
    if (confirmed) {
      try {
        await deleteDoc(doc(db, "users", id));
        setStaff(staff.filter((staffMember) => staffMember.id !== id));

        if (staff.length === 1) {
          setIsEmpty(true);
        }
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  };

  const handleEdit = (staffMember: StaffData) => {
    setCurrentStaff(staffMember);
    setEditModalOpen(true);
  };

  return (
    <NavLayout>
      <div className="p-4">
        <button
          className="py-2 px-4 bg-primary text-sm font-semibold text-white rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Add new personnel
        </button>
        <AddStaff isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <EditStaff
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          staffId={currentStaff?.id || ""}
          initialData={{
            name: currentStaff?.name || "",
            sitio: currentStaff?.sitio || "", // Updated to match the new schema
            contact: currentStaff?.contact || "",
            email: currentStaff?.email || "",
            password: currentStaff?.account?.password || "", // Handle missing account gracefully
            civilStatus: currentStaff?.civilStatus || "", // Optional fields
            gender: currentStaff?.gender || "", // Optional fields
          }}
        />

        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="text-sm text-gray-500">Loading staff...</div>
            </div>
          ) : isEmpty ? (
            <div className="flex justify-center items-center">
              <div className="text-sm text-gray-500">No staff members found.</div>
            </div>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-200 text-sm text-left">Name</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 text-sm text-left">Gender</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 text-sm text-left">Position</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 text-sm text-left">Contact</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 text-sm text-left">Email</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 text-sm text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((staffMember) => (
                  <tr key={staffMember.id}>
                    <td className="py-2 px-4 border-b text-xs">{staffMember.name}</td>
                    <td className="py-2 px-4 border-b text-xs">{staffMember.gender}</td>
                    <td className="py-2 px-4 border-b text-xs">{staffMember.position}</td>
                    <td className="py-2 px-4 border-b text-xs">{staffMember.contact}</td>
                    <td className="py-2 px-4 border-b text-xs">{staffMember.email}</td>
                    <td className="py-2 px-4 border-b flex space-x-2">
                      <button
                        className="btn btn-xs text-neutral btn-outline rounded-sm"
                        onClick={() => handleEdit(staffMember)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-xs btn-error rounded-sm text-white"
                        onClick={() => handleDelete(staffMember.id)}
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

export default Staff;

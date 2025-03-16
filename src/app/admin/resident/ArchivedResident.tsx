"use client";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import ViewResident from "./ViewResident";
import Link from "next/link";
import { format } from "date-fns";
import { useLogs } from "@/hooks/useLogs";
import { currentTime } from "@/helper/time";
import useUserData from "@/hooks/useUserData";

interface User {
  id: string;
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  number: string;
  gender: string;
  sitio: string;
  civilStatus: string;
  verified: boolean;
  validID: string;
  validIDBack: string;
  validIDType: string;
  selfie: string;
  infoErrors?: string;
  submitted: boolean;
  verifiedAt?: string;
  address: string;
}

const ArchivedResident: React.FC = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const {addLog} = useLogs();
  const {userRole, name} = useUserData();

  const auth = getAuth();

  const fetchUsers = async () => {
    setLoading(true);
    const q = query(
      collection(db, "archived"),
      where("role", "==", "resident"),
    );

    const querySnapshot = await getDocs(q);
    const usersList: User[] = [];

    querySnapshot.forEach((doc) => {
      usersList.push({ id: doc.id, ...doc.data() } as User);
    });

    setUsers(usersList);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRestore = async (userId: string) => {
    const confirmRestore = window.confirm(
      "Are you sure you want to restore this resident?"
    );
    if (!confirmRestore) return;
    try {
      const userRef = doc(db, "archived", userId);
      const restoredRef = doc(db, "users", userId); // Use the same document ID
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        throw new Error("User document does not exist.");
      }
      await setDoc(restoredRef, userDoc.data());
      await deleteDoc(userRef);
      setUsers((prev) => prev.filter((item) => item.id !== userId));
      addLog({
        name:  `Restored ${userDoc.data()?.firstname + ' ' + userDoc.data()?.lastname} account`,
        date: currentTime,
        role: userRole,
        actionBy: name
      })
      window.alert("Resident restored successfully!");
    } catch (error) {
      console.error("Error restoring resident: ", error);
      window.alert("Error restoring resident. Please try again.");
    }
  };

  const handleDelete = async (userId: string, email: string) => {
    const confirmDelete = window.prompt(
      "Are you sure you want to permanently delete this resident? This action cannot be undone. Please enter your email address to confirm."
    );
    if (!confirmDelete || confirmDelete !== email) return;
    
    try {
      const userRef = doc(db, "archived", userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error("User document does not exist.");
      }

      // Delete the document from the archived collection
      await deleteDoc(userRef);

      // Remove the user from the local state
      setUsers((prev) => prev.filter((item) => item.id !== userId));

      // Log the deletion
      addLog({
        name: `Permanently deleted ${userDoc.data()?.firstname + ' ' + userDoc.data()?.lastname} account`,
        date: currentTime,
        role: userRole,
        actionBy: name
      });

      window.alert("Resident permanently deleted!");
    } catch (error) {
      console.error("Error deleting resident: ", error);
      window.alert("Error deleting resident. Please try again.");
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.firstname} ${user.middlename} ${user.lastname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="md:px-4 flex flex-col">
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-sm input-bordered w-full max-w-xs"
        />
      </div>
      {loading ? (
        <span className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto">
          <span className="loading loading-spinner loading-md"></span> Loading
          Residents...
        </span>
      ) : filteredUsers.length === 0 ? (
        <span className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto">
          No archived residents found.
        </span>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                Selfie
              </th>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                Name
              </th>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                Email
              </th>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                Verified At
              </th>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                Contact
              </th>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b text-xs font-semibold">
                  {user.selfie ? (
                    <>
                      <a
                        href={user.selfie}
                        target="_blank"
                        rel="noopener noreferrer"
                        className=""
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={user.selfie}
                          alt="Selfie"
                          className="w-14 h-14 object-cover border shadow-sm rounded-full"
                        />
                      </a>
                    </>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={"/img/profile.jpg"}
                      alt="Selfie"
                      className="w-14 h-14 object-cover border shadow-sm rounded-full"
                    />
                  )}
                </td>
                <td className="py-2 px-4 border-b text-xs">
                  {user.firstname} {user.middlename} {user.lastname}
                </td>
                <td className="py-2 px-4 border-b text-xs">{user.email}</td>
                <td className="py-2 px-4 border-b text-xs">
                  {user.verifiedAt
                    ? format(
                        new Date(user.verifiedAt),
                        "MMM dd, yyyy : hh:mm a"
                      )
                    : ""}
                </td>
                <td className="py-2 px-4 border-b text-xs">{user.number}</td>
                <td className="py-2 px-4 border-b text-xs font-semibold space-x-3">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="btn-outline text-primary rounded-sm btn-xs btn"
                  >
                    details
                  </button>
                  <Link
                    href={`/admin/resident/${user.id}`}
                    className="text-white btn-primary rounded-sm btn-xs btn"
                  >
                    update
                  </Link>
                  <button
                    onClick={() => handleRestore(user.id)}
                    className="btn-success text-white rounded-sm btn-xs btn"
                  >
                    restore
                  </button>
                  <button
                    onClick={() => handleDelete(user.id, user.email)}
                    className="btn-error text-white rounded-sm btn-xs btn"
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedUser && (
        <ViewResident
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default ArchivedResident;
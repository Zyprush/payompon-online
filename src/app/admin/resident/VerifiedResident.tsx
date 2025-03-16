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
import { currentTime } from "@/helper/time";
import { useLogs } from "@/hooks/useLogs";
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

const VerifiedResident: React.FC = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>([]);
  const [sitioList, setSitioList] = useState<string[]>([]);
  const [selectedSitio, setSelectedSitio] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { addLog } = useLogs();
  const { userRole, name } = useUserData();

  const auth = getAuth();

  const fetchUsers = async () => {
    setLoading(true);
    const q = query(
      collection(db, "users"),
      where("role", "==", "resident"),
      where("verified", "==", true)
    );

    const querySnapshot = await getDocs(q);
    const usersList: User[] = [];
    const sitioSet: Set<string> = new Set();

    querySnapshot.forEach((doc) => {
      const userData = { id: doc.id, ...doc.data() } as User;
      usersList.push(userData);
      if (userData.sitio) {
        sitioSet.add(userData.sitio);
      }
    });

    setUsers(usersList);
    setSitioList(Array.from(sitioSet));
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleArchive = async (userId: string) => {
    const confirmArchive = window.confirm(
      "Are you sure you want to archive this resident?"
    );
    if (!confirmArchive) return;
    try {
      const userRef = doc(db, "users", userId);
      const archivedRef = doc(db, "archived", userId); // Use the same document ID
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        throw new Error("User document does not exist.");
      }
      await setDoc(archivedRef, userDoc.data());
      await deleteDoc(userRef);
      setUsers((prev) => prev.filter((item) => item.id !== userId));
      addLog({
        name: `Archived ${userDoc.data()?.firstname + " " + userDoc.data()?.lastname} account`,
        date: currentTime,
        role: userRole,
        actionBy: name,
      });
      window.alert("Resident archived successfully!");
    } catch (error) {
      console.error("Error archiving resident: ", error);
      window.alert("Error archiving resident. Please try again.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesName = `${user.firstname} ${user.middlename} ${user.lastname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSitio = selectedSitio ? user.sitio === selectedSitio : true;
    return matchesName && matchesSitio;
  });

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
        <select
          value={selectedSitio}
          onChange={(e) => setSelectedSitio(e.target.value)}
          className="select select-sm select-bordered max-w-xs"
        >
          <option value="">All Sitios</option>
          {sitioList.map((sitio) => (
            <option key={sitio} value={sitio}>
              {sitio}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <span className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto">
          <span className="loading loading-spinner loading-md"></span> Loading
          Residents...
        </span>
      ) : filteredUsers.length === 0 ? (
        <span className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto">
          No verified residents found.
        </span>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
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
                    Details
                  </button>
                  <Link
                    href={`/admin/resident/${user.id}`}
                    className="text-white btn-primary rounded-sm btn-xs btn"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleArchive(user.id)}
                    className="btn-error text-white rounded-sm btn-xs btn"
                  >
                    Delete
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

export default VerifiedResident;

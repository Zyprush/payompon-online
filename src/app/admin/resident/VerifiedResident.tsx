"use client";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import ViewResident from "./ViewResident";
import Link from "next/link";
import { format } from "date-fns";

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
  validIDType: string;
  selfie: string;
  infoErrors?: string;
  submitted: boolean;
  verifiedAt?: string;
  address: string;
}

const VerifiedResident: React.FC = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const auth = getAuth();

  const fetchUsers = async () => {
    setLoading(true);
    const q = query(
      collection(db, "users"),
      where("role", "==", "resident"),
      where("verified", "==", true),
      limit(50)
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

  const handleDelete = async (user: User) => {
    const emailConfirmation = window.prompt(
      `Type "${user.email}" to confirm deletion:`
    );
    if (emailConfirmation !== user.email) {
      alert("Email does not match. Deletion canceled.");
      return;
    }

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "users", user.id));

      // Delete from Firebase Auth
      // if (user.email) {
      //   await deleteUser(authUser);
      //   alert("User email deleted successfully.");
      //   console.log("User email deleted successfully.");
      // }

      // Update local state to remove deleted user
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
      alert("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
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
                Valid ID
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b text-xs font-semibold">
                  {user.selfie ? (
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
                    ? format(new Date(user.verifiedAt), "MMM dd, yyyy")
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
                    onClick={() => handleDelete(user)}
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

export default VerifiedResident;

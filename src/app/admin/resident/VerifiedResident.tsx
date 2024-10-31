"use client";
import { db } from "@/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
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
                Email
              </th>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                Verified At
              </th>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                Contact
              </th>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                Gender
              </th>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                Valid ID
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b text-xs">{user.firstname} {user.middlename} {user.lastname}</td>
                <td className="py-2 px-4 border-b text-xs">{user.email}</td>
                <td className="py-2 px-4 border-b text-xs">{user.verifiedAt ? format(new Date(user.verifiedAt), "MMM dd, yyyy") : ""}</td>
                <td className="py-2 px-4 border-b text-xs">{user.number}</td>
                <td className="py-2 px-4 border-b text-xs">{user.gender}</td>
                <td className="py-2 px-4 border-b text-xs font-semibold flex gap-3">
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

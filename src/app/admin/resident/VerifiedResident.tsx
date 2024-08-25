"use client";
import { db } from "@/firebase";
import { collection, query, where, getDocs, limit, startAt, endAt, orderBy } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toTitleCase } from "@/helper/string";

interface User {
  id: string;
  name: string;
  email: string;
  number: string;
  gender: string;
  sitio: string;
  civilStatus: string;
  verified: boolean;
  validID: string;
}

const VerifiedResident: React.FC = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState<string>("");

  const fetchUsers = async () => {
    setLoading(true);

    const searchRegex = submittedSearchTerm.toLowerCase();
    const q = query(
      collection(db, "users"),
      where("role", "==", "resident"),
      where("verified", "==", true),
      orderBy("name"),
      startAt(searchRegex),
      endAt(searchRegex + "\uf8ff"),
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedSearchTerm]);

  const handleSearch = () => {
    setSubmittedSearchTerm(searchTerm);
  };

  return (
    <div className="md:px-4 flex flex-col">
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <button
          onClick={handleSearch}
          className="btn btn-primary text-white"
        >
          Search
        </button>
      </div>

      {loading ? (
        <span className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto">
          <span className="loading loading-spinner loading-md"></span> Loading
          Residents...
        </span>
      ) : users.length === 0 ? (
        <span className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto">No verified residents found.</span>
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
                Contact
              </th>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                Gender
              </th>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                Sitio
              </th>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                Civil Status
              </th>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                Valid ID
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b text-xs">
                  {toTitleCase(user.name)}
                </td>
                <td className="py-2 px-4 border-b text-xs">{user.email}</td>
                <td className="py-2 px-4 border-b text-xs">{user.number}</td>
                <td className="py-2 px-4 border-b text-xs">
                  {toTitleCase(user.gender)}
                </td>
                <td className="py-2 px-4 border-b text-xs">
                  {toTitleCase(user.sitio)}
                </td>
                <td className="py-2 px-4 border-b text-xs">
                  {toTitleCase(user.civilStatus)}
                </td>
                <td className="py-2 px-4 border-b text-xs font-semibold">
                  {user.validID ? (
                    <a
                      href={user.validID}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      View ID
                    </a>
                  ) : (
                    "No ID Uploaded"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VerifiedResident;

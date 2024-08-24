"use client";
import { db } from "@/firebase";
import NavLayout from "@/components/NavLayout";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

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

const Resident: React.FC = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, "users"), where("role", "==", "resident"));
      const querySnapshot = await getDocs(q);

      const usersList: User[] = [];
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() } as User);
      });
      setUsers(usersList);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleVerify = async (userId: string, isVerified: boolean) => {
    await updateDoc(doc(db, "users", userId), {
      verified: isVerified,
    });

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, verified: isVerified } : user
      )
    );
  };

  const handleDeclined = async (userId: string) => {
    await updateDoc(doc(db, "users", userId), {
      verified: false,
    });

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, verified: false } : user
      )
    );
  };

  return (
    <NavLayout>
      <div className="p-4">
        <h1 className="text-xl text-primary drop-shadow font-bold mb-4">
          Unverified Resident
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p>No pending resident verification</p>
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
                <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-2 px-4 border-b text-xs">{user.name}</td>
                  <td className="py-2 px-4 border-b text-xs">{user.email}</td>
                  <td className="py-2 px-4 border-b text-xs">{user.number}</td>
                  <td className="py-2 px-4 border-b text-xs">{user.gender}</td>
                  <td className="py-2 px-4 border-b text-xs">{user.sitio}</td>
                  <td className="py-2 px-4 border-b text-xs">
                    {user.civilStatus}
                  </td>
                  <td className="py-2 px-4 border-b text-xs">
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
                  <td className="py-2 px-4 border-b flex gap-3">
                    <button
                      onClick={() => handleDeclined(user.id)}
                      className="btn-xs btn-outline text-neutral btn rounded"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleVerify(user.id, true)}
                      className="btn btn-xs rounded btn-primary text-white"
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </NavLayout>
  );
};

export default Resident;

"use client";
import { db } from "@/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useMessageStore } from "@/state/message";
import { useNotifStore } from "@/state/notif";
import ViewResident from "./ViewResident";
import VerifyModal from "./VerifyModal";
import { format } from "date-fns";
import { useLogs } from "@/hooks/useLogs";
import useUserData from "@/hooks/useUserData";
import Link from "next/link";

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

const UnverifiedResident: React.FC = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // For search
  const [sitioList, setSitioList] = useState<string[]>([]);
  const [selectedSitio, setSelectedSitio] = useState<string>("All"); // For sitio filtering
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showResident, setShowResident] = useState<boolean>(false);

  const fetchUsers = async () => {
    const q = query(
      collection(db, "users"),
      where("role", "==", "resident"),
      where("verified", "==", false),
      where("submitted", "==", true)
    );
    const querySnapshot = await getDocs(q);

    const usersList: User[] = [];
    const sitioSet = new Set<string>();

    querySnapshot.forEach((doc) => {
      const user = { id: doc.id, ...doc.data() } as User;
      usersList.push(user);
      if (user.sitio) sitioSet.add(user.sitio);
    });

    setUsers(usersList);
    setSitioList(["All", ...Array.from(sitioSet)]);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleSitioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSitio(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = `${user.firstname} ${user.middlename} ${user.lastname}`
      .toLowerCase()
      .includes(searchTerm);
    const matchesSitio = selectedSitio === "All" || user.sitio === selectedSitio;

    return matchesSearch && matchesSitio;
  });

  return (
    <div className="flex flex-col">
      {/* Search Input */}
      <div className="flex gap-5">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 mb-4 border w-60 text-sm rounded-md"
        />

        <select
          value={selectedSitio}
          onChange={handleSitioChange}
          className="p-2 mb-4 border w-60 text-sm rounded-md"
        >
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
          No pending resident verification
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
                Contact
              </th>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                Registered At
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
                    <a
                      href={user.selfie}
                      target="_blank"
                      rel="noopener noreferrer"
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
                <td className="py-2 px-4 border-b text-xs">{`${user.firstname} ${user.middlename} ${user.lastname}`}</td>
                <td className="py-2 px-4 border-b text-xs">{user.email}</td>
                <td className="py-2 px-4 border-b text-xs">{user.number}</td>
                <td className="py-2 px-4 border-b text-xs">
                  {user.verifiedAt
                    ? format(new Date(user.verifiedAt), "MMM dd, yyyy : hh:mm a")
                    : ""}
                </td>
                <td className="py-2 px-4 border-b text-xs">
                  <button
                    onClick={() => {
                      setShowResident(true);
                      setSelectedUser(user);
                    }}
                    className="btn-outline text-primary rounded-sm btn-xs btn mr-3"
                  >
                    details
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setSelectedUser(user);
                    }}
                    className="btn btn-xs rounded-sm btn-primary text-white"
                  >
                    verify
                  </button>
                  <Link
                    href={"/admin/resident/reject/" + user.id}
                    className="btn btn-xs rounded-sm btn-outline text-error ml-2"
                  >
                    reject
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

{showResident && (
        <ViewResident
          user={selectedUser}
          onClose={() => {
            setSelectedUser(null);
            setShowResident(false);
          }}
        />
      )}

      {showModal && selectedUser && (
        <VerifyModal
          userId={selectedUser.id}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
          onVerified={fetchUsers}
        />
      )}
    </div>
  );
};

export default UnverifiedResident;

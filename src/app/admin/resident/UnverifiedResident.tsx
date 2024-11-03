"use client";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useMessageStore } from "@/state/message";
import { useNotifStore } from "@/state/notif";
import ViewResident from "./ViewResident";
import VerifyModal from "./VerifyModal";
import { format } from "date-fns/format";

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
  const { addMessage } = useMessageStore();
  const { addNotif } = useNotifStore();
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
    querySnapshot.forEach((doc) => {
      usersList.push({ id: doc.id, ...doc.data() } as User);
    });
    setUsers(usersList);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleReject = async (userId: string) => {
    const reason = prompt(
      "Please enter the reason for rejection eg: resubmit selfie, enter correct name, etc"
    );
    if (!reason) return;

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        infoErrors: reason,
        submitted: false,
      });

      const currentTime = new Date().toISOString();
      const user = users.find((user) => user.id === userId);

      addMessage({
        message: "Your account verification has been rejected.",
        sender: "admin",
        receiverId: userId,
        receiverName: user ? `${user.firstname} ${user.lastname}` : "Unknown",
        senderName: "Admin",
        seen: false,
        time: currentTime,
        for: "user",
      });

      await addNotif({
        for: userId,
        message: "Your account verification was rejected. Reason: " + reason,
        time: currentTime,
        type: "user",
        read: false,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, submitted: false, infoErrors: reason }
            : user
        )
      );

      await fetchUsers();
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredUsers = users.filter((user) =>
    `${user.firstname} ${user.middlename} ${user.lastname}`
      .toLowerCase()
      .includes(searchTerm)
  );

  return (
    <div className="flex flex-col">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
        className="p-2 mb-4 border w-60 text-sm rounded-md"
      />

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
                <td className="py-2 px-4 border-b text-xs">{`${user.firstname} ${user.middlename} ${user.lastname}`}</td>
                <td className="py-2 px-4 border-b text-xs">{user.email}</td>
                <td className="py-2 px-4 border-b text-xs">{user.number}</td>
                <td className="py-2 px-4 border-b text-xs">
                  {" "}
                  {user.verifiedAt
                    ? format(
                        new Date(user.verifiedAt),
                        "MMM dd, yyyy : hh:mm a"
                      )
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
                  <button
                    onClick={() => handleReject(user.id)}
                    className="btn btn-xs ml-2 rounded-sm btn-error text-white"
                  >
                    reject
                  </button>
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

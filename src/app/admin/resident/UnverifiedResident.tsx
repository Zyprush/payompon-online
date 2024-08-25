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

const UnverifiedResident: React.FC = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeclineModal, setShowDeclineModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [declineMessage, setDeclineMessage] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const { addMessage, loadingMessage } = useMessageStore();

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(
        collection(db, "users"),
        where("role", "==", "resident"),
        where("verified", "==", false)
      );
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
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        verified: isVerified,
      });
  
      const currentTime = new Date().toISOString(); // Get current time in ISO format
      // Add a message for the user
      addMessage({
        message:
          "Your account has been verified. You can now access services like requesting certification and permit.",
        sender: "admin",
        receiver: userId,
        seen: false,
        time: currentTime,
      });
  
      // Update the users state to reflect the change
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, verified: isVerified } : user
        )
      );
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };
  

  const handleDeclined = async (userId: string) => {
    if (declineMessage.trim() === "") {
      alert("Please enter a message before sending.");
      return;
    }
    setSending(true); // Set sending state to true

    const currentTime = new Date().toISOString(); // Get current time in ISO format

    await addMessage({
      message: declineMessage,
      sender: "admin",
      receiver: userId,
      seen: false,
      time: currentTime, // Include time in the message
    });

    await updateDoc(doc(db, "users", userId), {
      submitted: false,
    });

    setSending(false); // Set sending state back to false
    setShowDeclineModal(false);
    setDeclineMessage("");
  };

  return (
      <div className="md:px-4 flex flex-col">
        {loading ? (
          <span className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto">
            <span className="loading loading-spinner loading-md"></span> Loading
            Residents...
          </span>
        ) : users.length === 0 ? (
          <span className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto">No pending resident verification</span>
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
                  <td className="py-2 px-4 border-b flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedUser(user.id);
                        setShowDeclineModal(true);
                      }}
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

        {/* Decline Modal */}
        {showDeclineModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-lg font-bold mb-1 text-gray-700">
                Decline Message
              </h2>
              <h2 className="text-sm mb-4 text-gray-500">
                State here why you declined permission for this account and
                provide additional instructions if necessary.
              </h2>
              <textarea
                value={declineMessage}
                onChange={(e) => setDeclineMessage(e.target.value)}
                placeholder="Enter your message here..."
                rows={5}
                className="w-full p-2 border border-gray-300 rounded mb-4 text-sm"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeclineModal(false)}
                  className="btn btn-outline btn-neutral"
                >
                  Cancel
                </button>
                <button
                  onClick={() => selectedUser && handleDeclined(selectedUser)}
                  disabled={sending}
                  className={`btn btn-primary text-white px-6 ${
                    sending ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default UnverifiedResident;

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
import { useMessageStore } from "@/state/message";

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
  const [showDeclineModal, setShowDeclineModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [declineMessage, setDeclineMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const { addMessage, loadingMessage } = useMessageStore();

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
    const currentTime = new Date().toISOString(); // Get current time in ISO format

    addMessage({
      message: "Your account has been verified. You can now access services like requesting certification and permit",
      sender: "admin",
      receiver: userId,
      seen: false,
      time: currentTime,
    });

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, verified: isVerified } : user
      )
    );
  };

  const handleDeclined = async (userId: string) => {
    if (declineMessage.trim() === '') {
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
    setSending(false); // Set sending state back to false
    setShowDeclineModal(false);
    setDeclineMessage('');
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
              <h2 className="text-lg font-bold mb-1 text-gray-700">Decline Message</h2>
              <h2 className="text-sm mb-4 text-gray-500">State here why you declined permission for this account and provide additional instructions if necessary.</h2>
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
                  className={`btn btn-primary text-white px-6 ${sending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </NavLayout>
  );
};

export default Resident;

"use client";
import NavLayout from "@/components/NavLayout";
import { auth } from "@/firebase";
import { useMessageStore } from "@/state/message";
import React, { useState, useEffect } from "react";

const Message: React.FC = (): JSX.Element => {
  const { messages, fetchMessageReceivedUser, fetchMessageSentUser } =
    useMessageStore((state) => ({
      messages: state.messages,
      fetchMessageReceivedUser: state.fetchMessageReceivedUser,
      fetchMessageSentUser: state.fetchMessageSentUser,
    }));

  const [filter, setFilter] = useState<"sent" | "received">("received");
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      setCurrentUserId(user.uid);
    } else {
      console.error("No current user found");
    }
  }, [user]);

  useEffect(() => {
    if (currentUserId) {
      if (filter === "sent") {
        fetchMessageSentUser(currentUserId);
      } else {
        fetchMessageReceivedUser(currentUserId);
      }
    }
  }, [filter, currentUserId, fetchMessageReceivedUser, fetchMessageSentUser]);

  const openModal = (msg: any) => {
    setSelectedMessage(msg);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const filteredMessages = messages?.filter((msg) =>
    filter === "sent"
      ? msg.sender === currentUserId
      : msg.receiver === currentUserId
  );

  return (
    <NavLayout>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 p-4 border-b md:border-b-0 md:border-r">
          <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
            <button
              onClick={() => setFilter("received")}
              className={`w-1/2 md:w-full py-2 px-4 ${
                filter === "received"
                  ? "btn btn-primary text-white rounded-none"
                  : "btn btn-outline text-neutral rounded-none"
              }`}
            >
              Received
            </button>
            <button
              onClick={() => setFilter("sent")}
              className={`w-1/2 md:w-full py-2 px-4 ${
                filter === "sent"
                  ? "btn btn-primary text-white rounded-none"
                  : "btn btn-outline text-neutral rounded-none"
              }`}
            >
              Sent
            </button>
          </div>
          <div className="mt-4">
            <div className="bg-white shadow-sm rounded-md">
              {filteredMessages && filteredMessages.length > 0 ? (
                <ul className="list-none">
                  {filteredMessages.map((msg) => (
                    <li
                      key={msg.id}
                      onClick={() => openModal(msg)}
                      className="p-4 cursor-pointer border-b hover:bg-gray-100"
                    >
                      <div className="font-semibold">{msg.sender}</div>
                      <div className="truncate">{msg.content}</div>{" "}
                      {/* Adjust based on your data structure */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No messages available</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal for Mobile View */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3">
              <button
                className="text-right text-gray-500"
                onClick={closeModal}
              >
                &times;
              </button>
              <div className="mt-2">
                <h2 className="text-gray-700 font-bold mb-2">From:</h2>
                <h2 className="text-zinc-600 mb-5">
                  {/* {selectedMessage.sender} */}
                  Barangay Admin
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  {selectedMessage?.time}
                </p>
                <div className="mb-4">
                  <h2 className="text-gray-700 font-bold mb-2">Message:</h2>
                  <p className="text-zinc-500 text-sm">
                    {selectedMessage?.message}
                  </p>{" "}
                  {/* Adjust based on your data structure */}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop View */}
        <div className="hidden md:block w-full md:w-3/4 p-4">
          {selectedMessage ? (
            <div className="bg-white shadow-sm rounded-md p-4">
              <h2 className="text-gray-700 font-bold mb-2">From:</h2>
              <h2 className="text-zinc-600 mb-5">
                {/* {selectedMessage.sender} */}
                Barangay Admin
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                {selectedMessage?.time}
              </p>
              <div className="mb-4">
                <h2 className="text-gray-700 font-bold mb-2">Message:</h2>
                <p className="text-zinc-500 text-sm">
                  {selectedMessage?.message}
                </p>{" "}
                {/* Adjust based on your data structure */}
              </div>
            </div>
          ) : (
            <p>Select a message to view details</p>
          )}
        </div>
      </div>
    </NavLayout>
  );
};

export default Message;

"use client";

import UserNavLayout from "@/components/UserNavLayout";
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setCurrentUserId(user.uid);
    } else {
      console.error("No current user found");
    }
  }, []);

  useEffect(() => {
    if (currentUserId) {
      if (filter === "sent") {
        fetchMessageSentUser(currentUserId);
      } else {
        fetchMessageReceivedUser(currentUserId);
      }
    }
  }, [filter, currentUserId, fetchMessageReceivedUser, fetchMessageSentUser]);

  // Filter messages based on the selected filter
  const filteredMessages = messages?.filter((msg) =>
    filter === "sent"
      ? msg.sender === currentUserId
      : msg.receiver === currentUserId
  );

  return (
    <UserNavLayout>
      <div className="flex">
        <div className="w-1/4 p-4 border-r">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => setFilter("received")}
              className={`py-2 px-4 ${
                filter === "received"
                  ? "btn btn-primary text-white rounded-none"
                  : "btn btn-outline text-neutral rounded-none"
              }`}
            >
              Received
            </button>
            <button
              onClick={() => setFilter("sent")}
              className={`py-2 px-4 ${
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
                      onClick={() => setSelectedMessage(msg)}
                      className="p-4 cursor-pointer border-b hover:bg-gray-100"
                    >
                      <div className="font-semibold">{msg.sender}</div>
                      {/* <div className="text-sm text-gray-500">{msg.time.toDate().toLocaleString()}</div> */}
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
        <div className="w-3/4 p-4">
          {selectedMessage ? (
            <div className="bg-white shadow-sm rounded-md p-4">
              <h2 className="text-gray-700 font-bold mb-2">From:</h2>
              <h2 className="text-zinc-600 mb-5">
                {/* {selectedMessage.sender} */}
                Barangay Admin
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                {selectedMessage.time}
              </p>
              <div className="mb-4">
                <h2 className="text-gray-700 font-bold mb-2">message:</h2>
                <p className="text-zinc-500 text-sm">
                  {selectedMessage.message}
                </p>{" "}
                {/* Adjust based on your data structure */}
              </div>
              {/* Add any other detailed info you want to display here */}
            </div>
          ) : (
            <p>Select a message to view details</p>
          )}
        </div>
      </div>
    </UserNavLayout>
  );
};

export default Message;

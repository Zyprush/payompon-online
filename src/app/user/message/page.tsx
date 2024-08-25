"use client";
import UserNavLayout from "@/components/UserNavLayout";
import { auth } from "@/firebase";
import { toTitleCase } from "@/helper/string";
import { useMessageStore } from "@/state/message";
import { IconAt } from "@tabler/icons-react";
import { format } from "date-fns";
import Image from "next/image";
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
    <UserNavLayout>
      <div className="flex flex-col">
        <div className="w-full md:px-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("received")}
              className={`py-2 px-4 w-40 ${
                filter === "received"
                  ? "btn btn-primary text-white rounded-none"
                  : "btn btn-outline text-neutral rounded-none"
              }`}
            >
              Received
            </button>
            <button
              onClick={() => setFilter("sent")}
              className={`w-40 py-2 px-4 ${
                filter === "sent"
                  ? "btn btn-primary text-white rounded-none"
                  : "btn btn-outline text-neutral rounded-none"
              }`}
            >
              Sent
            </button>
          </div>
          <div className="mt-4">
            <div className="">
              {filteredMessages && filteredMessages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredMessages.map((msg) => (
                    <span
                      key={msg.id}
                      onClick={() => openModal(msg)}
                      className="p-4 cursor-pointer border-b flex gap-5 bg-white rounded shadow-sm border w-full"
                    >
                      <div className="avatar">
                        <div className="w-16 custom-shadow rounded-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <Image
                            alt="brgy-logo.png"
                            width={100}
                            height={100}
                            src={"/img/brgy-logo.png"}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col truncate pr-5">
                        <div className="font-semibold text-primary">
                          {toTitleCase(msg.sender)}
                        </div>
                        <div className="text-zinc-500 text-xs font-semibold flex gap-4">
                          {format(new Date(msg.time), "MMM dd, yyyy")} :
                          <p>{format(new Date(msg.time), "hh:mm a")}</p>
                        </div>
                        <div className="truncate mt-auto mb-0 text-sm text-zinc-500">
                          {msg.message}
                        </div>
                      </div>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="border rounded-md p-4 text-sm text-zinc-600 flex items-center gap-2 justify-center">
                  <IconAt /> No messages available
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal for viewing message */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
              <div className="mt-2">
                <div className="flex gap-4">
                  <div className="avatar">
                    <div className="w-16 rounded-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <Image
                        alt="brgy-logo.png"
                        width={100}
                        height={100}
                        src={"/img/brgy-logo.png"}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center truncate pr-5">
                    <div className="font-semibold text-primary text-lg">
                      {toTitleCase(selectedMessage.sender)}
                    </div>
                    <div className="text-zinc-700 text-sm font-semibold items-center flex gap-4">
                      {format(new Date(selectedMessage.time), "MMM dd, yyyy")} :
                      <p className="">{format(new Date(selectedMessage.time), "hh:mm a")}</p>
                    </div>
                  </div>
                </div>
        
                <div className="my-5">
                  <h2 className="text-gray-700 font-bold mb-2">Message:</h2>
                  <p className="text-zinc-500 text-sm">
                    {selectedMessage?.message}
                  </p>
                </div>
              </div>
              <button
                className="btn btn-outline text-neutral"
                onClick={closeModal}
              >
                close
              </button>
            </div>
          </div>
        )}
      </div>
    </UserNavLayout>
  );
};

export default Message;

"use client";
import NavLayout from "@/components/NavLayout";
import { useMessageStore } from "@/state/message";
import { IconAt } from "@tabler/icons-react";
import React, { useState, useEffect } from "react";

const Message: React.FC = (): JSX.Element => {
  const { messages, fetchMessageReceivedAdmin, fetchMessageSentAdmin } =
    useMessageStore();

  const [filter, setFilter] = useState<"sent" | "received">("received");
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (filter === "sent") {
      fetchMessageSentAdmin();
    } else {
      fetchMessageReceivedAdmin();
    }
  }, [filter, fetchMessageReceivedAdmin, fetchMessageSentAdmin]);

  const openModal = (msg: any) => {
    setSelectedMessage(msg);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const filteredMessages = messages?.filter(
    (msg) => filter === "sent" && msg.sender === "admin"
  );

  return (
    <NavLayout>
      <div className="flex flex-col">
        <div className="w-full p-4 pt-0">
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
                <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                  {filteredMessages.map((msg) => (
                    <span
                      key={msg.id}
                      onClick={() => openModal(msg)}
                      className="p-4 cursor-pointer border-b flex gap-5 bg-white shadow w-full"
                    >
                      <div className="avatar">
                        <div className="w-16 rounded-full border-primary border-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                      </div>
                      <div className="flex flex-col truncate pr-5">
                        <div className="font-semibold">{msg.sender}</div>
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
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3">
              <div className="mt-2">
                <h2 className="text-gray-700 font-bold mb-2">From:</h2>
                <h2 className="text-zinc-600 mb-5">Barangay Admin</h2>
                <p className="text-sm text-gray-500 mb-2">
                  {selectedMessage?.time}
                </p>
                <div className="mb-4">
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
    </NavLayout>
  );
};

export default Message;

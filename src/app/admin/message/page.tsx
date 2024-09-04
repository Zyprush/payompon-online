"use client";
import NavLayout from "@/components/NavLayout";
import { toTitleCase } from "@/helper/string";
import { getRelativeTime } from "@/helper/time";
import { useMessageStore } from "@/state/message";
import { IconAt } from "@tabler/icons-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import SendMessage from "./SendMessage";

const Message: React.FC = (): JSX.Element => {
  const { messages, fetchMessageReceivedAdmin, fetchMessageSentAdmin } =
    useMessageStore();

  const [filter, setFilter] = useState<"sent" | "received">("received");
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [showMessageModal, setShowMessageModal] = useState<boolean>(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState<boolean>(false);

  useEffect(() => {
    if (filter === "sent") {
      fetchMessageSentAdmin();
    } else {
      fetchMessageReceivedAdmin();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, showMessageModal]);

  const openMessageModal = (msg: any) => {
    setSelectedMessage(msg);
    setShowMessageModal(true);
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
  };

  const openSendMessageModal = () => {
    setShowSendMessageModal(true);
  };

  const closeSendMessageModal = () => {
    setShowSendMessageModal(false);
  };

  const filteredMessages = messages

  return (
    <NavLayout>
      <div className="flex flex-col">
        <button className="fixed bottom-4 right-4 btn btn-primary text-white shadow-2xl" onClick={openSendMessageModal}>
          Create
        </button>
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
            <div className="flex">
              {filteredMessages && filteredMessages.length > 0 ? (
                <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                  {filteredMessages.map((msg) => (
                    <span
                      key={msg.id}
                      onClick={() => openMessageModal(msg)}
                      className="p-4 cursor-pointer border-b flex gap-5 bg-white shadow w-full rounded-md min-w-[20rem]"
                    >
                      <div className="avatar">
                        <div className="w-16 custom-shadow rounded-full">
                          <Image
                            alt="brgy-logo.png"
                            width={100}
                            height={100}
                            src={"/img/brgy-logo.png"}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col truncate pr-5">
                        <div className="font-semibold text-zinc-600">
                        {filter == "sent" ? toTitleCase(msg.receiverName)  : toTitleCase(msg.senderName)}
                        </div>
                        <div className="truncate mt-auto mb-0 text-sm text-zinc-500">
                          {msg.message}
                        </div>
                        <p className="text-xs text-gray-400 mb-0 mt-auto">
                          {getRelativeTime(selectedMessage?.time)}
                        </p>
                      </div>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="border rounded-md mr-auto ml-0 font-bold p-4 text-sm text-zinc-600 flex items-center gap-2 justify-center">
                  <IconAt /> No messages available
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal for viewing message */}
        {showMessageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/6">
              <div className="mt-2">
                <div className="flex justify-start gap-10">
                  <span className="flex flex-col">
                    <h2 className="text-gray-700 font-bold">From:</h2>
                    <h2 className="text-zinc-500 mb-5">Barangay Admin</h2>
                  </span>
                  <span className="flex flex-col">
                    <h2 className="text-gray-700 font-bold">To:</h2>
                    <h2 className="text-zinc-500 mb-5">{selectedMessage?.receiverName}</h2>
                  </span>
                </div>

                <div className="mb-8">
                  <h2 className="text-gray-700 font-bold mb-2">Message:</h2>
                  <p className="text-zinc-500">{selectedMessage?.message}</p>
                </div>

                <p className="text-xs text-gray-500 mb-4">
                  {getRelativeTime(selectedMessage?.time)}
                </p>
              </div>
              <button
                className="btn btn-outline text-neutral"
                onClick={closeMessageModal}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Modal for sending message */}
        {showSendMessageModal && <SendMessage onClose={closeSendMessageModal} />}
      </div>
    </NavLayout>
  );
};

export default Message;

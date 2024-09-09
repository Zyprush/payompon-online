"use client";
import NavLayout from "@/components/NavLayout";
import { toTitleCase } from "@/helper/string";
import { getRelativeTime } from "@/helper/time";
import { IconAt } from "@tabler/icons-react";
import React, { useState, useEffect } from "react";
import SendMessage from "./SendMessage";
import GetImage from "@/components/GetImage";
import { useMessages } from "@/hooks/useMessages";

const Message: React.FC = (): JSX.Element => {
  const {
    messages,
    fetchMessageReceivedAdmin,
    fetchMessageSentAdmin,
    updateMessageReadStatus,
    deleteMessage,
  } = useMessages(); // Custom hook to handle messages

  const [filter, setFilter] = useState<"sent" | "received">("received");
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [showMessageModal, setShowMessageModal] = useState<boolean>(false);
  const [showSendMessageModal, setShowSendMessageModal] =
    useState<boolean>(false);

  useEffect(() => {
    if (filter === "sent") {
      fetchMessageSentAdmin();
    } else {
      fetchMessageReceivedAdmin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, showMessageModal]);

  const updateMessageStatus = async (messageId: string) => {
    if (filter === "received") {
      try {
        // Check if the message is unread and mark it as read
        const message = messages?.find((msg) => msg.id === messageId);
        if (message && !message.read) {
          await updateMessageReadStatus(messageId); // Update the message status in Firestore and locally
          console.log("Message marked as read");
        }
      } catch (error) {
        console.error("Error updating message status:", error);
      }
    }
  };

  const openMessageModal = async (msg: any) => {
    setSelectedMessage(msg);
    setShowMessageModal(true);
    if (!msg.read) {
      await updateMessageStatus(msg.id);
    }
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
  };

  const openSendMessageModal = () => {
    setSelectedEmail("");
    setShowSendMessageModal(true);
  };

  const reply = (email: string) => {
    setSelectedEmail(email);
    setShowSendMessageModal(true);
  };

  const closeSendMessageModal = () => {
    setShowSendMessageModal(false);
    setSelectedEmail("");
  };

  const filteredMessages = messages;

  return (
    <NavLayout>
      <div className="flex flex-col">
        <button
          className="fixed bottom-4 right-4 btn btn-primary text-white shadow-2xl"
          onClick={openSendMessageModal}
        >
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
                <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMessages.map((msg) => (
                    <span
                      key={msg.id}
                      className={`p-4 cursor-pointer group relative flex gap-5 ${
                        msg.read ? "bg-none" : "bg-white shadow-md"
                      } rounded border w-full`}
                    >
                      <div className="avatar">
                        <div className="w-16 custom-shadow rounded-full">
                          <div className="width-[40px]">
                            <GetImage storageLink="settings/brgyLogo" />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col truncate pr-5">
                        <div className="font-semibold text-zinc-600">
                          {filter === "sent"
                            ? toTitleCase(msg.receiverName)
                            : toTitleCase(msg.senderName)}
                        </div>
                        <div className="truncate mt-auto mb-0 text-sm text-zinc-500">
                          {msg.message}
                        </div>
                        <p className="text-xs text-gray-400 mb-0 mt-auto">
                          {getRelativeTime(msg?.time)}
                        </p>
                      </div>
                      <div className="absolute bottom-3 border gap-3 p-2 bg-white shadow-lg rounded-md right-3 hidden group-hover:flex">
                        {filter == "received" && (
                          <button
                            className="btn-xs rounded-sm text-white btn btn-error shadow-xl z-50"
                            onClick={() => deleteMessage(msg.id)}
                          >
                            delete
                          </button>
                        )}
                        {filter == "received" && (
                          <button
                            className="btn-xs rounded-sm text-white btn btn-primary shadow-xl z-50"
                            onClick={() => reply(msg?.senderEmail)}
                          >
                            reply
                          </button>
                        )}
                        <button
                          className="btn-xs rounded-sm text-white btn btn-neutral shadow-xl z-50"
                          onClick={() => openMessageModal(msg)}
                        >
                          view
                        </button>
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
                    <h2 className="text-zinc-500 mb-5">
                      {selectedMessage?.senderName}
                    </h2>
                  </span>
                  <span className="flex flex-col">
                    <h2 className="text-gray-700 font-bold">To:</h2>
                    <h2 className="text-zinc-500 mb-5">
                      {toTitleCase(selectedMessage?.receiverName)}
                    </h2>
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
        {showSendMessageModal && (
          <SendMessage
            onClose={closeSendMessageModal}
            selectedEmail={selectedEmail}
          />
        )}
      </div>
    </NavLayout>
  );
};

export default Message;

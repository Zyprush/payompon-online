"use client";
import UserNavLayout from "@/components/UserNavLayout";
import { toTitleCase } from "@/helper/string";
import { IconAt } from "@tabler/icons-react";
import { format } from "date-fns";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import SendMessage from "./SendMessage";
import useUserData from "@/hooks/useUserData";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useMessages } from "@/hooks/useMessages"; // Importing the custom hook

const Message: React.FC = (): JSX.Element => {
  const {
    messages,
    fetchMessageReceivedUser,
    fetchMessageSentUser,
    updateMessageReadStatus,
    deleteMessage
  } = useMessages(); // Using the useMessages hook

  const [filter, setFilter] = useState<"sent" | "received">("received");
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSend, setShowSend] = useState<boolean>(false);

  const { userUid, verified } = useUserData(); // Using the custom hook

  useEffect(() => {
    if (userUid) {
      if (filter === "sent") {
        fetchMessageSentUser(userUid); // Fetching sent messages
      } else {
        fetchMessageReceivedUser(userUid); // Fetching received messages
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, userUid, showModal]);

  const updateMessageStatus = async (messageId: string, userUid: string) => {
    if (filter === "received") {
      try {
        const messageRef = doc(db, "receiveMess", messageId);
        const messageSnap = await getDoc(messageRef);

        if (messageSnap.exists()) {
          const messageData = messageSnap.data();
          if (messageData.receiverId === userUid && !messageData.read) {
            await updateDoc(messageRef, {
              read: true,
            });
            console.log("Message marked as read");
            return true; // Indicate successful update
          } else {
            console.log(
              "Message is either already read or user is not the receiver"
            );
            return false; // Indicate no update was needed
          }
        } else {
          console.log("Message not found");
          return false; // Indicate message not found
        }
      } catch (error) {
        console.error("Error updating message status:", error);
        return false; // Indicate error occurred
      }
    } else {
      console.log("Filter is not 'received', no update needed");
      return false; // Indicate no update was needed
    }
  };

  const openModal = async (msg: any) => {
    setSelectedMessage(msg);
    setShowModal(true);
    if (!msg.read) {
      const updated = await updateMessageStatus(msg.id, userUid);
      if (updated) {
        // Optionally update local state or refetch messages
        updateMessageReadStatus(msg.id); // Updating the read status via the custom hook
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openSendModal = () => {
    setShowSend(true);
  };

  const closeSendModal = () => {
    setShowSend(false);
  };

  const filteredMessages = messages;

  return (
    <UserNavLayout>
      <div className="flex flex-col">
        <button
          onClick={openSendModal}
          className="flex btn btn-primary shadow-xl text-white border-2 fixed bottom-4 right-4 "
        >
          Create
        </button>

        <SendMessage open={showSend} handleClose={closeSendModal} />

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredMessages.map((msg) => (
                    <span
                      key={msg.id}
                      className={`p-4 cursor-pointer flex gap-5 group relative ${
                        msg.read ? "bg-none" : "bg-white shadow-md"
                      } rounded border w-full`}
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
                        <div className="font-semibold text-primary">
                          {filter == "sent"
                            ? toTitleCase(msg.receiverName)
                            : toTitleCase(msg.senderName)}
                        </div>
                        <div className="text-zinc-500 text-xs font-semibold flex gap-4">
                          {format(new Date(msg.time), "MMM dd, yyyy")} :
                          <p>{format(new Date(msg.time), "hh:mm a")}</p>
                        </div>
                        <div className="truncate mt-auto mb-0 text-sm text-zinc-500">
                          {msg.message}
                        </div>
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
                        <button
                          className="btn-xs rounded-sm text-white btn btn-neutral shadow-xl z-50"
                          onClick={() => openModal(msg)}
                        >
                          view
                        </button>
                      </div>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="border rounded-md p-4 text-sm text-zinc-600 flex items-center gap-2 justify-center w-80 mx-auto">
                  <IconAt /> No messages available
                </span>
              )}
            </div>
          </div>
        </div>

        {showModal && selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
              <div className="mt-2">
                <div className="flex gap-4">
                  <div className="avatar">
                    <div className="w-16 rounded-full">
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
                      {toTitleCase(selectedMessage.receiverName)}
                    </div>
                    <div className="text-zinc-700 text-sm font-semibold items-center flex gap-4">
                      {format(new Date(selectedMessage.time), "MMM dd, yyyy")} :
                      <p className="">
                        {format(new Date(selectedMessage.time), "hh:mm a")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="my-5">
                  <h2 className="text-gray-700 font-bold mb-2">Message:</h2>
                  <p className="text-zinc-500 text-sm mb-4">
                    {selectedMessage?.message}
                  </p>
                  {selectedMessage?.certLink ? (
                    <div className="flex mt-4 flex-col gap-2">
                      <QRCode value={selectedMessage.certLink} size={100} />
                      <a
                        href={selectedMessage?.certLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 text-sm underline font-semibold"
                      >
                        Document Link
                      </a>
                    </div>
                  ) : null}
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

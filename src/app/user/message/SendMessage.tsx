"use client";
import React, { useState, useEffect } from "react";
import useUserData from "@/hooks/useUserData";
import { currentTime } from "@/helper/time";
import { useMessageStore } from "@/state/message";

interface SendMessageProps {
  open: boolean;
  handleClose: () => void;
}

const SendMessage: React.FC<SendMessageProps> = ({ open, handleClose }) => {
  const [recipient, setRecipient] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { userUid, userName, userEmail } = useUserData(); // Custom hook to fetch user data
  const { addMessage } = useMessageStore(); // Zustand store for managing messages

  const handleSubmit = async () => {
    if (!userUid || !userName) {
      alert("You must be logged in to send a message.");
      return;
    }

    if (!recipient || !message) {
      alert("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      await addMessage({
        receiverId: recipient,
        senderEmail: userEmail,
        sender: userUid,
        senderName: userName,
        message,
        time: currentTime,
        read: false,
      });

      alert("Message sent successfully!");
      handleClose();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:items-center md:justify-center bg-black md:bg-opacity-50 bg-opacity-0">
      <div className="bg-white md:rounded-lg shadow-lg flex justify-center items-center w-full md:w-96 mt-14 md:mt-0">
        <div className="px-6 py-4 flex flex-col gap-2 w-full mb-14 md:mb-auto">
          <h2 className="text-lg font-bold mt-10 md:mt-0 mb-4 text-primary drop-shadow">
            Send a Message
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-zinc-700">
              Recipient
            </label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm text-zinc-700 border-zinc-300"
              disabled={loading}
            >
              <option value="">Select a recipient</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-zinc-700">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border rounded-sm text-sm text-zinc-700"
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 btn-outline btn text-neutral font-semibold rounded-sm mr-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 btn btn-primary text-sm font-semibold text-white rounded-sm"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMessage;

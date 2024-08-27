import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useMessageStore } from "@/state/message";

interface DeclineModalProps {
  declineRequest: any;
  onClose: () => void;
}

const DeclineModal: React.FC<DeclineModalProps> = ({
  declineRequest,
  onClose,
}) => {
  const { addMessage, loadingMessage } = useMessageStore();
  const [declineMessage, setDeclineMessage] = useState<string>("");

  const handleDecline = async () => {
    if (!declineMessage.trim()) {
      alert("Please enter a decline message.");
      return;
    }

    try {
      const requestDoc = doc(db, "requests", declineRequest.id);
      await updateDoc(requestDoc, {
        status: "declined",
      });

      const currentTime = new Date().toISOString();
      await addMessage({
        message: `${declineMessage}. You may send us a message to request a refund or make another request using the same Screenshot of the Gcash transaction.`,
        sender: "admin",
        receiver: declineRequest.submittedBy,
        seen: false,
        time: currentTime,
      });

      alert("Request has been declined successfully.");
      onClose();
    } catch (error) {
      console.error("Error declining request:", error);
      alert("Error declining request.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
        <h2 className="text-lg font-bold mb-4 text-primary">Decline Request</h2>
        <textarea
          value={declineMessage}
          onChange={(e) => setDeclineMessage(e.target.value)}
          placeholder="Enter decline message"
          rows={6}
          className="w-full p-2 border rounded mb-4 resize-none text-sm"
        />
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="text-neutral btn btn-outline btn-sm rounded-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleDecline}
            className="text-white btn btn-error btn-sm rounded-sm"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeclineModal;

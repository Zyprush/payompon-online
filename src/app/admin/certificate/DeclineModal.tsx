import React, { useState } from "react";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useLogs } from "@/hooks/useLogs";
import { currentTime } from "@/helper/time";
import useUserData from "@/hooks/useUserData";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface DeclineModalProps {
  declineRequest: any;
  onClose: () => void;
}

const DeclineModal: React.FC<DeclineModalProps> = ({
  declineRequest,
  onClose,
}) => {
  const { userRole, name } = useUserData();
  
  // Format current date like "December 1, 2024, 10:30 AM"
  const formattedCurrentDate = new Date().toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const prewrittenMessage = `<strong>Dear Resident,</strong>
<p>We regret to inform you that your request cannot be processed because the GCash reference number you provided is incorrect. Kindly verify the number and resubmit your request.</p>
<p>Thank you for your cooperation.</p>

<p><strong>${formattedCurrentDate}</strong></p>
<p>${name ? name : "Admin"}</p>`;

  const [declineMessage, setDeclineMessage] = useState<string>(prewrittenMessage);
  const {addLog} = useLogs();

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  };

  const handleDecline = async () => {
    if (!declineMessage.trim()) {
      alert("Please enter a decline message.");
      return;
    }
    try {
      const requestDoc = doc(db, "requests", declineRequest.id);
      await updateDoc(requestDoc, {
        status: "declined",
        timestamp: currentTime,
        declineReason: declineMessage,  
      });
      
      addLog({
        name: `Declined ${declineRequest.requestType} Request`,
        date: currentTime,
        role: userRole,
        actionBy: name
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
        <ReactQuill
          theme="snow"
          value={declineMessage}
          onChange={setDeclineMessage}
          modules={modules}
          className="mb-4"
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
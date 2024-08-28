import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useMessageStore } from "@/state/message";

interface UpdateCertificateProps {
  selectedRequest: any;
  onClose: () => void;
}

const UpdateCertificate: React.FC<UpdateCertificateProps> = ({
  selectedRequest,
  onClose,
}) => {
  const [orNo, setOrNo] = useState<string>("");
  const [issueOn, setIssueOn] = useState<string>("");
  const [certNo, setCertNo] = useState<string>("");
  const [certType, setCertType] = useState<string>("");
  const [affiant, setAffiant] = useState<string>("");
  const { addMessage, loadingMessage } = useMessageStore();

  const handleUpdate = async () => {
    if (!orNo || !issueOn || !certNo || !affiant) {
      alert("Please fill in all the required fields.");
      return;
    }

    try {
      const requestDoc = doc(db, "requests", selectedRequest.id);
      await updateDoc(requestDoc, {
        orNo,
        issueOn,
        certNo,
        // certType,
        affiant,
        status: "approved",
      });
      // TODO: display the qr code in message
      const currentTime = new Date().toISOString();
      await addMessage({
        message: `Your certification request (${selectedRequest.requestType}) has been approve. OR NO: ${orNo}, CERT NO: ${certNo}`,
        certLink: `https://payompon-online.vercel.app/document/${selectedRequest.id}`,
        sender: "admin",
        receiver: selectedRequest.submittedBy,
        seen: false,
        time: currentTime,
      });
      alert("Certificate updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating request:", error);
      alert("Error updating request");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6">
        <h2 className="text-lg font-bold mt-10 md:mt-0 mb-4 text-primary  drop-shadow">Update Certificate</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            OR No.
          </label>
          <input
            type="text"
            value={orNo}
            onChange={(e) => setOrNo(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issue On
          </label>
          <input
            type="date"
            required
            value={issueOn}
            onChange={(e) => setIssueOn(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certificate No.
          </label>
          <input
            type="text"
            required
            value={certNo}
            onChange={(e) => setCertNo(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Affiant
          </label>
          <input
            type="text"
            required
            value={affiant}
            onChange={(e) => setAffiant(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCertificate;

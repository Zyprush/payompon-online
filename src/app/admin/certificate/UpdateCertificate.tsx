import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useNotifStore } from "@/state/notif";
import { currentTime } from "@/helper/time";
import { useRevenueStore } from "@/state/revenue";
import { useMessages } from "@/hooks/useMessages";
import { v4 as uuidv4 } from "uuid"; // Import UUID library
import { useLogs } from "@/hooks/useLogs";

interface UpdateCertificateProps {
  selectedRequest: any;
  onClose: () => void;
}

const UpdateCertificate: React.FC<UpdateCertificateProps> = ({
  selectedRequest,
  onClose,
}) => {
  // const [orNo, setOrNo] = useState<string>("");
  const [issueOn, setIssueOn] = useState<string>("");
  // const [certNo, setCertNo] = useState<string>("");
  const [affiant, setAffiant] = useState<string>("");
  const [format, setFormat] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { addNotif } = useNotifStore();
  const { addRevenue } = useRevenueStore();
  const { addMessage } = useMessages();
  const baseURL = typeof window !== "undefined" ? window.location.origin : "";
  const {addLog} = useLogs();
  

  useEffect(() => {
    // Auto-generate unique OR No and Cert No
    const generateUniqueNumber = () => {
      const timestamp = Date.now().toString(); // Use current timestamp
      // const uniqueCertNo = `CERT-${timestamp}`;
      // const uniqueOrNo = `OR-${uuidv4().substring(0, 8)}`; // Generate part of a UUID for OR No

      // setCertNo(uniqueCertNo);
      // setOrNo(uniqueOrNo);
    };

    generateUniqueNumber();
  }, []); // This will run once when the component mounts

  const handleUpdate = async () => {
    if (!issueOn || !affiant || !format) {
      alert("Please fill in all the required fields.");
      return;
    }

    setLoading(true);

    try {
      const requestDoc = doc(db, "requests", selectedRequest.id);
      await updateDoc(requestDoc, {
        issueOn,
        affiant,
        status: "approved",
        format,
        certLink: `${baseURL}/document/${format}/${selectedRequest.id}`,
      });
      await addMessage({
        message: `Your certification request (${selectedRequest.requestType}) has been approved.`,
        certLink: `${baseURL}/document/${format}/${selectedRequest.id}`,
        sender: "admin",
        receiverId: selectedRequest.submittedBy,
        receiverName: selectedRequest.submittedName,
        senderName: "Admin",
        seen: false,
        time: currentTime,
        for: "user",
      });

      addLog({
        name:  `Approved ${selectedRequest.submittedName}'s ${selectedRequest.requestType} request`,
        date: currentTime
      })
      await addNotif({
        message: `Your certification request (${selectedRequest.requestType}) has been approved.`,
        certLink: `${baseURL}/document/${selectedRequest.format}/${selectedRequest.id}`,
        for: selectedRequest.submittedBy,
        read: false,
        time: currentTime,
      });
      

      await addRevenue({
        amount: selectedRequest.amount,
        issueOn,
        certType: selectedRequest.requestType,
        name: selectedRequest.submittedName,
      });

      alert("Certificate updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating request:", error);
      alert("Error updating request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6">
        <h2 className="text-lg font-bold mt-10 md:mt-0 mb-4 text-primary drop-shadow">
          Update Certificate
        </h2>
   
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
            Format
          </label>
          <select
            required
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Format</option>
            <option value="certificate">Certificate</option>
            <option value="certification">Certification</option>
          </select>
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
        <div className="flex justify-end space-x-5">
          <button
            onClick={onClose}
            className="btn btn-outline text-neutral rounded"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="btn btn-primary text-white rounded"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCertificate;

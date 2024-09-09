import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useNotifStore } from "@/state/notif";
import { currentTime } from "@/helper/time";
import { useRevenueStore } from "@/state/revenue";
import { useMessages } from "@/hooks/useMessages";
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
  const [affiant, setAffiant] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Add loading state
  const { addNotif } = useNotifStore();
  const { addRevenue } = useRevenueStore();
  const { addMessage } = useMessages();

  const handleUpdate = async () => {
    if (!orNo || !issueOn || !certNo || !affiant) {
      alert("Please fill in all the required fields.");
      return;
    }

    setLoading(true); // Start loading

    try {
      const requestDoc = doc(db, "requests", selectedRequest.id);
      await updateDoc(requestDoc, {
        orNo,
        issueOn,
        certNo,
        affiant,
        status: "approved",
        certLink: `https://payompon-online.vercel.app/document/${selectedRequest.id}`,
      });
      await addMessage({
        message: `Your certification request (${selectedRequest.requestType}) has been approved. OR NO: ${orNo}, CERT NO: ${certNo}`,
        certLink: `https://payompon-online.vercel.app/document/${selectedRequest.id}`,
        sender: "admin",
        receiverId: selectedRequest.submittedBy,
        //TODO: fix this
        receiverName: selectedRequest.submittedByName,
        senderName: "Admin",
        seen: false,
        time: currentTime,
        for: "user",
      });
      await addNotif({
        message: `Your certification request (${selectedRequest.requestType}) has been approved.`,
        certLink: `https://payompon-online.vercel.app/document/${selectedRequest.id}`,
        for: selectedRequest.submittedBy,
        read: false,
        time: currentTime,
      });

      await addRevenue({
        amount: selectedRequest.amount,
        orNo,
        issueOn,
        certNo,
        certType: selectedRequest.requestType,
        name: selectedRequest.submittedName,
      });

      alert("Certificate updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating request:", error);
      alert("Error updating request");
    } finally {
      setLoading(false); // End loading
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
            OR No.
          </label>
          <input
            type="number"
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
            type="number"
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
        <div className="flex justify-end space-x-5">
          <button
            onClick={onClose}
            className="btn btn-outline text-neutral rounded"
            disabled={loading} // Disable Cancel button during loading
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="btn btn-primary text-white rounded"
            disabled={loading} // Disable Update button during loading
          >
            {loading ? "Updating..." : "Update"} {/* Show loading text */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCertificate;

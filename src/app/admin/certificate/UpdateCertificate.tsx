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
        message: `Your certification request (${selectedRequest.certType}) has been approve. OR NO: ${orNo}, CERT NO: ${certNo}`,
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
        <h2 className="text-lg font-semibold mb-4">Update Certificate</h2>
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
        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certificate Type
          </label>
          <select
            required
            value={certType}
            onChange={(e) => setCertType(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Certificate Type</option>
            <option value="Employment Requirement">
              Employment Requirement
            </option>
            <option value="Proof of Residency">Proof of Residency</option>
            <option value="Securing Police Clearance">
              Securing Police Clearance
            </option>
            <option value="Medical Purposes">Medical Purposes</option>
            <option value="Securing NBI Clearance">
              Securing NBI Clearance
            </option>
            <option value="Financial Assistance Req.">
              Financial Assistance Req.
            </option>
            <option value="Securing Passport">Securing Passport</option>
            <option value="Livelihood Program Req.">
              Livelihood Program Req.
            </option>
            <option value="Securing Postal I.D">Securing Postal I.D</option>
            <option value="School Requirement">School Requirement</option>
            <option value="Securing Driver’s License">
              Securing Driver’s License
            </option>
            <option value="Scholarship Requirement">
              Scholarship Requirement
            </option>
            <option value="Securing Tin I.D/No.">Securing Tin I.D/No.</option>
            <option value="Bank Transaction">Bank Transaction</option>
            <option value="Financial Assistance">Financial Assistance</option>
            <option value="Travel Abroad Requirement">
              Travel Abroad Requirement
            </option>
            <option value="Medical Purposes">Medical Purposes</option>
            <option value="OMECO Requirement">OMECO Requirement</option>
            <option value="MTC Clearance Req.">MTC Clearance Req.</option>
            <option value="Motorcycle Loan Req.">Motorcycle Loan Req.</option>
            <option value="BFAR Requirement">BFAR Requirement</option>
            <option value="Appliance(s) Loan Req.">
              Appliance(s) Loan Req.
            </option>
            <option value="Zoning Requirement">Zoning Requirement</option>
            <option value="Loan Purposes">Loan Purposes</option>
            <option value="Civil Service Examination">
              Civil Service Examination
            </option>
            <option value="Car Loan Requirement">Car Loan Requirement</option>
            <option value="Board Examination(s)">Board Examination(s)</option>
            <option value="Retirement Requirement">
              Retirement Requirement
            </option>
            <option value="Tricycle Franchise Req.">
              Tricycle Franchise Req.
            </option>
            <option value="Business Registration">Business Registration</option>
            <option value="Bank Transaction">Bank Transaction</option>
            <option value="Securing Firearms License">
              Securing Firearms License
            </option>
            <option value="Whatever Legal Purposes">
              Whatever Legal Purposes
            </option>
          </select>
        </div> */}
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

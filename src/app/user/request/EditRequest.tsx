"use client";
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/firebase";

interface EditRequestProps {
  open: boolean;
  handleClose: () => void;
  requestData: {
    id: string;
    requestType: string;
    gcashRefNo: string;
    proofOfPaymentURL: string;
  };
}

const EditRequest: React.FC<EditRequestProps> = ({ open, handleClose, requestData }): JSX.Element | null => {
  const [requestType, setRequestType] = useState<string>(requestData.requestType);
  const [gcashRefNo, setGcashRefNo] = useState<string>(requestData.gcashRefNo);
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ requestType?: string; gcashRefNo?: string }>({});

  const validateInputs = () => {
    const errors: { requestType?: string; gcashRefNo?: string } = {};

    if (!requestType) {
      errors.requestType = "Request type is required";
    }

    if (!gcashRefNo) {
      errors.gcashRefNo = "GCash reference number is required";
    } 
    

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    try {
      let downloadURL = requestData.proofOfPaymentURL;

      if (proofOfPayment) {
        // Delete the old proof of payment
        const oldStorageRef = ref(storage, requestData.proofOfPaymentURL);
        await deleteObject(oldStorageRef);

        // Upload the new proof of payment
        const storageRef = ref(storage, `proofOfPayment/${proofOfPayment.name}`);
        const snapshot = await uploadBytes(storageRef, proofOfPayment);
        downloadURL = await getDownloadURL(snapshot.ref);
      }

      const requestDocRef = doc(db, "request", requestData.id);
      await updateDoc(requestDocRef, {
        requestType,
        gcashRefNo,
        proofOfPaymentURL: downloadURL,
        timestamp: new Date(),
      });

      handleClose();
      alert("Request updated successfully!");
    } catch (error) {
      console.error("Error updating request:", error);
      alert("Error updating request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold mb-4">Edit Request</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Request Type</label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select a type</option>
              <option value="Barangay clearance">Barangay clearance</option>
              <option value="Indigency">Indigency</option>
              <option value="Business permit">Business permit</option>
              <option value="Certificate of residency">Certificate of residency</option>
              <option value="Certificate of late registration">
                Certificate of late registration
              </option>
            </select>
            {errors.requestType && <p className="text-red-500 text-sm mt-1">{errors.requestType}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">GCash Reference Number</label>
            <input
              type="text"
              value={gcashRefNo}
              onChange={(e) => setGcashRefNo(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.gcashRefNo && <p className="text-red-500 text-sm mt-1">{errors.gcashRefNo}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Proof of Payment (Screenshot)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) setProofOfPayment(e.target.files[0]);
              }}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRequest;

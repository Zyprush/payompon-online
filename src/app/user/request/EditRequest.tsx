"use client";
import React, { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/firebase";
import { currentTime } from "@/helper/time";

interface EditRequestProps {
  open: boolean;
  handleClose: () => void;
  requestData: {
    id: string;
    requestType: string;
    proofOfPaymentURL: string;
    purpose: string;
  };
  onRequestUpdated: () => void;
}

const EditRequest: React.FC<EditRequestProps> = ({
  open,
  handleClose,
  requestData,
  onRequestUpdated,
}): JSX.Element | null => {
  const [requestType, setRequestType] = useState<string>(
    requestData.requestType
  );
  const [purpose, setPurpose] = useState<string>(requestData.purpose);
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    requestType?: string;
    purpose?: string;
  }>({});
  const [services, setServices] = useState<{ name: string; price: string }[]>(
    []
  );
  // State to hold purposes
  const [purposes, setPurposes] = useState<string[]>([]); // Change to store purposes as an array of strings

  useEffect(() => {
    if (requestData) {
      setRequestType(requestData.requestType);
      setPurpose(requestData.purpose);
      setProofOfPayment(null);
    }

    // Fetch purposes from Firestore
    const fetchPurposes = async () => {
      const purposesDoc = await getDoc(doc(db, "settings", "purposes"));
      if (purposesDoc.exists()) {
        setPurposes(purposesDoc.data().purposes || []); // Assuming the data is an array of purpose strings
      } else {
        console.log("No such document!");
      }
    };
    const fetchServices = async () => {
      const servicesDoc = await getDoc(doc(db, "settings", "services"));
      if (servicesDoc.exists()) {
        setServices(servicesDoc.data()?.services || []);
      }
    };
    fetchServices();

    fetchPurposes();
  }, [requestData]);

  const validateInputs = () => {
    const errors: {
      requestType?: string;
      purpose?: string;
    } = {};

    if (!requestType) {
      errors.requestType = "Request type is required";
    }

    if (!purpose) {
      errors.purpose = "Purpose is required";
    }

    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      alert("Please fill in all required fields.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    try {
      let downloadURL = requestData.proofOfPaymentURL;

      if (proofOfPayment) {
        // Delete the old proof of payment
        const oldStorageRef = ref(storage, requestData.proofOfPaymentURL);
        try {
          await deleteObject(oldStorageRef);
        } catch (error) {
          console.error("Error deleting old file:", error);
          // Continue with the update even if deletion fails
        }

        // Upload the new proof of payment
        const storageRef = ref(
          storage,
          `proofOfPayment/${proofOfPayment.name}`
        );
        const snapshot = await uploadBytes(storageRef, proofOfPayment);
        downloadURL = await getDownloadURL(snapshot.ref);
      }

      // Update Firestore document
      const requestDocRef = doc(db, "requests", requestData.id);
      await updateDoc(requestDocRef, {
        requestType,
        purpose,
        proofOfPaymentURL: downloadURL,
        timestamp: currentTime,
      });

      onRequestUpdated();
      handleClose();
      alert("Request updated successfully!");
    } catch (error) {
      console.error("Error updating request:", error);
      if (error instanceof Error) {
        alert(`Error updating request: ${error.message}`);
      } else {
        alert("An unknown error occurred while updating the request.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold mb-4">Edit Request</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Request Type
            </label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select a type</option>
              {services.map((service, index) => (
                <option key={index} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
            {errors.requestType && (
              <p className="text-red-500 text-sm mt-1">{errors.requestType}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Purpose</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select a purpose</option>
              {purposes.map((pur, index) => (
                <option key={index} value={pur}>
                  {pur}
                </option>
              ))}
            </select>
            {errors.purpose && (
              <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Proof of Payment
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
              className="px-4 py-2 btn btn-outline text-neutral rounded-md mr-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 btn-primary btn text-white rounded-md"
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

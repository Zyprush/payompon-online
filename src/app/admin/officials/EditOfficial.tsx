import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Ensure this path is correct

interface EditOfficialProps {
  isOpen: boolean;
  onClose: () => void;
  officialId: string;
  initialData: {
    name: string;
    status: string;
    address: string;
    chairmanship?: string;
    position: string;
    contact: string; // Include contact in initialData
  };
}

const EditOfficial: React.FC<EditOfficialProps> = ({
  isOpen,
  onClose,
  officialId,
  initialData,
}) => {
  const [name, setName] = useState(initialData.name);
  const [status, setStatus] = useState(initialData.status);
  const [address, setAddress] = useState(initialData.address);
  const [chairmanship, setChairmanship] = useState(
    initialData.chairmanship || ""
  );
  const [position, setPosition] = useState(initialData.position);
  const [contact, setContact] = useState(initialData.contact); // New state for contact number
  const [loading, setLoading] = useState(false); // State to track loading

  // Update state when initialData changes
  useEffect(() => {
    setName(initialData.name);
    setStatus(initialData.status);
    setAddress(initialData.address);
    setChairmanship(initialData.chairmanship || "");
    setPosition(initialData.position);
    setContact(initialData.contact); // Set contact number
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Input validation
    if (!name || !status || !address || !position) {
      alert("Please fill in all required fields.");
      return;
    }

    // Contact number validation (must be 11 digits)
    if (!/^\d{11}$/.test(contact)) {
      alert("Please enter a valid 11-digit contact number.");
      return;
    }

    setLoading(true); // Start loading

    try {
      await updateDoc(doc(db, "officials", officialId), {
        name,
        status,
        address,
        chairmanship: chairmanship || null,
        position,
        contact, // Update the contact number in Firestore
      });
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("An error occurred while updating the official. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Official</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Status</label>
            <select
              className="mt-1 p-2 w-full border rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Chairmanship (Optional)
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded"
              value={chairmanship}
              onChange={(e) => setChairmanship(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Position</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Contact Number</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              pattern="\d{11}" // Optional HTML5 pattern validation
              maxLength={11} // Limit input length
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-4 py-2 px-4 btn-outline btn-sm text-neutral rounded"
              onClick={onClose}
              disabled={loading} // Disable button while loading
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 btn-primary btn btn-sm text-white rounded flex items-center justify-center"
              disabled={loading} // Disable button while loading
            >
              {loading ? "loading..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOfficial;
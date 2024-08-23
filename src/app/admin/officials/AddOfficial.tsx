import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Ensure this path is correct

interface OfficialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddOfficial: React.FC<OfficialModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [address, setAddress] = useState("");
  const [chairmanship, setChairmanship] = useState("");
  const [position, setPosition] = useState("");
  const [contact, setContact] = useState(""); // New state for contact number
  const [loading, setLoading] = useState(false); // State to track loading

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
      await addDoc(collection(db, "officials"), {
        name,
        status,
        address,
        chairmanship: chairmanship || null, // Optional field
        position,
        contact, // Save the contact number to Firestore
      });
      onClose(); // Close the modal after submission
      setName("");
      setStatus("");
      setAddress("");
      setChairmanship("");
      setPosition("");
      setContact(""); // Reset contact number
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("An error occurred while adding the official. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add Official</h2>
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
            <label className="block text-gray-700">Chairmanship (Optional)</label>
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
              className="mr-4 py-2 px-4 btn btn-outline text-neutral rounded"
              onClick={onClose}
              disabled={loading} // Disable button while loading
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 btn text-center btn-primary text-sm font-semibold text-white rounded "
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                "Submitting.." // Simple loader indicator
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOfficial;

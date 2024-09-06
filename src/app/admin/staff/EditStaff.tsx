import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { db } from "@/firebase";

interface EditStaffProps {
  isOpen: boolean;
  onClose: () => void;
  staffId: string;
  initialData: {
    name: string;
    sitio: string;
    contact: string;
    civilStatus?: string;
    gender?: string;
    email: string; // Include email in initial data
    password: string; // Include password for editing
  };
}

const EditStaff: React.FC<EditStaffProps> = ({
  isOpen,
  onClose,
  staffId,
  initialData,
}) => {
  const [name, setName] = useState(initialData.name);
  const [sitio, setSitio] = useState(initialData.sitio);
  const [contact, setContact] = useState(initialData.contact);
  const [email, setEmail] = useState(initialData.email);
  const [civilStatus, setCivilStatus] = useState(initialData.civilStatus);
  const [gender, setGender] = useState(initialData.gender);
  const [password, setPassword] = useState(""); // Password field for editing
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(initialData.name);
    setSitio(initialData.sitio);
    setContact(initialData.contact);
    setCivilStatus(initialData.civilStatus);
    setGender(initialData.gender);
    setEmail(initialData.email);
    setPassword(""); // Reset password field
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !sitio) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!/^\d{11}$/.test(contact)) {
      alert("Please enter a valid 11-digit contact number.");
      return;
    }

    setLoading(true);

    try {
      // Update Firestore document
      await updateDoc(doc(db, "users", staffId), {
        name,
        sitio,
        contact,
        civilStatus,
        gender,
      });

      // Handle password update
      if (password) {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const credential = EmailAuthProvider.credential(user.email || "", password);
          await reauthenticateWithCredential(user, credential);
          await updatePassword(user, password);
        } else {
          console.error("No authenticated user found.");
        }
      }

      onClose();
    } catch (error) {
      console.error("Error updating document or password: ", error);
      alert("An error occurred while updating the staff. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Staff</h2>
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
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded"
              value={sitio}
              onChange={(e) => setSitio(e.target.value)}
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
              pattern="\d{11}"
              maxLength={11}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Civil Status</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded"
              value={civilStatus}
              onChange={(e) => setCivilStatus(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Gender</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded bg-gray-100 cursor-not-allowed"
              value={email}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              className="mt-1 p-2 w-full border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty if not changing"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="mr-4 py-2 px-4 btn-outline btn-sm text-neutral rounded"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 btn-primary btn btn-sm text-white rounded flex items-center justify-center"
              disabled={loading}
            >
              {loading ? "Loading..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaff;

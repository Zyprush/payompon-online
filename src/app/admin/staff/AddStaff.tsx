import { useState } from "react";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "@/firebase"; // Ensure these paths are correct

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddStaff: React.FC<StaffModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [sitio, setSitio] = useState("");
  const [position, setPosition] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState(""); // New state for email
  const [password, setPassword] = useState(""); // New state for password
  const role = "staff";
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Input validation
    if (!name || !sitio || !position || !contact || !email || !password || !gender || !civilStatus) {
      alert("Please fill in all required fields.");
      return;
    }

    // Contact number validation (must be 11 digits)
    if (!/^\d{11}$/.test(contact)) {
      alert("Please enter a valid 11-digit contact number.");
      return;
    }

    setLoading(true); // Start loading

    const currentUser = auth.currentUser;
    try {
      // Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save staff details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        sitio,
        position,
        contact,
        email,
        role,
        civilStatus,
        gender,
        uid: user.uid, // Store the user ID
      });

      onClose(); // Close the modal after submission
      setName("");
      setSitio("");
      setPosition("");
      setContact("");
      setEmail("");
      setPassword(""); // Reset all fields
      setCivilStatus("");
      setGender("");
    } catch (error) {
      console.error("Error adding staff: ", error);
      alert("An error occurred while adding the staff. Please try again.");
    } finally {
      if (currentUser) {
        await auth.updateCurrentUser(currentUser);
      }
      setLoading(false); // Stop loading
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
        <h2 className="text-lg font-bold mb-4 text-primary drop-shadow">Add Staff</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <label className="block text-gray-700">Civil Status</label>
            <select
              className="mt-1 p-2 w-full border rounded"
              value={civilStatus}
              onChange={(e) => setCivilStatus(e.target.value)}
              required
            >
              <option value="">Select Civil Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Annul">Annul</option>
              <option value="Widow">Widow</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Gender</label>
            <select
              className="mt-1 p-2 w-full border rounded"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Sitio</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded"
              value={sitio}
              onChange={(e) => setSitio(e.target.value)}
              required
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
              maxLength={11}
              pattern="\d{11}" // Optional pattern for validation
              title="Please enter a valid 11-digit number"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 p-2 w-full border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 p-2 w-full border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6} // Ensure a minimum password length
            />
          </div>
          <div className="col-span-2 flex justify-end gap-2">
            <button
              type="button"
              className="py-2 px-4 btn btn-outline text-neutral rounded"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 btn btn-primary text-white rounded"
              disabled={loading}
            >
              {loading ? "Creating..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>



  );
};

export default AddStaff;

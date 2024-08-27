"use client";
import React, { useState, useEffect } from "react";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "@/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNotifStore } from "@/state/notif";
import { currentTime } from "@/helper/time";

interface AddRequestProps {
  open: boolean;
  handleClose: () => void;
}

const AddRequest: React.FC<AddRequestProps> = ({
  open,
  handleClose,
}): JSX.Element | null => {
  const [requestType, setRequestType] = useState<string>("");
  const [gcashRefNo, setGcashRefNo] = useState<string>("");
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userSitio, setUserSitio] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const addNotif = useNotifStore((state) => state.addNotif); // Get the addNotif function

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
        fetchUserData(user.uid);
      } else {
        setUserUid(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid); // Assuming you have a 'users' collection
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData?.name || null); // Assuming the user's name is stored under 'name'
        setUserSitio(userData?.sitio || null); // Assuming the user's name is stored under 'name'
      } else {
        console.error("No such user!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSubmit = async () => {
    if (!userUid || !userName) {
      alert("You must be logged in to submit a request.");
      return;
    }

    if (!requestType || !gcashRefNo || !proofOfPayment) {
      alert("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const storageRef = ref(storage, `proofOfPayment/${proofOfPayment.name}`);
      const snapshot = await uploadBytes(storageRef, proofOfPayment);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, "requests"), {
        submittedName: userName,
        sitio: userSitio,
        submittedBy: userUid,
        requestType,
        gcashRefNo,
        proofOfPaymentURL: downloadURL,
        timestamp: currentTime,
        status: "pending",
      });

      // Create a notification
      await addNotif({
        for: "admin",
        message: `${userName} Request for ${requestType}`,
        time: currentTime,
        type: "admin",
        read: false,
      });

      alert("Request submitted successfully!");
      handleClose();
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Error submitting request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold mb-4">Submit a Request</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Request Type</label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              disabled={loading}
            >
              <option value="">Select a type</option>
              <option value="Barangay clearance">Barangay clearance</option>
              <option value="Indigency">Indigency</option>
              <option value="Business permit">Business permit</option>
              <option value="Certificate of residency">Certificate of residency</option>
              <option value="Certificate of late registration">Certificate of late registration</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              GCash Reference Number
            </label>
            <input
              type="text"
              value={gcashRefNo}
              onChange={(e) => setGcashRefNo(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              disabled={loading}
            />
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
              disabled={loading}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 btn-outline btn text-neutral font-semibold rounded-md mr-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 btn btn-primary text-sm font-semibold text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRequest;

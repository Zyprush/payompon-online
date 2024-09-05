"use client";
import React, { useState, useEffect } from "react";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "@/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNotifStore } from "@/state/notif";
import { currentTime } from "@/helper/time";
import GetImage from "@/components/GetImage";
import { fetchFromSettings } from "@/helper/getSettings";

interface AddRequestProps {
  open: boolean;
  handleClose: () => void;
}

const AddRequest: React.FC<AddRequestProps> = ({
  open,
  handleClose,
}): JSX.Element | null => {
  const [requestType, setRequestType] = useState<string>("");
  const [purpose, setPurpose] = useState<string>(""); // State for Purpose
  const [amount, setAmount] = useState<string>(""); // State for Amount
  const [gcashRefNo, setGcashRefNo] = useState<string>("");
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userSitio, setUserSitio] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [contact, setContact] = useState<boolean>(false);

  const addNotif = useNotifStore((state) => state.addNotif); // Get the addNotif function

  useEffect(() => {
    const fetchContactSetting = async () => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserUid(user.uid);
          fetchUserData(user.uid);
        } else {
          setUserUid(null);
        }
        const getContact = await fetchFromSettings("gcash");
        setContact(getContact);
      });

      return () => unsubscribe();
    };

    fetchContactSetting();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid); // Assuming you have a 'users' collection
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData?.name || null); // Assuming the user's name is stored under 'name'
        setUserSitio(userData?.sitio || null); // Assuming the user's sitio is stored under 'sitio'
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

    if (!requestType || !purpose || !amount || !gcashRefNo || !proofOfPayment) {
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
        purpose, // Include Purpose in the submitted data
        amount, // Include Amount in the submitted data
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
    <div className="fixed inset-0 z-50 flex md:items-center md:justify-center bg-black md:bg-opacity-50 bg-opacity-0">
      <div className="bg-white md:rounded-lg shadow-lg w-full md:w-96 mt-14 md:mt-0">
        <div className="px-6 py-4 flex flex-col gap-2">
          <h2 className="text-lg font-bold mt-10 md:mt-0 mb-4 text-primary  drop-shadow">
            Submit a Request
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-zinc-700">
              Request Type
            </label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className="w-full px-3 py-2 border rounded-sm text-sm text-zinc-700"
              disabled={loading}
            >
              <option value="">Select a type</option>
              <option value="Barangay clearance">Barangay clearance</option>
              <option value="Indigency">Indigency</option>
              <option value="Business permit">Business permit</option>
              <option value="Certificate of residency">
                Certificate of residency
              </option>
              <option value="Certificate of late registration">
                Certificate of late registration
              </option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-zinc-700">
              Purpose
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 border rounded-sm text-sm text-zinc-700"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-zinc-700">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-sm text-sm text-zinc-700"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-zinc-700">
              GCash Reference Number
            </label>
            <input
              type="text"
              value={gcashRefNo}
              onChange={(e) => setGcashRefNo(e.target.value)}
              className="w-full px-3 py-2 border rounded-sm text-sm text-zinc-700"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-semibold mb-2 text-zinc-700"
              htmlFor="proof"
            >
              Proof of Payment
            </label>
            <input
              type="file"
              accept="image/*"
              id="proof"
              onChange={(e) => {
                if (e.target.files) setProofOfPayment(e.target.files[0]);
              }}
              className="w-full px-3 py-2 border rounded-sm"
              disabled={loading}
            />
          </div>
          <div className="flex gap-5 justify-start">
            <div className="w-44 tooltip tooltip-top" data-tip="Gcash QR Code">
              <p className="font-semibold text-zinc-600">
                {contact}
              </p>
              <GetImage storageLink="settings/gcashQR" />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 btn-outline btn text-neutral font-semibold rounded-sm mr-2"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 btn btn-primary  text-sm font-semibold text-white rounded-sm "
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRequest;

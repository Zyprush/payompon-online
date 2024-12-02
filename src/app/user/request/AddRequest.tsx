"use client";
import React, { useState, useEffect} from "react";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "@/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNotifStore } from "@/state/notif";
import { currentTime } from "@/helper/time";
import GetImage from "@/components/GetImage";
import GetText from "@/app/admin/settings/GetText";

interface AddRequestProps {
  open: boolean;
  handleClose: () => void;
  onRequestAdded: () => void;
}

const AddRequest: React.FC<AddRequestProps> = ({
  open,
  handleClose,
  onRequestAdded,
}): JSX.Element | null => {
  const [requestType, setRequestType] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [showOtherPurpose, setShowOtherPurpose] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [format, setFormat] = useState<string>("");
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userSitio, setUserSitio] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [services, setServices] = useState<
    { name: string; format: string; price: string }[]
  >([]);
  const [purposes, setPurposes] = useState<string[]>([]); // Change to store purposes as an array of strings

  const addNotif = useNotifStore((state) => state.addNotif);
  // Update the amount when the request type changes
  const handleRequestTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedService = services.find(
      (service) => service.name === e.target.value
    );
    setRequestType(e.target.value);
    console.log("e.target.value", e.target.value);
    if (selectedService) {
      setAmount(selectedService.price);
      setFormat(selectedService.format);
    } else {
      setAmount("");
      setFormat("");
    }
  };

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
      });
      // Fetch services from Firestore
      const fetchServices = async () => {
        const servicesDoc = await getDoc(doc(db, "settings", "services"));
        if (servicesDoc.exists()) {
          setServices(servicesDoc.data()?.services || []);
        }
      };
      fetchServices();

      const fetchPurposes = async () => {
        const purposesDoc = await getDoc(doc(db, "settings", "purposes"));
        if (purposesDoc.exists()) {
          setPurposes(purposesDoc.data().purposes || []); // Assuming the data is an array of purpose strings
        } else {
          console.log("No such document!");
        }
      };
      fetchPurposes();

      return () => unsubscribe();
    };

    fetchContactSetting();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData?.firstname + " " + userData?.lastname || " ");
        setUserSitio(userData?.sitio || null);
      } else {
        console.error("No such user!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleShowOtherPurpose = () => {
    setShowOtherPurpose(!showOtherPurpose);
  };

  const handleSubmit = async () => {
    if (!userUid) {
      alert("You must be logged in to submit a request.");
      return;
    }

    if (!requestType || !purpose || !amount || !proofOfPayment) {
      alert("All fields are required.");
      return;
    }

    if (!confirm("Notice: Review before submitting. \n\n Your request will be process in 6 minutes. Ensure all details are correct, as cancellation are not allowed once submitted. \n\n Are you sure you want to proceed?")) {
      return;
    }

    setLoading(true);

    try {
      const storageRef = ref(storage, `proofOfPayment/${proofOfPayment.name}`);
      const snapshot = await uploadBytes(storageRef, proofOfPayment);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const newRequest = {
        submittedName: userName,
        sitio: userSitio,
        submittedBy: userUid,
        otherPurpose: showOtherPurpose,
        requestType,
        purpose,
        amount,
        format,
        proofOfPaymentURL: downloadURL,
        timestamp: currentTime,
        status: "pending",
      };

      await addNotif({
        for: "admin",
        message: `${userName} Request for ${requestType}`,
        time: currentTime,
        type: "admin",
        read: false,
      });

      await addNotif({
        for: userUid,
        message: `Your request for ${requestType} has been submitted`,
        time: currentTime,
        type: "user",
        read: false,
      });

      onRequestAdded();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto pt-5">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 md:mx-0 md:w-96">
        <div className="px-4 md:px-6 py-4 flex flex-col gap-2">
          <h2 className="text-lg flex justify-between w-full font-bold mb-4 text-primary drop-shadow">
            Submit a Request
          </h2>
          <h1 className="text-sm border p-2 text-zinc-600 flex items-center mr-auto">
            <b className="mr-2 text-lg">₱ {amount}</b> {requestType} Amount
          </h1>

          {/* Request Type Dropdown */}
          <div className="my-4">
            <label className="block text-sm font-semibold mb-2 text-zinc-700">
              Request Type
            </label>
            <select
              required
              value={requestType}
              onChange={handleRequestTypeChange}
              className="w-full px-3 py-2 border rounded-sm text-sm text-zinc-700"
              disabled={loading}
            >
              <option value="">Select a service</option>
              {services.map((service, index) => (
                <option key={index} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          {!showOtherPurpose && (
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-zinc-700">
                Purpose
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 border rounded-sm text-sm text-zinc-700"
                disabled={loading}
              >
                <option value="">Select a purpose</option>
                {purposes.map((pur, index) => (
                  <option key={index} value={pur}>
                    {pur}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={showOtherPurpose}
              onChange={handleShowOtherPurpose}
              className="mr-2"
            />
            <label className="text-sm font-semibold text-zinc-700">
              Other Purpose
            </label>
          </div>
          {/* Other Purpose Input */}
          {showOtherPurpose && (
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-zinc-700">
                Other Purpose
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 border rounded-sm text-sm text-zinc-700"
                placeholder="Please enter your purpose"
                required
              />
            </div>
          )}

          {/* Proof of Payment */}
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

          {/* Gcash QR and Buttons */}
          <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
            <div className="w-44 tooltip tooltip-top" data-tip="Gcash QR Code">
              <p className="font-semibold text-zinc-600">
                <GetText name="gcash" title="Gcash no." />
              </p>
              <GetImage storageLink="settings/gcashQR" />
            </div>

            <div className="flex col-span-1 justify-end gap-3 w-full md:w-auto">
              <button
                onClick={handleClose}
                className="w-full md:w-auto px-4 py-2 btn-outline btn text-neutral font-semibold rounded-sm"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="w-full md:w-auto px-4 py-2 btn btn-primary text-sm font-semibold text-white rounded-sm"
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

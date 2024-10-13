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
  const [amount, setAmount] = useState<string>("");
  const [gcashRefNo, setGcashRefNo] = useState<string>("");
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userSitio, setUserSitio] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [contact, setContact] = useState<string>("");
  const [services, setServices] = useState<{ name: string; price: string }[]>(
    []
  );
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
    } else {
      setAmount(""); // Reset amount if no service is selected
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
        const getContact = await fetchFromSettings("gcash");
        setContact(getContact);
      });
      // Fetch services from Firestore
      const fetchServices = async () => {
        const servicesDoc = await getDoc(doc(db, "settings", "services"));
        if (servicesDoc.exists()) {
          setServices(servicesDoc.data()?.services || []);
        }
      };
      fetchServices();

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
        setUserName(userData?.name || null);
        setUserSitio(userData?.sitio || null);
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

      const newRequest = {
        submittedName: userName,
        sitio: userSitio,
        submittedBy: userUid,
        requestType,
        purpose,
        //service price ,
        amount: gcashRefNo,
        proofOfPaymentURL: downloadURL,
        timestamp: currentTime,
        status: "pending",
      };

      const docRef = await addDoc(collection(db, "requests"), newRequest);

      // Create notifications
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
    <div className="fixed inset-0 z-50 flex md:items-center md:justify-center bg-black md:bg-opacity-50 bg-opacity-0">
      <div className="bg-white md:rounded-lg shadow-lg w-full md:w-96 mt-14 md:mt-0">
        <div className="px-6 py-4 flex flex-col gap-2">
          <h2 className="text-lg flex justify-between w-full font-bold mt-10 md:mt-0 mb-4 text-primary  drop-shadow">
            Submit a Request
          </h2>
          <h1 className="text-sm border p-2 -mt-3 text-zinc-600 flex items-center mr-auto">
            <b className="mr-2 text-lg">₱ {amount}</b> {requestType} Amount
          </h1>
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
              <option value="Employment Requirement">
                Employment Requirement
              </option>
              <option value="Business Permit">Business Permit</option>
              <option value="Travel/Passport Requirement">
                Travel/Passport Requirement
              </option>
              <option value="Bank Account Opening">Bank Account Opening</option>
              <option value="Job Application">Job Application</option>
              <option value="Barangay ID Application">
                Barangay ID Application
              </option>
              <option value="School/Scholarship">School/Scholarship</option>
              <option value="Proof of Residency">Proof of Residency</option>
              <option value="Police Clearance">Police Clearance</option>
              <option value="Marriage License">Marriage License</option>
              <option value="Loan">Loan</option>
              <option value="Financial assistance">Financial assistance</option>
              <option value="Firearm License">Firearm License</option>
              <option value="Local Government Transactions">
                Local Government Transactions
              </option>
              <option value="Legal or Court Requirements">
                Legal or Court Requirements
              </option>
              <option value="Community Event Participation">
                Community Event Participation
              </option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-zinc-700">
              GCash Reference Number
            </label>
            <input
              type="text"
              value={gcashRefNo}
              required
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
                <GetText name="gcash" title="Gcash no." />
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

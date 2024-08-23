"use client";
import NavLayout from "@/components/NavLayout";
import React, { useState, useEffect } from "react";
import { db, storage } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import DetailItem from "./DetailItem";
import SignatureUpload from "./SignatureUpload";

const Settings: React.FC = (): JSX.Element => {
  const [originalBarangayInfo, setOriginalBarangayInfo] = useState("");
  const [originalAddress, setOriginalAddress] = useState("");
  const [originalContact, setOriginalContact] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [originalCaptainSignature, setOriginalCaptainSignature] = useState("");
  const [barangayInfo, setBarangayInfo] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [captainSignature, setCaptainSignature] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [signaturePreviewUrl, setSignaturePreviewUrl] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false); // Loading state for data fetching

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true); // Set loading state to true before fetching data
      try {
        const docRef = doc(db, "settings", "barangayInfo");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setOriginalBarangayInfo(data.barangayInfo || "");
          setOriginalAddress(data.address || "");
          setOriginalContact(data.contact || "");
          setOriginalEmail(data.email || "");
          setOriginalCaptainSignature(data.captainSignature || "");

          // Set current state to original values
          setBarangayInfo(data.barangayInfo || "");
          setAddress(data.address || "");
          setContact(data.contact || "");
          setEmail(data.email || "");
          setCaptainSignature(data.captainSignature || "");
        } else {
          // Create default document if not exists
          await setDoc(docRef, {
            barangayInfo: "",
            address: "",
            contact: "",
            email: "",
            captainSignature: "",
          });

          // Set default values
          setBarangayInfo("");
          setAddress("");
          setContact("");
          setEmail("");
          setCaptainSignature("");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false); // Set loading state to false after fetching data
      }
    };

    fetchSettings();
  }, [isEditing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "image/png") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid PNG file.");
    }
  };

  const validateInputs = () => {
    return (
      barangayInfo.trim() !== "" &&
      address.trim() !== "" &&
      contact.trim() !== "" &&
      email.trim() !== "" &&
      (isEditing ? signaturePreviewUrl !== null : true) // Ensure signature is set if editing
    );
  };

  const handleSave = async () => {
    if (!validateInputs()) {
      alert("All fields are required.");
      return;
    }

    setLoading(true); // Set loading state to true while saving

    try {
      let newSignatureUrl = captainSignature;

      if (signaturePreviewUrl) {
        if (captainSignature) {
          const oldSignatureRef = ref(storage, captainSignature);
          await deleteObject(oldSignatureRef);
        }

        const file = await fetch(signaturePreviewUrl).then((res) => res.blob());
        const storageRef = ref(storage, `signatures/captainSignature.png`);
        await uploadBytes(storageRef, file);
        newSignatureUrl = await getDownloadURL(storageRef);
      }

      // Create or update the document
      await setDoc(doc(db, "settings", "barangayInfo"), {
        barangayInfo,
        address,
        contact,
        email,
        captainSignature: newSignatureUrl,
      });

      // Update original values
      setOriginalBarangayInfo(barangayInfo);
      setOriginalAddress(address);
      setOriginalContact(contact);
      setOriginalEmail(email);
      setOriginalCaptainSignature(newSignatureUrl);

      setIsEditing(false);
      setSignaturePreviewUrl(null); // Clear the preview URL
    } catch (error) {
      console.error("Error updating settings:", error);
    } finally {
      setLoading(false); // Set loading state to false after saving
    }
  };

  const handleCancel = () => {
    setBarangayInfo(originalBarangayInfo);
    setAddress(originalAddress);
    setContact(originalContact);
    setEmail(originalEmail);
    setCaptainSignature(originalCaptainSignature);
    setSignaturePreviewUrl(null);
    setIsEditing(false);
  };

  return (
    <NavLayout>
      <div className="bg-white rounded-xl border p-10 md:m-10 shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="loader">Loading...</div> {/* Add your loading indicator here */}
          </div>
        ) : (
          <>
            <DetailItem
              label="barangayInfo"
              value={barangayInfo}
              isEditing={isEditing}
              onChange={(e) => setBarangayInfo(e.target.value)}
            />
            <DetailItem
              label="address"
              value={address}
              isEditing={isEditing}
              onChange={(e) => setAddress(e.target.value)}
            />
            <DetailItem
              label="contact"
              value={contact}
              isEditing={isEditing}
              onChange={(e) => setContact(e.target.value)}
            />
            <DetailItem
              label="email"
              value={email}
              isEditing={isEditing}
              onChange={(e) => setEmail(e.target.value)}
            />
            <SignatureUpload
              label="captainSignature"
              value={captainSignature}
              isEditing={isEditing}
              onFileChange={handleFileChange}
              filePreviewUrl={signaturePreviewUrl}
            />
            <div className="mt-4">
              {isEditing ? (
                <div className="flex gap-5">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 btn-outline btn btn-sm text-neutral rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 btn btn-sm btn-primary font-semibold text-white rounded-md mr-2"
                  >
                    {loading ? "Loading..." : "Save"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 btn-outline btn btn-sm text-neutral rounded-md"
                >
                  Edit
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </NavLayout>
  );
};

export default Settings;

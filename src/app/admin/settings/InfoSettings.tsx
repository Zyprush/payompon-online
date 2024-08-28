"use client";
import React, { useState, useEffect } from "react";
import { db, storage } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import DetailItem from "./DetailItem";

const InfoSetting: React.FC = (): JSX.Element => {
  // Original states
  const [originalBarangayInfo, setOriginalBarangayInfo] = useState<string>("");
  const [originalAddress, setOriginalAddress] = useState<string>("");
  const [originalContact, setOriginalContact] = useState<string>("");
  const [originalEmail, setOriginalEmail] = useState<string>("");

  // Current states
  const [barangayInfo, setBarangayInfo] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // Additional states
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "settings", "barangayInfo");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setOriginalBarangayInfo(data.barangayInfo || "");
          setOriginalAddress(data.address || "");
          setOriginalContact(data.contact || "");
          setOriginalEmail(data.email || "");

          setBarangayInfo(data.barangayInfo || "");
          setAddress(data.address || "");
          setContact(data.contact || "");
          setEmail(data.email || "");

        } else {
          await setDoc(docRef, {
            barangayInfo: "",
            address: "",
            contact: "",
            email: "",
            captainSignature: "",
            barangayLogo: "",
            municipalLogo: "",
            gcashQr: "",
          });

          setBarangayInfo("");
          setAddress("");
          setContact("");
          setEmail("");
        }
      } catch (error) {
        alert("Error fetching settings. Please try again later.");
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [isEditing]);





  const handleSave = async () => {
    setLoading(true);

    try {
      const uploadImage = async (
        previewUrl: string | null,
        storagePath: string,
        oldUrl: string
      ) => {
        if (previewUrl) {
          const file = await fetch(previewUrl).then((res) => res.blob());
          const storageRef = ref(storage, storagePath);
          await uploadBytes(storageRef, file);
          return await getDownloadURL(storageRef);
        }
        return oldUrl;
      };

      await setDoc(doc(db, "settings", "barangayInfo"), {
        barangayInfo,
        address,
        contact,
        email,
      });

      setOriginalBarangayInfo(barangayInfo);
      setOriginalAddress(address);
      setOriginalContact(contact);
      setOriginalEmail(email);

      setIsEditing(false);
    } catch (error) {
      alert("Error updating settings. Please try again later.");
      console.error("Error updating settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setBarangayInfo(originalBarangayInfo);
    setAddress(originalAddress);
    setContact(originalContact);
    setEmail(originalEmail);
    setIsEditing(false);
  };

  return (
      <div className="bg-white grid grid-cols-2 rounded-lg border p-10 shadow-sm gap-5 ml-0">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="loader">Loading...</div>
          </div>
        ) : (
          <>
            <DetailItem
              label="Barangay Info"
              value={barangayInfo}
              onChange={(e) => setBarangayInfo(e.target.value)}
              isEditing={isEditing}
            />
            <DetailItem
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              isEditing={isEditing}
            />
            <DetailItem
              label="Contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              isEditing={isEditing}
            />
            <DetailItem
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isEditing={isEditing}
            />
            <div className="flex justify-end space-x-4 col-span-2 mt-8">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="btn-outline btn-sm btn text-neutral py-2 px-4 rounded"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn btn-sm btn-primary text-white rounded"
                    disabled={loading}
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-sm btn-outline text-neutral rounded"
                >
                  Edit
                </button>
              )}
            </div>
          </>
        )}
      </div>
  );
};

export default InfoSetting;

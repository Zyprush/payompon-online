"use client";
import NavLayout from "@/components/NavLayout";
import React, { useState, useEffect } from "react";
import { db, storage } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";
import DetailItem from "./DetailItem";
import SignatureUpload from "./SignatureUpload";

const Settings: React.FC = (): JSX.Element => {
  const [originalBarangayInfo, setOriginalBarangayInfo] = useState<string>("");
  const [originalAddress, setOriginalAddress] = useState<string>("");
  const [originalContact, setOriginalContact] = useState<string>("");
  const [originalEmail, setOriginalEmail] = useState<string>("");
  const [originalCaptainSignature, setOriginalCaptainSignature] = useState<string>("");
  const [barangayInfo, setBarangayInfo] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [captainSignature, setCaptainSignature] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [signaturePreviewUrl, setSignaturePreviewUrl] = useState<string | null>(null);
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
          setOriginalCaptainSignature(data.captainSignature || "");

          setBarangayInfo(data.barangayInfo || "");
          setAddress(data.address || "");
          setContact(data.contact || "");
          setEmail(data.email || "");
          setCaptainSignature(data.captainSignature || "");

          if (data.captainSignature) {
            setSignaturePreviewUrl(data.captainSignature);
          }
        } else {
          await setDoc(docRef, {
            barangayInfo: "",
            address: "",
            contact: "",
            email: "",
            captainSignature: "",
          });

          setBarangayInfo("");
          setAddress("");
          setContact("");
          setEmail("");
          setCaptainSignature("");
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
      (isEditing ? signaturePreviewUrl !== null : true)
    );
  };

  const handleSave = async () => {
    if (!validateInputs()) {
      alert("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      let newSignatureUrl = captainSignature;

      if (signaturePreviewUrl) {
        if (captainSignature) {
          try {
            const oldSignatureRef = ref(storage, captainSignature);
            await deleteObject(oldSignatureRef);
          } catch (error) {
            if ((error as { code: string }).code !== 'storage/object-not-found') {
              throw error;
            }
          }
        }

        const file = await fetch(signaturePreviewUrl).then((res) => res.blob());
        const storageRef = ref(storage, `signatures/captainSignature.png`);
        await uploadBytes(storageRef, file);
        newSignatureUrl = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "settings", "barangayInfo"), {
        barangayInfo,
        address,
        contact,
        email,
        captainSignature: newSignatureUrl,
      });

      setOriginalBarangayInfo(barangayInfo);
      setOriginalAddress(address);
      setOriginalContact(contact);
      setOriginalEmail(email);
      setOriginalCaptainSignature(newSignatureUrl);

      setIsEditing(false);
      setSignaturePreviewUrl(null);
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
    setCaptainSignature(originalCaptainSignature);
    setSignaturePreviewUrl(null);
    setIsEditing(false);
  };

  return (
    <NavLayout>
      <div className="bg-white rounded-xl border p-10 md:m-10 shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="loader">Loading...</div>
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

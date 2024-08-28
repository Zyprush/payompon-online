"use client";
import NavLayout from "@/components/NavLayout";
import React, { useState, useEffect } from "react";
import { db, storage } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";
import DetailItem from "./DetailItem";
import SignatureUpload from "./SignatureUpload";

const Settings: React.FC = (): JSX.Element => {
  // Original states
  const [originalBarangayInfo, setOriginalBarangayInfo] = useState<string>("");
  const [originalAddress, setOriginalAddress] = useState<string>("");
  const [originalContact, setOriginalContact] = useState<string>("");
  const [originalEmail, setOriginalEmail] = useState<string>("");
  const [originalCaptainSignature, setOriginalCaptainSignature] =
    useState<string>("");
  const [originalBarangayLogo, setOriginalBarangayLogo] = useState<string>("");
  const [originalMunicipalLogo, setOriginalMunicipalLogo] =
    useState<string>("");
  const [originalGcashQr, setOriginalGcashQr] = useState<string>("");

  // Current states
  const [barangayInfo, setBarangayInfo] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [captainSignature, setCaptainSignature] = useState<string>("");
  const [barangayLogo, setBarangayLogo] = useState<string>("");
  const [municipalLogo, setMunicipalLogo] = useState<string>("");
  const [gcashQr, setGcashQr] = useState<string>("");

  // Additional states
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [signaturePreviewUrl, setSignaturePreviewUrl] = useState<string | null>(
    null
  );
  const [barangayLogoPreviewUrl, setBarangayLogoPreviewUrl] = useState<
    string | null
  >(null);
  const [municipalLogoPreviewUrl, setMunicipalLogoPreviewUrl] = useState<
    string | null
  >(null);
  const [gcashQrPreviewUrl, setGcashQrPreviewUrl] = useState<string | null>(
    null
  );
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
          setOriginalBarangayLogo(data.barangayLogo || "");
          setOriginalMunicipalLogo(data.municipalLogo || "");
          setOriginalGcashQr(data.gcashQr || "");

          setBarangayInfo(data.barangayInfo || "");
          setAddress(data.address || "");
          setContact(data.contact || "");
          setEmail(data.email || "");
          setCaptainSignature(data.captainSignature || "");
          setBarangayLogo(data.barangayLogo || "");
          setMunicipalLogo(data.municipalLogo || "");
          setGcashQr(data.gcashQr || "");

          if (data.captainSignature) {
            setSignaturePreviewUrl(data.captainSignature);
          }
          if (data.barangayLogo) {
            setBarangayLogoPreviewUrl(data.barangayLogo);
          }
          if (data.municipalLogo) {
            setMunicipalLogoPreviewUrl(data.municipalLogo);
          }
          if (data.gcashQr) {
            setGcashQrPreviewUrl(data.gcashQr);
          }
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
          setCaptainSignature("");
          setBarangayLogo("");
          setMunicipalLogo("");
          setGcashQr("");
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

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type === "image/png") {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === "captainSignature")
          setSignaturePreviewUrl(reader.result as string);
        if (field === "barangayLogo")
          setBarangayLogoPreviewUrl(reader.result as string);
        if (field === "municipalLogo")
          setMunicipalLogoPreviewUrl(reader.result as string);
        if (field === "gcashQr") setGcashQrPreviewUrl(reader.result as string);
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
      (isEditing
        ? signaturePreviewUrl !== null ||
          barangayLogoPreviewUrl !== null ||
          municipalLogoPreviewUrl !== null ||
          gcashQrPreviewUrl !== null
        : true)
    );
  };

  const handleSave = async () => {
    if (!validateInputs()) {
      alert("All fields are required.");
      return;
    }

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

      const newCaptainSignatureUrl = await uploadImage(
        signaturePreviewUrl,
        "signatures/captainSignature.png",
        captainSignature
      );

      const newBarangayLogoUrl = await uploadImage(
        barangayLogoPreviewUrl,
        "logos/barangayLogo.png",
        barangayLogo
      );

      const newMunicipalLogoUrl = await uploadImage(
        municipalLogoPreviewUrl,
        "logos/municipalLogo.png",
        municipalLogo
      );

      const newGcashQrUrl = await uploadImage(
        gcashQrPreviewUrl,
        "qrcodes/gcashQr.png",
        gcashQr
      );

      await setDoc(doc(db, "settings", "barangayInfo"), {
        barangayInfo,
        address,
        contact,
        email,
        captainSignature: newCaptainSignatureUrl,
        barangayLogo: newBarangayLogoUrl,
        municipalLogo: newMunicipalLogoUrl,
        gcashQr: newGcashQrUrl,
      });

      setOriginalBarangayInfo(barangayInfo);
      setOriginalAddress(address);
      setOriginalContact(contact);
      setOriginalEmail(email);
      setOriginalCaptainSignature(newCaptainSignatureUrl);
      setOriginalBarangayLogo(newBarangayLogoUrl);
      setOriginalMunicipalLogo(newMunicipalLogoUrl);
      setOriginalGcashQr(newGcashQrUrl);

      setIsEditing(false);
      setSignaturePreviewUrl(null);
      setBarangayLogoPreviewUrl(null);
      setMunicipalLogoPreviewUrl(null);
      setGcashQrPreviewUrl(null);
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
    setBarangayLogo(originalBarangayLogo);
    setMunicipalLogo(originalMunicipalLogo);
    setGcashQr(originalGcashQr);
    setSignaturePreviewUrl(null);
    setBarangayLogoPreviewUrl(null);
    setMunicipalLogoPreviewUrl(null);
    setGcashQrPreviewUrl(null);
    setIsEditing(false);
  };

  return (
    <NavLayout>
      <div className="bg-white grid grid-cols-2 rounded-xl border p-10 md:m-10 shadow-sm gap-5">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="loader">Loading...</div>
          </div>
        ) : (
          <>
            <SignatureUpload
              label="Captain's Signature"
              previewUrl={signaturePreviewUrl || ""}
              onFileChange={(e) => handleFileChange(e, "captainSignature")}
              isEditing={isEditing}
            />
            <SignatureUpload
              label="Barangay Logo"
              previewUrl={barangayLogoPreviewUrl || ""}
              onFileChange={(e) => handleFileChange(e, "barangayLogo")}
              isEditing={isEditing}
            />
            <SignatureUpload
              label="Municipal Logo"
              previewUrl={municipalLogoPreviewUrl || ""}
              onFileChange={(e) => handleFileChange(e, "municipalLogo")}
              isEditing={isEditing}
            />
            <SignatureUpload
              label="GCash QR Code"
              previewUrl={gcashQrPreviewUrl || ""}
              onFileChange={(e) => handleFileChange(e, "gcashQr")}
              isEditing={isEditing}
            />
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
                    className="bg-gray-500 text-white py-2 px-4 rounded"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    disabled={loading || !validateInputs()}
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white py-2 px-4 rounded"
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

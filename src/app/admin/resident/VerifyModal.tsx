"use client";
import React, { useState } from "react";
import { storage, db } from "@/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { useLogs } from "@/hooks/useLogs";
import { currentTime } from "@/helper/time";
import useUserData from "@/hooks/useUserData";

interface VerifyModalProps {
  userId: string;
  onClose: () => void;
  onVerified: () => void;
}

const VerifyModal: React.FC<VerifyModalProps> = ({
  userId,
  onClose,
  onVerified,
}) => {
  const [leftThumb, setLeftThumb] = useState<File | null>(null);
  const [rightThumb, setRightThumb] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [leftThumbPreview, setLeftThumbPreview] = useState<string | null>(null);
  const [rightThumbPreview, setRightThumbPreview] = useState<string | null>(
    null
  );
  const { addLog } = useLogs();
  const { userRole } = useUserData();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setThumb: React.Dispatch<React.SetStateAction<File | null>>,
    setThumbPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setThumb(file);
      setThumbPreview(URL.createObjectURL(file)); // Set preview URL
    }
  };

  const handleVerify = async () => {
    // Confirm verification
    const isConfirmed = window.confirm(
      "Are you sure you want to verify this resident, this action cannot be undone?"
    );
    if (!isConfirmed) return;

    if (!leftThumb || !rightThumb) {
      alert("Please upload both left and right thumb images.");
      return;
    }

    try {
      setIsLoading(true);

      const leftThumbRef = ref(storage, `fingerprints/${userId}-left-thumb`);
      const rightThumbRef = ref(storage, `fingerprints/${userId}-right-thumb`);

      const leftUpload = uploadBytes(leftThumbRef, leftThumb);
      const rightUpload = uploadBytes(rightThumbRef, rightThumb);

      const [leftSnapshot, rightSnapshot] = await Promise.all([
        leftUpload,
        rightUpload,
      ]);

      const leftUrl = await getDownloadURL(leftSnapshot.ref);
      const rightUrl = await getDownloadURL(rightSnapshot.ref);

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        verified: true,
        verifiedAt: new Date().toISOString(),
        leftThumb: leftUrl,
        rightThumb: rightUrl,
      });
      addLog({
        name: `Verified ${userId} account`,
        date: currentTime,
        role: userRole,
      });

      onVerified();
    } catch (error) {
      console.error("Error verifying user:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-2xl">
        <h2 className="font-bold text-lg">Verify Resident</h2>
        <p className="py-4">Please upload both left and right thumb images.</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Left Thumb Mark */}
          <div className="flex flex-col items-center border-2 border-green-700 p-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileChange(e, setLeftThumb, setLeftThumbPreview)
              }
              className="input w-full mb-2"
            />
            {leftThumbPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={leftThumbPreview}
                alt="Left Thumb Preview"
                className="w-32 h-32 object-cover border rounded"
              />
            ) : (
              <div className="w-32 h-32 border border-green-700 flex items-center justify-center">
                <span className="text-blue-600 italic">Left Thumb Mark</span>
              </div>
            )}
          </div>

          {/* Right Thumb Mark */}
          <div className="flex flex-col items-center border-2 border-green-700 p-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileChange(e, setRightThumb, setRightThumbPreview)
              }
              className="input w-full mb-2"
            />
            {rightThumbPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={rightThumbPreview}
                alt="Right Thumb Preview"
                className="w-32 h-32 object-cover border rounded"
              />
            ) : (
              <div className="w-32 h-32 border border-green-700 flex items-center justify-center">
                <span className="text-blue-600 italic">Right Thumb Mark</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-5 mt-8">
          <button onClick={onClose} className="btn btn-outline text-primary">
            Cancel
          </button>
          <button
            onClick={handleVerify}
            disabled={!leftThumb || !rightThumb || isLoading}
            className={`btn ${
              !leftThumb || !rightThumb ? "btn-disabled" : "btn-primary"
            } `}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyModal;

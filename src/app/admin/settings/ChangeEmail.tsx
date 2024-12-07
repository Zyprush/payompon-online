"use client";

import React, { useState } from "react";
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "@/firebase";

const ChangeEmail: React.FC = () => {
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangeEmail = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const user = auth.currentUser;

    if (!user) {
      setErrorMessage("User is not logged in.");
      setLoading(false);
      return;
    }

    try {
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email || "", currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update email
      await updateEmail(user, newEmail);
      setSuccessMessage("Email updated successfully. Please verify your new email.");
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred while changing your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full ml-0 mr-auto p-8 bg-white border rounded-md">
      <h1 className="text-xl text-primary font-bold mb-4">Change Email</h1>
      <div className="flex flex-col w-full max-w-sm">
        <label className="mb-2 text-sm font-medium text-gray-600">New Email</label>
        <input
          type="email"
          className="input input-bordered mb-4 rounded-none"
          placeholder="Enter your new email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <label className="mb-2 text-sm font-medium text-gray-600">Current Password</label>
        <input
          type="password"
          className="input input-bordered mb-4  rounded-none"
          placeholder="Enter your current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <button
          onClick={handleChangeEmail}
          className="btn btn-primary  rounded-none"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Email"}
        </button>
      </div>
      {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default ChangeEmail;

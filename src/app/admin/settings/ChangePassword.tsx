"use client";

import React, { useState } from "react";
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { auth } from "@/firebase";

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangePassword = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      setLoading(false);
      return;
    }

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

      // Update password
      await updatePassword(user, newPassword);
      setSuccessMessage("Password updated successfully.");
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred while changing your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mr-auto ml-0 h-full p-4 bg-white border">
      <h1 className="text-xl text-primary font-bold mb-4">Change Password</h1>
      <div className="flex flex-col w-full max-w-sm">
        <label className="mb-2 text-sm font-medium text-gray-600">Current Password</label>
        <input
          type="password"
          className="input input-bordered mb-4"
          placeholder="Enter your current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <label className="mb-2 text-sm font-medium text-gray-600">New Password</label>
        <input
          type="password"
          className="input input-bordered mb-4"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label className="mb-2 text-sm font-medium text-gray-600">Confirm New Password</label>
        <input
          type="password"
          className="input input-bordered mb-4"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          onClick={handleChangePassword}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
      {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default ChangePassword;
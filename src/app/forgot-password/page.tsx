"use client";
import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (err: any) {
      console.error("Error sending password reset email:", err);
      setError(err.message || "Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center">
      <div className="w-full max-w-sm m-auto bg-white shadow rounded-xl p-5">
        <h2 className="text-xl font-semibold mb-6 text-center text-primary">
          Reset Your Password
        </h2>

        <form onSubmit={handlePasswordReset}>
          <div className="mb-4">
            <label className="text-sm flex items-center justify-between w-full font-semibold mb-2 text-primary">
              Email
              <Link
                href={"/sign-in"}
                className="text-xs underline text-zinc-500"
              >
                Back
              </Link>
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-sm text-sm text-zinc-700"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white text-sm rounded-lg"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Password Reset Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;

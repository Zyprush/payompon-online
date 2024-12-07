"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import SideNavbar from "./navbar/SideNavbar";
import Header from "./navbar/Header";
import MobileHeader from "./navbar/MobileHeader";
import { userNavItems } from "./navbar/navItems";
import FloatingMessageIcon from "./FloatingMessageIcon";
import { auth } from "@/firebase";

interface NavbarProps {
  children: ReactNode;
}

const UserNavLayout: React.FC<NavbarProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Redirect to login if not authenticated
        window.location.href = "/log-in";
      } else {
        // Check if the user's email is verified
        setIsEmailVerified(user.emailVerified);
        setLoading(false); // Stop loading once the email verification status is checked
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSendVerification = async () => {
    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.emailVerified) {
      await sendEmailVerification(currentUser);
      setEmailSent(true); // Show feedback after sending email
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center gap-2 items-center w-screen h-screen text-primary">
        <span className="loading loading-spinner loading-xs"></span>Loading...
      </div>
    );
  }

  if (!isEmailVerified) {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen text-primary">
        <p>Your email is not verified. Please verify your email to continue.</p>
        <button
          onClick={handleSendVerification}
          className="btn btn-primary mt-4"
          disabled={emailSent}
        >
          {emailSent
            ? "Verification Email Sent. Refresh this page after confirming your email."
            : "Send Verification Email"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-0 w-full">
      <SideNavbar navItems={userNavItems} />
      <div className="flex flex-col w-full">
        <Header />
        <MobileHeader navItems={userNavItems} />
        <main className="md:pt-10 pt-20 p-5 bg-[#fbfaf7] md:h-full h-screen">
          {children}
          <FloatingMessageIcon />
        </main>
      </div>
    </div>
  );
};

export default UserNavLayout;

"use client";

import { SignedIn } from "@/components/signed-in";
import { SignedOut } from "@/components/signed-out";
import { auth } from "@/firebase";
import React from "react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import Link from "next/link";
import { LoggedIn } from "@/components/LoggedIn";

const Home = () => {
  const [user] = useAuthState(auth);
  const [signOut] = useSignOut(auth);

  return (
    <main className="flex h-screen w-screen items-center justify-center bg-gradient-to-r from-primary-100 via-primary-200 to-primary-300">
      <SignedIn>
        <LoggedIn />
        <div className="w-full max-w-lg p-8 bg-white shadow-xl rounded-lg text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">
            Welcome Back!
          </h1>
          <p className="text-lg text-gray-600">
            Signed in as <span className="font-semibold">{user?.email}</span>
          </p>
          <p className="mt-2 text-md">
            Email verification status:{" "}
            {user?.emailVerified ? (
              <span className="text-green-600 font-semibold">Verified</span>
            ) : (
              <span className="text-red-600 font-semibold">Not Verified</span>
            )}
          </p>
          <button
            onClick={signOut}
            className="mt-6 w-full px-6 py-3 bg-error text-white rounded-lg font-bold hover:bg-red-600 transition-all"
          >
            Sign Out
          </button>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-xl text-center">
          {/* <h2 className="text-xl font-bold text-primary">
            Welcome to
          </h2> */}
          <h2 className="text-3xl font-bold text-primary mb-4">
            Barangay Portal
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Access a variety of services including certificates, clearances, and
            more, all from the comfort of your home through our online portal.
          </p>
          <div className="flex px-5 justify-center space-x-4">
            <Link
              href="/sign-up"
              className="btn btn-outline text-primary w-1/2"
            >
              Sign Up
            </Link>
            <Link href="/sign-in" className="btn btn-primary text-white w-1/2">
              Log In
            </Link>
          </div>
        </div>
      </SignedOut>
    </main>
  );
};

export default Home;

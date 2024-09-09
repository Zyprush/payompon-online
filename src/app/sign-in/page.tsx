"use client";

import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { SignedOut } from "@/components/signed-out";
import { SignedIn } from "@/components/signed-in";
import { LoggedIn } from "@/components/LoggedIn";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(email, password);
      if (user) {
        router.push("/pages/map");
      }
    } catch (error: any) {
      // Firebase will handle the error display through the 'error' state
      console.error("Sign-in error:", error);
    }
  };

  return (
    <section>
      <div className="flex h-screen w-screen custom-bg items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-8">
        <div className="xl:mx-auto xl:w-full min-w-[20rem] shadow-md p-4 xl:max-w-sm 2xl:max-w-md rounded-xl bg-white">
          <h2 className="text-xl font-bold mt-10 md:mt-0 mb-4 text-primary drop-shadow">
            Login
          </h2>
          <form className="mt-6" method="POST" onSubmit={onSubmit}>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    placeholder="Email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                    className="flex h-10 text-black w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2 relative mb-5">
                  <input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                    className="flex h-10 text-black w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  >
                    {showPassword ? <IconEye /> : <IconEyeOff />}
                  </button>
                </div>
                <Link
                  href={"/sign-up"}
                  className="text-sm underline text-zinc-500 mt-5"
                >
                  Don&apos;t have an account? Sign up
                </Link>
              </div>
              <div>
                <SignedOut>
                  <button
                    className="inline-flex w-full items-center justify-center rounded-md btn btn-primary px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80 mt-5"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </SignedOut>
                <SignedIn>
                  <LoggedIn />
                  <button
                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80 mt-5"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </button>
                </SignedIn>
              </div>
            </div>
          </form>
          {loading && <p className="text-zinc-600 border border-zinc-600 text-sm font-semibold p-2 rounded-md mt-6 text-center">Loading...</p>}
          {error && (
            <p className="text-red-500 border border-red-500 text-sm font-semibold p-2 rounded-md mt-6 text-center">
              {error?.code === "auth/invalid-credential" && "Invalid email or password. Please try again."}
              {error?.code === "auth/user-disabled" && "This account has been disabled. Please contact support."}
              {error?.code === "auth/too-many-requests" && "Too many failed login attempts. Please try again later."}
              {error?.code === "auth/wrong-password" && "The password is incorrect. Please try again."}
              {error?.code === "auth/user-not-found" && "No user found with this email. Please check and try again."}
              {!["auth/invalid-credential", "auth/user-disabled", "auth/too-many-requests", "auth/wrong-password", "auth/user-not-found"].includes(error?.code as string) && "An unexpected error occurred. Please try again."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
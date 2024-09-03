"use client";
import { auth, db } from "@/firebase"; // Ensure you import your Firebase config
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FirebaseError } from "firebase/app";
import { SignedOut } from "@/components/signed-out";
import { SignedIn } from "@/components/signed-in";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { LoggedIn } from "@/components/LoggedIn";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [signInUserWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    setLoading(true); // Set loading to true

    try {
      const userCredential = await signInUserWithEmailAndPassword(
        email,
        password
      );

      if (userCredential && userCredential.user) {
        const user = userCredential.user;

        // Directly reference the user document using UID
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const userRole = userData?.role; // Assuming the role field is called "role"
          console.log("userRole", userRole);
          if (userRole === "admin" || userRole === "staff") {
            router.push("/admin/dashboard");
          } else if (userRole === "resident") {
            router.push("/user/dashboard");
          } else {
            toast.error("Invalid user role. Please contact support.");
          }
        } else {
          toast.error("No user data found for this account.");
        }
      }
    } catch (error: any) {
      console.log('error', error)
      if (error instanceof FirebaseError) {
        const errorMessages: { [key: string]: string } = {
          "auth/invalid-credential":
            "Invalid email or password. Please try again.",
          "auth/user-disabled":
            "This account has been disabled. Please contact support.",
          "auth/too-many-requests":
            "Too many failed login attempts. Please try again later.",
          "auth/wrong-password": "The password is incorrect. Please try again.",
          "auth/user-not-found":
            "No user found with this email. Please check and try again.",
        };

        toast.error(
          errorMessages[error.code] ||
            "An unexpected error occurred. Please try again."
        );
        console.log("error",errorMessages[error.code] )
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Set loading to false regardless of success or error
    }
  };

  return (
    <section>
      <div className="flex h-screen w-screen custom-bg items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-8">
        <div className="xl:mx-auto xl:w-full min-w-[20rem] shadow-md p-4 xl:max-w-sm 2xl:max-w-md rounded-xl bg-white">
          <h2 className="text-lg font-bold mt-10 md:mt-0 mb-4 text-primary  drop-shadow">
            Sign in
          </h2>
          <form className="mt-8" method="POST" onSubmit={onSubmit}>
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
                    disabled={loading} // Disable button while loading
                  >
                    {loading ? "Signing in..." : "Sign in"}{" "}
                    {/* Show loading text */}
                  </button>
                </SignedOut>
                <SignedIn>
                  <LoggedIn />
                  <button
                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80 mt-5"
                    type="submit"
                    disabled={loading} // Disable button while loading
                  >
                    {loading ? "Signing In..." : "Sign In"}{" "}
                    {/* Show loading text */}
                  </button>
                </SignedIn>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}

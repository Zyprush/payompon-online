"use client";

import { auth, db } from "@/firebase";
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
} from "react-firebase-hooks/auth";
import { addDoc, collection } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const router = useRouter();
  const [createUser] = useCreateUserWithEmailAndPassword(auth);
  const [sendEmailVerification] = useSendEmailVerification(auth);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [gender, setGender] = useState("");
  const [sitio, setSitio] = useState("");
  const [civilStatus, setCivilStatus] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateInputs = () => {
    if (!name || !email || !number || !gender || !sitio || !civilStatus || !password || !confirmPassword) {
      toast.error("All fields are required!");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return false;
    }
    if (number.length !== 11 || !/^\d{11}$/.test(number)) {
      toast.error("Contact number must be 11 digits!");
      return false;
    }
    return true;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const userCredential = await createUser(email, password);
      const user = userCredential?.user;

      await sendEmailVerification();

      // Save user data in Firestore
      await addDoc(collection(db, "users"), {
        id: user?.uid,
        email: user?.email,
        name: name,
        number: number,
        gender: gender,
        sitio: sitio,
        civilStatus: civilStatus,
        role: "resident",
      });

      router.push("/user/dashboard");
    } catch (error: any) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="flex h-screen w-screen custom-bg items-start md:items-center justify-center">
        <div className="mx-auto shadow-md p-4 min-w-[22rem] xl:max-w-sm 2xl:max-w-md rounded-xl m-auto bg-white">
          <h2 className="text-center text-xl font-bold leading-tight text-black">
            Create account
          </h2>
          <form className="mt-8" method="POST" onSubmit={onSubmit}>
            <div className="space-y-5">
              <div>
                <div className="mt-2">
                  <input
                    placeholder="Name"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="flex h-10 text-black w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div>
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
                <div className="mt-2">
                  <input
                    placeholder="Contact Number"
                    type="text"
                    onChange={(e) => setNumber(e.target.value)}
                    value={number}
                    className="flex h-10 text-black w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div>
                <div className="mt-2">
                  <select
                    onChange={(e) => setGender(e.target.value)}
                    value={gender}
                    className="flex h-10 text-black w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="mt-2">
                  <input
                    placeholder="Sitio"
                    type="text"
                    onChange={(e) => setSitio(e.target.value)}
                    value={sitio}
                    className="flex h-10 text-black w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div>
                <div className="mt-2">
                  <select
                    onChange={(e) => setCivilStatus(e.target.value)}
                    value={civilStatus}
                    className="flex h-10 text-black w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select Civil Status</option>
                    <option value="single">Single</option>
                    <option value="widow">Widow</option>
                    <option value="married">Married</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="mt-2 relative">
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
              </div>
              <div>
                <div className="mt-2 relative">
                  <input
                    placeholder="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    className="flex h-10 text-black w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  >
                    {showConfirmPassword ? <IconEye /> : <IconEyeOff />}
                  </button>
                </div>
              </div>
              <div>
                <button
                  className="inline-flex w-full items-center text-sm justify-center rounded-md bg-primary px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <IconLoader2 className="animate-spin" />
                  ) : (
                    "Create account"
                  )}
                </button>
              </div>
              <ToastContainer />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

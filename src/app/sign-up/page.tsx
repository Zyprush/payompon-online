"use client";

import { auth, db, storage } from "@/firebase";
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
} from "react-firebase-hooks/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [createUser] = useCreateUserWithEmailAndPassword(auth);
  const [sendEmailVerification] = useSendEmailVerification(auth);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [gender, setGender] = useState("");
  const [sitio, setSitio] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [validID, setValidID] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [validIDType, setValidIDType] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const validateInputs = () => {
    if (
      !firstname ||
      !lastname ||
      !middlename ||
      !address ||
      !email ||
      !number ||
      !gender ||
      !sitio ||
      !civilStatus ||
      !password ||
      !confirmPassword ||
      !validIDType ||
      !validID ||
      !selfie
    ) {
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
      if (!userCredential?.user) {
        throw new Error("User creation failed.");
      }

      const user = userCredential.user;

      const validIDRef = ref(storage, `validIDs/${user.uid}`);
      const selfieRef = ref(storage, `selfies/${user.uid}`);

      if (validID) {
        await uploadBytes(validIDRef, validID);
      }
      if (selfie) {
        await uploadBytes(selfieRef, selfie);
      }

      const validIDURL = await getDownloadURL(validIDRef);
      const selfieURL = await getDownloadURL(selfieRef);
      await sendEmailVerification();

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: firstname + " " + lastname,
        firstname,
        lastname,
        middlename,
        address,
        number,
        gender,
        sitio,
        civilStatus,
        validID: validIDURL,
        selfie: selfieURL,
        role: "resident",
        verified: false,
        submitted: "submitted",
      });

      router.push("/user/dashboard");
    } catch (error: any) {
      console.error("Error details:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="flex h-screen w-screen custom-bg items-start md:items-center justify-center">
        <Link
          href="/sign-in"
          className="absolute top-0 left-0 m-4 btn btn-sm btn-outline font-bold border-2"
        >
          Back
        </Link>
        <div className="mx-auto shadow-md p-4 min-w-[22rem] xl:max-w-sm 2xl:max-w-md rounded-xl m-auto bg-white">
          <h2 className="text-lg font-bold mt-10 md:mt-0 mb-4 text-primary  drop-shadow">
            Create account
          </h2>
          <form className="mt-8" method="POST" onSubmit={onSubmit}>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="mt-2">
                  <input
                    placeholder="First Name"
                    type="text"
                    onChange={(e) => setFirstname(e.target.value)}
                    value={firstname}
                    className="sn-input"
                  />
                </div>
                <div className="mt-2">
                  <input
                    placeholder="Last Name"
                    type="text"
                    onChange={(e) => setLastname(e.target.value)}
                    value={lastname}
                    className="sn-input"
                  />
                </div>
                <div className="mt-2">
                  <input
                    placeholder="Middle Name"
                    type="text"
                    onChange={(e) => setMiddlename(e.target.value)}
                    value={middlename}
                    className="sn-input"
                  />
                </div>
                <div>
                <div className="mt-2">
                  <input
                    placeholder="Sitio"
                    type="text"
                    onChange={(e) => setSitio(e.target.value)}
                    value={sitio}
                    className="sn-input"
                  />
                </div>
              </div>
              </div>
              <div className="mt-2">
                <input
                  placeholder="Address"
                  type="text"
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  className="sn-input"
                />
              </div>

              <div className="flex justify-between gap-2">
                <input
                  placeholder="Email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="sn-input"
                />
                <input
                  placeholder="Contact Number"
                  type="number"
                  onChange={(e) => {
                    setNumber(e.target.value);
                  }}
                  value={number}
                  required
                  pattern="\d{11}" // Optional HTML5 pattern validation
                  maxLength={11} // Limit input length
                  title="Please enter a valid 11-digit number"
                  className="sn-input"
                />
              </div>
              <div className="mt-2 flex gap-2">
                <select
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                  className="sn-input"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <select
                  onChange={(e) => setCivilStatus(e.target.value)}
                  value={civilStatus}
                  className="sn-input"
                >
                  <option value="">Select Civil Status</option>
                  <option value="single">Single</option>
                  <option value="widow">Widow</option>
                  <option value="married">Married</option>
                </select>
              </div>
    
              <div>
                <div className="mt-2"></div>
              </div>

              <div>
                <div className="mt-2 relative">
                  <input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className="sn-input"
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
                    className="sn-input"
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
                <div className="mt-2">
                  <select
                    onChange={(e) => setValidIDType(e.target.value)}
                    value={validIDType}
                    className="sn-input"
                  >
                    <option value="">Select Valid ID</option>
                    <optgroup label="Primary ID">
                      <option value="Philippine Passport">
                        Philippine Passport
                      </option>
                      <option value="Driver’s License">Driver’s License</option>
                      <option value="Unified Multi-Purpose ID (UMID)">
                        Unified Multi-Purpose ID (UMID)
                      </option>
                      <option value="Voter’s ID or Voter’s Certification">
                        Voter’s ID or Voter’s Certification
                      </option>
                      <option value="Postal ID">Postal ID</option>
                      <option value="PhilSys ID (National ID)">
                        PhilSys ID (National ID)
                      </option>
                      <option value="RC License">RC License</option>
                    </optgroup>
                    <optgroup label="Secondary ID">
                      <option value="Barangay ID or Barangay Clearance">
                        Barangay ID or Barangay Clearance
                      </option>
                      <option value="Company ID">Company ID</option>
                      <option value="School ID">School ID</option>
                      <option value="PhilHealth ID">PhilHealth ID</option>
                      <option value="NBI Clearance">NBI Clearance</option>
                      <option value="Police Clearance">Police Clearance</option>
                      <option value="Senior Citizen ID">
                        Senior Citizen ID
                      </option>
                      <option value="PWD ID">PWD ID</option>
                      <option value="TIN ID">TIN ID</option>
                    </optgroup>
                  </select>
                </div>
              </div>
              <div>
                <label
                  htmlFor="validID"
                  className="block text-xs font-medium text-gray-700"
                >
                  Upload Valid ID
                </label>
                <div className="mt-1">
                  <input
                    type="file"
                    id="validID"
                    accept="image/*,.pdf"
                    onChange={(e) => setValidID(e.target.files?.[0] || null)}
                    className="sn-input"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="selfie"
                  className="block text-xs font-medium text-gray-700"
                >
                  Upload Selfie
                </label>
                <div className="mt-1">
                  <input
                    type="file"
                    id="selfie"
                    accept="image/*"
                    onChange={(e) => setSelfie(e.target.files?.[0] || null)}
                    className="sn-input"
                  />
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
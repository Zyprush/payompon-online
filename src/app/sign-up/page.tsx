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
import { currentTime } from "@/helper/time";
import Image from "next/image";

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
  const [birthdate, setBirtdate] = useState("");
  const [number, setNumber] = useState("");
  const [gender, setGender] = useState("");
  const [sitio, setSitio] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [validID, setValidID] = useState<File | null>(null);
  const [validIDBack, setValidIDBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [validIDType, setValidIDType] = useState("");
  const [validIDPreview, setValidIDPreview] = useState<string>("");
  const [validIDBackPreview, setValidIDBackPreview] = useState<string>("");
  const [selfiePreview, setSelfiePreview] = useState<string>("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [step, setStep] = useState(1);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@(gmail\.com|yahoo\.com)$/;
    if (
      !firstname ||
      !lastname ||
      !middlename ||
      !address ||
      !birthdate ||
      !email ||
      !number ||
      !gender ||
      !sitio ||
      !civilStatus ||
      !password ||
      !confirmPassword ||
      !validIDType ||
      !validID ||
      !validIDBack ||
      !selfie
    ) {
      toast.error("All fields are required!");
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error(
        "Please enter a valid email address, gmail.com or yahoo.com."
      );
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

  const handleImagePreview = (
    file: File | null,
    setPreview: (url: string) => void
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview("");
    }
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
      const validIDBackRef = ref(storage, `validIDsBack/${user.uid}`);
      const selfieRef = ref(storage, `selfies/${user.uid}`);

      if (validID) {
        await uploadBytes(validIDRef, validID);
      }
      if (validIDBack) {
        await uploadBytes(validIDBackRef, validIDBack);
      }
      if (selfie) {
        await uploadBytes(selfieRef, selfie);
      }

      const validIDURL = await getDownloadURL(validIDRef);
      const validIDBackURL = await getDownloadURL(validIDBackRef);
      const selfieURL = await getDownloadURL(selfieRef);
      await sendEmailVerification();

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: firstname + " " + lastname,
        firstname,
        lastname,
        middlename,
        address,
        birthdate,
        number,
        gender,
        sitio,
        civilStatus,
        validID: validIDURL,
        validIDType,
        validIDBack: validIDBackURL,
        selfie: selfieURL,
        role: "resident",
        verified: false,
        submitted: true,
        verifiedAt: currentTime,
      });

      router.push("/user/dashboard");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email address is already been used.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address.");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password must be at least 6 characters.");
      } else {
        console.error("Error details:", error);
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="flex h-screen w-screen custom-bg items-start md:items-center justify-center">
        <Link
          href="/sign-in"
          className="absolute top-0 left-0 m-4 btn btn-sm text-white btn-primary font-bold border-2"
        >
          Back
        </Link>
        <div className="mx-auto shadow-md p-4 min-w-[22rem] xl:max-w-sm 2xl:max-w-md rounded-xl m-auto bg-white">
          <h2 className="text-lg font-bold mt-10 md:mt-0 mb-4 text-primary drop-shadow">
            Create account - Step {step} of 2
          </h2>
          {step === 1 ? (
            <form
              className="mt-8"
              onSubmit={(e) => {
                e.preventDefault();
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
                  !confirmPassword
                ) {
                  toast.error("Please fill in all fields!");
                  return;
                }
                const emailRegex = /^[^\s@]+@(gmail\.com|yahoo\.com)$/;
                if (!emailRegex.test(email)) {
                  toast.error(
                    "Please enter a valid email address, gmail.com or yahoo.com."
                  );
                  return;
                }
                if (password !== confirmPassword) {
                  toast.error("Passwords do not match!");
                  return;
                }
                if (number.length !== 11 || !/^\d{11}$/.test(number)) {
                  toast.error("Contact number must be 11 digits!");
                  return;
                }
                setStep(2);
              }}
            >
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

                <div className="mt-2">
                  <label className="text-sm text-primary">
                    Birthday
                  </label>
                  <input
                    placeholder="Birthdate"
                    type="date"
                    onChange={(e) => setBirtdate(e.target.value)}
                    value={birthdate}
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
                    onChange={(e) => setNumber(e.target.value)}
                    value={number}
                    required
                    pattern="\d{11}"
                    maxLength={11}
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
                  <button
                    className="inline-flex w-full items-center text-sm justify-center rounded-md bg-primary px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                    type="submit"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form className="mt-8" method="POST" onSubmit={onSubmit}>
              <div className="space-y-5">
                <Image
                  src={"/img/id.png"}
                  alt="Selfie"
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover"
                />
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
                        <option value="Driver's License">
                          Driver&apos;s License
                        </option>
                        <option value="Unified Multi-Purpose ID (UMID)">
                          Unified Multi-Purpose ID (UMID)
                        </option>
                        <option value="Voter's ID or Voter's Certification">
                          Voter&apos;s ID or Voter&apos;s Certification
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
                        <option value="Police Clearance">
                          Police Clearance
                        </option>
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
                    Upload Front of Valid ID
                  </label>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="validID"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        {validIDPreview ? (
                          <div className="w-full h-full flex items-center justify-center relative group">
                            <img
                              src={validIDPreview}
                              alt="Valid ID Preview"
                              className="max-h-36 max-w-full object-contain"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <p className="text-white text-sm">
                                Click to change
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 mb-4 text-gray-500"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG or PDF
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          id="validID"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setValidID(file);
                            handleImagePreview(file, setValidIDPreview);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="validIDBack"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Upload Back of Valid ID
                  </label>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="validIDBack"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        {validIDBackPreview ? (
                          <div className="w-full h-full flex items-center justify-center relative group">
                            <img
                              src={validIDBackPreview}
                              alt="Valid ID Back Preview"
                              className="max-h-36 max-w-full object-contain"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <p className="text-white text-sm">
                                Click to change
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 mb-4 text-gray-500"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG or PDF
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          id="validIDBack"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setValidIDBack(file);
                            handleImagePreview(file, setValidIDBackPreview);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="selfie"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Upload Selfie
                  </label>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="selfie"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        {selfiePreview ? (
                          <div className="w-full h-full flex items-center justify-center relative group">
                            <img
                              src={selfiePreview}
                              alt="Selfie Preview"
                              className="max-h-36 max-w-full object-contain"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <p className="text-white text-sm">
                                Click to change
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 mb-4 text-gray-500"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">PNG or JPG</p>
                          </div>
                        )}
                        <input
                          type="file"
                          id="selfie"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setSelfie(file);
                            handleImagePreview(file, setSelfiePreview);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex w-full items-center text-sm justify-center rounded-md bg-gray-200 px-3.5 py-2.5 font-semibold leading-7 text-gray-900 hover:bg-gray-300"
                  >
                    Back
                  </button>
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
              </div>
            </form>
          )}
          <ToastContainer />
        </div>
      </div>
    </section>
  );
}

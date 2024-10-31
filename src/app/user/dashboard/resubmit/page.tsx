"use client";

import { auth, db, storage } from "@/firebase";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconLoader2 } from "@tabler/icons-react";
import UserNavLayout from "@/components/UserNavLayout";

export default function EditProfile() {
  const [user, loadingAuth] = useAuthState(auth);
  const router = useRouter();

  // State for user details
  const [loading, setLoading] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [gender, setGender] = useState("");
  const [sitio, setSitio] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [validIDType, setValidIDType] = useState("");
  const [validID, setValidID] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  const [existingValidIDURL, setExistingValidIDURL] = useState("");
  const [existingSelfieURL, setExistingSelfieURL] = useState("");

  // Fetch user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFirstname(data.firstname || "");
          setLastname(data.lastname || "");
          setMiddlename(data.middlename || "");
          setAddress(data.address || "");
          setNumber(data.number || "");
          setGender(data.gender || "");
          setSitio(data.sitio || "");
          setCivilStatus(data.civilStatus || "");
          setValidIDType(data.validIDType || "");
          setExistingValidIDURL(data.validID || "");
          setExistingSelfieURL(data.selfie || "");
        } else {
          toast.error("User data not found.");
        }
      }
    };

    fetchUserInfo();
  }, [user]);

  const validateInputs = () => {
    const missingFields: string[] = [];
    if (!firstname) missingFields.push("Firstname");
    if (!lastname) missingFields.push("Lastname");
    if (!middlename) missingFields.push("Middlename");
    if (!address) missingFields.push("Address");
    if (!number) missingFields.push("Contact number");
    if (!gender) missingFields.push("Gender");
    if (!sitio) missingFields.push("Sitio");
    if (!civilStatus) missingFields.push("Civil status");
    if (!validIDType) missingFields.push("Valid ID type");

    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields);
      toast.error(
        `The following fields are required: ${missingFields.join(", ")}.`
      );
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
      if (!user?.uid) {
        toast.error("User ID is not available.");
        return; // Exit if user ID is not available
      }
      const userDocRef = doc(db, "users", user.uid); // Ensure user.uid is defined
      const updatedData: any = {
        firstname,
        lastname,
        middlename,
        name: firstname + " " + lastname,
        address,
        number,
        gender,
        sitio,
        civilStatus,
        validIDType,
        submitted: true,
      };

      // If the user uploads new valid ID or selfie, update in storage
      if (validID) {
        const validIDRef = ref(storage, `validIDs/${user?.uid}`);
        await uploadBytes(validIDRef, validID);
        updatedData.validID = await getDownloadURL(validIDRef);
      }

      if (selfie) {
        const selfieRef = ref(storage, `selfies/${user?.uid}`);
        await uploadBytes(selfieRef, selfie);
        updatedData.selfie = await getDownloadURL(selfieRef);
      }

      await updateDoc(userDocRef, updatedData);
      toast.success("Profile updated successfully!");
      router.push("/user/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingAuth) return <div>Loading...</div>;

  return (
    <UserNavLayout>
      <section>
        <div className="flex h-screen w-screen custom-bg items-start md:items-center justify-center">
          <Link
            href="/user/dashboard"
            className="absolute top-0 left-0 m-4 btn btn-sm btn-outline font-bold border-2"
          >
            Back
          </Link>
          <div className="mx-auto shadow-md p-4 min-w-[22rem] xl:max-w-sm 2xl:max-w-md rounded-xl m-auto bg-white">
            <h2 className="text-lg font-bold mt-10 md:mt-0 mb-4 text-primary  drop-shadow">
              Edit Profile
            </h2>
            <form className="mt-8" method="POST" onSubmit={onSubmit}>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="First Name"
                    type="text"
                    onChange={(e) => setFirstname(e.target.value)}
                    value={firstname}
                    className="sn-input"
                  />
                  <input
                    placeholder="Last Name"
                    type="text"
                    onChange={(e) => setLastname(e.target.value)}
                    value={lastname}
                    className="sn-input"
                  />
                  <input
                    placeholder="Middle Name"
                    type="text"
                    onChange={(e) => setMiddlename(e.target.value)}
                    value={middlename}
                    className="sn-input"
                  />
                  <input
                    placeholder="Sitio"
                    type="text"
                    onChange={(e) => setSitio(e.target.value)}
                    value={sitio}
                    className="sn-input"
                  />
                </div>
                <input
                  placeholder="Address"
                  type="text"
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  className="sn-input"
                />
                <div className="flex justify-between gap-2">
                  <input
                    placeholder="Contact Number"
                    type="number"
                    onChange={(e) => setNumber(e.target.value)}
                    value={number}
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
                    <option value="Senior Citizen ID">Senior Citizen ID</option>
                    <option value="PWD ID">PWD ID</option>
                    <option value="TIN ID">TIN ID</option>
                  </optgroup>
                </select>

                <div>
                  <label htmlFor="validID">
                    Upload New Valid ID (Optional)
                  </label>
                  <input
                    type="file"
                    id="validID"
                    accept="image/*,.pdf"
                    onChange={(e) => setValidID(e.target.files?.[0] || null)}
                    className="sn-input"
                  />
                  {existingValidIDURL && (
                    <p className="text-xs mt-2">
                      Current Valid ID:{" "}
                      <a
                        href={existingValidIDURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Current ID
                      </a>
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="selfie">Upload New Selfie (Optional)</label>
                  <input
                    type="file"
                    id="selfie"
                    accept="image/*"
                    onChange={(e) => setSelfie(e.target.files?.[0] || null)}
                    className="sn-input"
                  />
                  {existingSelfieURL && (
                    <p className="text-xs mt-2">
                      Current Selfie:{" "}
                      <a
                        href={existingSelfieURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Current Selfie
                      </a>
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-outline w-full border-2 mt-8"
                >
                  {loading ? <IconLoader2 className="animate-spin" /> : "Save"}
                </button>
                <ToastContainer />
              </div>
            </form>
          </div>
        </div>
      </section>
    </UserNavLayout>
  );
}

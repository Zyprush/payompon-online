"use client";
import UserNavLayout from "@/components/UserNavLayout";
import React, { useState, useEffect } from "react";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import GetImage from "@/components/GetImage";

const About: React.FC = (): JSX.Element => {
  const [barangayInfo, setBarangayInfo] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true); // Start loading
      const docRef = doc(db, "settings", "barangayInfo");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setBarangayInfo(data.barangayInfo || "");
        setAddress(data.address || "");
        setContact(data.contact || "");
        setEmail(data.email || "");
      }

      setLoading(false); // Stop loading
    };

    fetchSettings();
  }, []);

  return (
    <UserNavLayout>
      <div className="bg-white rounded-xl border p-10 md:m-10 shadow-sm">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="flex flex-col">
            <div className="flex gap-4 h-20 mb-4">
              <div className="width-20">
                <GetImage storageLink="settings/municipalLogo" />
              </div>

              <div className="width-20">
                <GetImage storageLink="settings/brgyLogo" />
              </div>
            </div>

            <h2 className="text-lg font-semibold drop-shadow text-primary mb-4">
              About Barangay
            </h2>
            <span className="mb-4">
              <p className="text-sm text-zinc-500">{barangayInfo}</p>
            </span>
            <div className="mb-4 mt-5">
              <span className="text-gray-700 text-sm font-semibold">
                Address:
              </span>
              <p className="text-sm text-zinc-500">{address}</p>
            </div>
            <div className="mb-4">
              <span className="text-gray-700 text-sm font-semibold">
                Contact:
              </span>
              <p className="text-sm text-zinc-500">{contact}</p>
            </div>
            <div className="mb-4">
              <span className="text-gray-700 text-sm font-semibold">
                Email:
              </span>
              <p className="text-sm text-zinc-500">{email}</p>
            </div>
          </div>
        )}
      </div>
    </UserNavLayout>
  );
};

export default About;

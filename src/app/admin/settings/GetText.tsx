"use client";
import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface GetTextProps {
  name: string;
  title: string;
}

const GetText: React.FC<GetTextProps> = ({ name,title }): JSX.Element => {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch setting value by name from Firestore on component mount
  useEffect(() => {
    const fetchSetting = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "settings", name);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setValue(docSnap.data().value); // Assuming 'value' is the key for the data in the document
        } else {
          setValue(null); // No data found for this name
        }
      } catch (error) {
        console.error("Error fetching setting:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSetting();
  }, [name]);

  return (
    <span className="">
      {loading ? (
        <>Loading...</>
      ) : (
        <>{value ? <>{value}</> : <>{title}</>}</>
      )}
    </span>
  );
};

export default GetText;
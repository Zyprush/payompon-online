import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { db } from "@/firebase";
import { useRequestStore } from "@/state/request";
import { doc, getDoc } from "firebase/firestore";
import { format } from "date-fns";

const QrCode = () => {
  // Get the current URL or define any URL you want to encode in the QR code
  const qrValue = window.location.href; // or any other URL/string you want to encode
  const [request, setRequest] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { id } = useRequestStore();

  useEffect(() => {
    const fetchRequest = async () => {
      if (typeof id === "string") {
        try {
          const requestDoc = doc(db, "requests", id);
          const requestSnapshot = await getDoc(requestDoc);
          if (requestSnapshot.exists()) {
            setRequest(requestSnapshot.data());
          } else {
            console.log("Request not found.");
          }
        } catch (error) {
          console.error("Error fetching request:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRequest();
  }, [id, setRequest]);

  return (
    <span className="flex flex-col mt-auto mb-0 text-sm text-green-800 font-serif italic">
      {/* Display the QR code here */}
      <QRCode value={qrValue} size={100} />
      <p className="mt-2">Not Valid Without Official Seal</p>
      <p>Paid Under O.R: {request?.orNo}</p>
      <p>Res. Cert. No: {request?.certNo}</p>
      <p>Issued on: {request?.issueOn} </p>
      <p>Issued at: Barangay Payompon Mamburao, Occ. Mindoro</p>
    </span>
  );
};

export default QrCode;

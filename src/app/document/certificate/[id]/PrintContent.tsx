import React, { useState, useEffect, forwardRef, Ref } from "react";
import Header from "./Header";
import { formatIssueDate } from "@/helper/time";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRequestStore } from "@/state/request";
import UnknownDoc from "@/components/UnknownDoc";
import { getCaptain } from "@/helper/getOfficials";
import GetImage from "@/components/GetImage";
import useGetFinger from "@/hooks/useGetFinger";
import GetText from "@/app/admin/settings/GetText";
import CertificateQrCode from "./CertificateQrCode";

type PrintContentProps = {
  zoomLevel: number;
};

const PrintContent = forwardRef<HTMLDivElement, PrintContentProps>(
  ({ zoomLevel }, ref) => {
    const [request, setRequest] = useState<any>();
    const [captain, setCaptain] = useState<string>();
    const [loading, setLoading] = useState(false);
    const { leftThumb, rightThumb } = useGetFinger({
      uid: request?.submittedBy,
    });
    const { id } = useRequestStore();

    useEffect(() => {
      const fetchRequest = async () => {
        setLoading(true);
        const cap = await getCaptain();
        setCaptain(cap);
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

    if (!loading && !request) {
      return <UnknownDoc />;
    }

    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        id="document"
        className="relative w-[8.27in] h-[11.69in] border border-gray-300 p-4"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "top left",
          overflow: "auto", // Ensure scrollbars appear if content overflows
        }}
      >
        <div className="flex flex-col w-full h-full">
          {/* Header*/}
          <Header />
          <div className="flex flex-row p-5  w-full h-full mt-2">
            <div className="flex flex-col w-full courier-prime">
              {/* certification */}
              <div className="flex flex-col p-3">
                <span className="capitalize text-blue-700 text-justify text-[3rem] mx-auto italic font-serif font-semibold">
                  {request?.requestType}
                </span>
                <span className="text-gray-700 text-justify text-lg font-bold mt-10">
                  TO WHOM IT MAY CONCERN:
                </span>
                <span className="indent-8 text-gray-600 text-justify mt-8">
                  This is to certify that MR./MS.{" "}
                  <b className="text-green-800">{request?.submittedName}</b> is
                  a bonafide resident of Purok/Sitio {request?.sitio}, Brgy.
                  Payompon, Mamburao, Occidental Mindoro.
                </span>
              </div>

              <div className="flex flex-col p-3 mt-4">
                <span className="text-gray-600 text-justify indent-8">
                  This cetification is being issued upon the request  of the above-mention name for {request?.purpose}. <b>PURPUSE ONLY</b>
                </span>
              </div>

              
              <div className="flex flex-col p-3 mt-4">
                <span className="text-gray-600 text-justify indent-8">
                  Issued this {formatIssueDate(request?.issueOn)} at Barangay
                  Payompon, Mamburao, Occidental Mindoro
                </span>
              </div>

              <div className="flex justify-between items-center p-3">
                <div className="flex flex-row gap-2 mt-28"></div>
                <div className="text-right">
                  <div className="w-44 -mb-10">
                    <GetImage storageLink="settings/captainSign" />
                  </div>
                  <p className="text-blue-700 text-xl uppercase">{captain}</p>
                  <hr className="border border-zinc-500" />
                  <p className="text-green-800 text-base text-center font-bold">
                    Punong Barangay
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-24 left-5">
              <CertificateQrCode/>
            </div>
          </div>
          <span className=" courier-prime text-green-800 font-bold mx-16 text-center">
            Address: National Road Barangay Payompon Mamburao, Occidental
            Mindoro, Philippines 5106
          </span>
          <span className=" courier-prime text-green-800 font-bold mx-16 text-center">
            Cellphone Number: <GetText name="contact" title="contact" />
          </span>
        </div>
      </div>
    );
  }
);

PrintContent.displayName = "PrintContent";

export default PrintContent;

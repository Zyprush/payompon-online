import React, { useState, useEffect, forwardRef, Ref, use } from "react";
import Header from "./Header";
import { formatIssueDate } from "@/helper/time";
import SideContent from "./SideContent";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRequestStore } from "@/state/request";
import UnknownDoc from "@/components/UnknownDoc";
import { getCaptain } from "@/helper/getOfficials";
import GetImage from "@/components/GetImage";
import useGetFinger from "@/hooks/useGetFinger";

type PrintContentProps = {
  zoomLevel: number;
};

const PrintContent = forwardRef<HTMLDivElement, PrintContentProps>(
  ({ zoomLevel }, ref) => {
    const [request, setRequest] = useState<any>();
    const [captain, setCaptain] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [purposes, setPurposes] = useState<string[]>([]);

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

    useEffect(() => {
      const fetchPurposes = async () => {
        const purposesDoc = await getDoc(doc(db, "settings", "purposes"));
        if (purposesDoc.exists()) {
          setPurposes(purposesDoc.data().purposes || []); // Assuming the data is an array of purpose strings
        } else {
          console.log("No such document!");
        }
      };
      fetchPurposes();
    }, []);

    if (!loading && !request) {
      return <UnknownDoc />;
    }

    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        id="document"
        className="relative w-[8.5in] h-[13in] border border-gray-300 p-3 overflow-hidden"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "top left",
          overflow: "auto", // Ensure scrollbars appear if content overflows
        }}
      >
        <div className="flex flex-col w-full h-full text-sm gap-3">
          {/* Header*/}
          <Header />
          <div className="flex flex-row border-4 border-green-700 w-full h-full">
            {/* SideComponent */}
            <div className="absolute w-[90%] ml-[3%] mt-[10%] opacity-15 -z-50">
              <GetImage storageLink="settings/brgyLogo" />
            </div>
            <SideContent />
            <div className="flex flex-col w-2/3 courier-prime">
              <div className="flex flex-col p-3 text-sm">
                <span className="text-green-800 text-justify text-[3.5rem] mx-auto italic font-bold underline bernard-mt mt-5">
                  Certification
                </span>
                <span className="text-gray-700 text-justify text-lg font-bold mt-10">
                  TO WHOM IT MAY CONCERN:
                </span>
                <span className="text-gray-600 text-justify mt-6">
                  This is to certify that MR./MS.{" "}
                  <b className="text-green-800 text-sm">
                    {request?.submittedName}
                  </b>{" "}
                  is a bonafide resident of Purok/Sitio {request?.sitio}, Brgy.
                  Payompon, Mamburao, Occidental Mindoro is known to me of good
                  moral character and has no derogatory records on file in this
                  office. It appeared in this document his/her thumb mark,
                  residence certificate and signature as proofs of his/her
                  identity.
                </span>
                <span className="text-green-800 text-justify text-lg font-bold mt-5">
                  AS PER REQUIREMENT AND/OR TO SUPPORT HIS/HER
                </span>
                <span className="text-gray-600 grid grid-cols-2 text-justify font-bold uppercase">
                  {purposes.map((pur, index) => (
                    <div
                      key={index}
                      className={`text-left text-sm font-normal capitalize  ${
                        pur == request.purpose ? "bg-yellow-300 font-bold" : ""
                      }`}
                    >
                      (){pur}
                    </div>
                  ))}
                  {request?.otherPurpose && (
                    <span className="bg-yellow-300 text-left text-sm font-normal">
                      ()OTHER:<p className="underline capitalize">{request.purpose}</p>
                    </span>
                  )}
                </span>
              </div>

              <div className="flex flex-col p-3 text-sm mt-10">
                <span className="text-gray-600 text-justify indent-8">
                  <b>IN WITNESS WHEREOF</b> I have hereunto set my hand and
                  affixed the Official seal of this office. Done at
                  <b className="text-green-800 ml-2">
                    Barangay Payompon, Mamburao, Occidental Mindoro
                  </b>
                  , Issued {formatIssueDate(request?.issueOn)}.
                </span>
              </div>

              <div className="flex flex-col p-3 mt-5 justify-center items-center ml-0 mr-auto">
                {request?.affiant}
                <hr className="border border-zinc-500 w-full" />
                <p className="text-green-800 font-semibold">Affiant</p>
              </div>

              {/* Thumb */}
              <div className="flex justify-between items-center p-3 mt-8">
                <div className="flex flex-row gap-2">
                  <div className="flex justify-center flex-col">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={leftThumb || ""}
                      alt="left thumb"
                      className="border-2 border-green-700 w-24 h-24 hover:bg-green-100 flex items-center justify-center object-cover"
                    />
                    <span className="text-blue-700 text-center text-[0.6rem] font-serif italic">
                      Left Thumb Mark
                    </span>
                  </div>
                  <div className="flex justify-center flex-col">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rightThumb || ""}
                      alt="right thumb"
                      className="border-2 border-green-700 w-24 h-24 hover:bg-green-100 flex items-center justify-center object-cover"
                    />
                    <span className="text-blue-700 text-center text-[0.6rem] font-serif italic">
                      Right Thumb Mark
                    </span>
                  </div>
                </div>
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
              <span className="flex text-center text-green-700 italic text-sm mx-auto">
                <span className="text-blue-700 text-md">*</span>
                <span className="text-red-700 text-md">*</span>
                <span className="text-yellow-700 text-md">*</span>
                Note: Valid for six (6) months uppon issued
                <span className="text-blue-700 text-md">*</span>
                <span className="text-red-700 text-md">*</span>
                <span className="text-yellow-700 text-md">*</span>
              </span>
            </div>
          </div>
          <span className=" courier-prime text-green-800 font-bold mx-16 text-center">
            Address: National Road Barangay Payompon Mamburao, Occidental
            Mindoro, Philippines 5106
          </span>
        </div>
      </div>
    );
  }
);

PrintContent.displayName = "PrintContent";

export default PrintContent;

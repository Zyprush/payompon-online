import React, { useState, useEffect, forwardRef, Ref } from "react";
import Header from "./Header";
import { formatIssueDate } from "@/helper/time";
import { request } from "http";
import SideContent from "./SideContent";
import { db } from "@/firebase";
import { id } from "date-fns/locale";
import { doc, getDoc } from "firebase/firestore";
import { useRequestStore } from "@/state/request";

type PrintContentProps = {
  zoomLevel: number;
};

const PrintContent = forwardRef<HTMLDivElement, PrintContentProps>(
  ({ zoomLevel }, ref) => {
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
      <div
        ref={ref as Ref<HTMLDivElement>}
        className="relative w-[8.5in] h-[13in] border border-gray-300 p-4"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "top left",
          overflow: "auto", // Ensure scrollbars appear if content overflows
        }}
      >
        <div className="flex flex-col w-full h-full">
          {/* Header*/}
          <Header />
          <div className="flex flex-row border-4 border-green-700 w-full h-full mt-2">
            {/* SideComponent */}
            <SideContent />
            <div className="flex flex-col w-2/3 courier-prime">
              {/* certification */}
              <div className="flex flex-col p-3">
                <span className="text-green-800 text-justify text-[3.5rem] mx-auto italic font-bold underline bernard-mt">
                  Certificate
                </span>
                <span className="text-gray-700 text-justify text-lg font-bold mt-10">
                  TO WHOM IT MAY CONCERN:
                </span>
                <span className="text-gray-600 text-justify mt-8">
                  This is to certify that MR./MS.{" "}
                  <b className="text-green-800">{request?.submittedName}</b> is a
                  bonafide resident of Purok/Sitio {request?.sitio}, Brgy.
                  Payompon, Mamburao, Occidental Mindoro is known to me of good
                  moral character and has no derogatory records on file in this
                  office. It appeared in this document his/her thumb mark,
                  residence certificate and signature as proofs of his/her
                  identity.
                </span>
                <span className="text-green-800 text-justify text-lg font-bold mt-10">
                  AS PER REQUIREMENT AND/OR TO SUPPORT HIS/HER
                </span>
                <span className="text-gray-600 text-justify font-bold">
                  {request?.certType}
                </span>
              </div>

              <div className="flex flex-col p-3 mt-5">
                <span className="text-gray-600 text-justify">
                  <b>IN WITNESS WHEREOF</b> I have hereunto set my hand and
                  affixed the Official seal of this office. Done at
                  <b className="text-green-800">
                    Barangay Payompon, Mamburao, Occidental Mindoro
                  </b>
                  , Issued {formatIssueDate(request?.issueOn)}.
                </span>
              </div>

              {/* Thumb */}
              <div className="flex justify-between items-center p-3">
                <div className="flex flex-row gap-2 mt-28">
                  <div className="flex justify-center flex-col">
                    <div className="border-2 border-green-700 w-24 h-24 hover:bg-green-100 flex items-center justify-center"></div>
                    <span className="text-blue-700 text-center text-[0.6rem] font-serif italic">
                      Left Thumb Mark
                    </span>
                  </div>
                  <div className="flex justify-center flex-col">
                    <div className="border-2 border-green-700 w-24 h-24 hover:bg-green-100 flex items-center justify-center"></div>
                    <span className="text-blue-700 text-center text-[0.6rem] font-serif italic">
                      Right Thumb Mark
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-700 text-xl">LEONARD M. ALMERO</p>
                  <hr />
                  <p className="text-green-800 text-base text-center font-bold">
                    Punong Barangay
                  </p>
                </div>
              </div>
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

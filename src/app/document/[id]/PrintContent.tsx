import React, { useState, useEffect, forwardRef, Ref } from "react";
import Header from "./Header";
import { getOfficials } from "@/helper/getOfficials";
import QrCode from "./QrCode";

type PrintContentProps = {
  zoomLevel: number;
};

const PrintContent = forwardRef<HTMLDivElement, PrintContentProps>(
  ({ zoomLevel }, ref) => {
    const [officials, setOfficials] = useState({
      punongBarangay: "",
      treasurer: "",
      secretary: "",
      skChairman: "",
      kagawad: [] as string[], // Ensure kagawad is typed as an array of strings
    });

    useEffect(() => {
      const fetchData = async () => {
        try {
          const fetchedOfficials = await getOfficials();
          setOfficials({
            punongBarangay: fetchedOfficials.punongBarangay ?? "",
            treasurer: fetchedOfficials.treasurer ?? "",
            secretary: fetchedOfficials.secretary ?? "",
            skChairman: fetchedOfficials.skChairman ?? "",
            kagawad: fetchedOfficials.kagawad || [],
          });
        } catch (error) {
          console.error("Error fetching officials:", error);
        }
      };

      fetchData();
    }, []);

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
            <div className="flex flex-col w-1/3 border-r-4 border-green-700 p-3">
              <h1 className="text-[2.25rem] italic font-serif text-center text-green-800 font-semibold">
                Barangay Officials
              </h1>
              <div className="mt-4 text-lg flex justify-center flex-col">
                <span className="text-center mt-7">
                  <p className="text-xl font-bold uppercase text-green-800 font-sans">
                    HON. {officials.punongBarangay}
                  </p>
                  <p className="font-serif font-semibold text-blue-700">
                    Punong Barangay
                  </p>
                </span>

                <span className="text-center mt-7">
                  <p className="font-serif font-semibold text-blue-700">
                    Barangay Kagawad
                  </p>
                  {officials.kagawad.map((name, index) => (
                    <p
                      key={index}
                      className="text-xl font-bold uppercase text-green-800 font-sans"
                    >
                      HON. {name}
                    </p>
                  ))}
                </span>
              </div>
              <span className="text-center mt-7">
                <p className="text-xl font-bold uppercase text-green-800 font-sans">
                  HON. {officials.skChairman}
                </p>
                <p className="font-serif font-semibold text-blue-700">
                  Sk Chairman
                </p>
              </span>
              <span className="text-center mt-7">
                <p className="text-xl font-bold uppercase text-green-800 font-sans">
                  {officials.treasurer}
                </p>
                <p className="font-serif font-semibold text-blue-700">
                  Barangay Secretary
                </p>
              </span>
              <span className="text-center mt-7">
                <p className="text-xl font-bold uppercase text-green-800 font-sans">
                  {officials.secretary}
                </p>
                <p className="font-serif font-semibold text-blue-700">
                  Barangay Treasurer
                </p>
              </span>
              <QrCode />
            </div>
            <div className="flex flex-col w-2/3">
              {/* Additional content can be added here */}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PrintContent.displayName = "PrintContent";

export default PrintContent;

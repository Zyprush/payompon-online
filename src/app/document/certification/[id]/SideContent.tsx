import { getOfficials } from "@/helper/getOfficials";
import React, { useEffect, useState } from "react";
import QrCode from "./QrCode";

const SideContent = () => {
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
    <div className="flex flex-col w-1/3 border-r-4 border-green-700 p-3 z-20">
      <h1 className="text-[2.25rem] italic bernard-mt text-center text-green-800 leading-none font-semibold">
        Barangay Officials
      </h1>
      <div className="mt-4 text-lg flex justify-center flex-col">
        <span className="text-center mt-7">
          <p className="text-lg font-bold uppercase text-green-800 bernard-mt">
            HON. {officials.punongBarangay}
          </p>
          <p className="bernard-mt font-semibold text-blue-700">
            Punong Barangay
          </p>
        </span>

        <span className="text-center mt-7">
          <p className="bernard-mt font-semibold text-blue-700">
            Barangay Kagawad
          </p>
          {officials.kagawad.map((name, index) => (
            <p
              key={index}
              className="text-lg font-bold uppercase text-green-800 bernard-mt"
            >
              HON. {name}
            </p>
          ))}
        </span>
      </div>
      <span className="text-center mt-7">
        <p className="text-lg font-bold uppercase text-green-800 bernard-mt">
          HON. {officials.skChairman}
        </p>
        <p className="bernard-mt font-semibold text-blue-700">Sk Chairman</p>
      </span>
      <span className="text-center mt-7">
        <p className="text-lg font-bold uppercase text-green-800 bernard-mt">
          {officials.secretary}
        </p>
        <p className="bernard-mt font-semibold text-blue-700">
          Barangay Secretary
        </p>
      </span>
      <span className="text-center mt-7">
        <p className="text-lg font-bold uppercase text-green-800 bernard-mt">
          {officials.treasurer}
        </p>
        <p className="bernard-mt font-semibold text-blue-700">
          Barangay Treasurer
        </p>
      </span>
      <QrCode />
    </div>
  );
};

export default SideContent;

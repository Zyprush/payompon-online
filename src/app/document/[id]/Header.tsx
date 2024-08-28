import GetImage from "@/components/GetImage";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="flex items-center justify-evenly w-full">
      <div className="custom-shadow rounded-full ml-10 w-[100px]">
        <GetImage storageLink="settings/municipalLogo" />
      </div>
      <div className="mx-auto text-center leading-tight">
        <h1 className=" font-bold courier-prime">
          Republic of the Philippines
        </h1>
        <h2 className=" font-semibold courier-prime">
          PROVINCE OF OCCIDENTAL MINDORO
        </h2>
        <h3 className=" font-medium courier-prime">Municipality of Mamburao</h3>
        <h4 className=" font-bold text-red-600 courier-prime">
          BARANGAY PAYOMPON
        </h4>
        <h5 className=" text-xl italic font-serif font-bold text-green-800">
          Office of the Punong Barangay
        </h5>
      </div>
      <div className="custom-shadow rounded-full mr-10 w-[100px]">
        <GetImage storageLink="settings/brgyLogo" />
      </div>
    </div>
  );
};

export default Header;

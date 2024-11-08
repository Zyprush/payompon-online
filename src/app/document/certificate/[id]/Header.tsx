import GetText from "@/app/admin/settings/GetText";
import GetImage from "@/components/GetImage";
import React from "react";

const Header = () => {
  return (
    <div className="flex items-center justify-evenly w-full">
      <div className="rounded-full overflow-hidden ml-10 w-[100px]">
        <GetImage storageLink="settings/municipalLogo" />
      </div>
      <div className="mx-auto text-center leading-tight">
        <h1 className=" font-bold courier-prime">
          Republic of the Philippines
        </h1>
        <h2 className=" font-semibold courier-prime uppercase">
          PROVINCE OF <GetText name="province" title="province"/>
        </h2>
        <h3 className=" font-medium courier-prime capitalize">Municipality of <GetText name="municipality" title="municipality"/></h3>
        <h4 className=" font-bold text-red-600 courier-prime uppercase">
          BARANGAY <GetText name="name" title="name"/>
        </h4>
        <h5 className=" text-xl italic font-serif font-bold text-green-800">
          Office of the Punong Barangay
        </h5>
      </div>
      <div className="overflow-hidden rounded-full mr-10 w-[100px]">
        <GetImage storageLink="settings/brgyLogo" />
      </div>
    </div>
  );
};

export default Header;

"use client";
import NavLayout from "@/components/NavLayout";
import React from "react";
import InfoSetting from "./InfoSettings";
import ImgSetting from "./ImgSetting";
import Services from "./Services";

const Setting = () => {
  return (
    <NavLayout>
      <div className="flex justify-center flex-col gap-5">
        <div className="flex flex-wrap mx-auto gap-8 mb-8">
          <ImgSetting fileName="brgyLogo" name="Barangay Logo" />
          <ImgSetting fileName="municipalLogo" name="Municipal Logo" />
          <ImgSetting fileName="gcashQR" name="Gcash QR" />
          <ImgSetting fileName="captainSign" name="Brgy Captain Signature" />
        </div>
        <Services/>
        <InfoSetting />
      </div>
    </NavLayout>
  );
};

export default Setting;

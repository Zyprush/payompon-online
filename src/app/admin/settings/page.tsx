"use client";
import NavLayout from "@/components/NavLayout";
import React from "react";
import InfoSetting from "./InfoSettings";
import ImgSetting from "./ImgSetting";

const Setting = () => {
  return (
    <NavLayout>
      <InfoSetting />
      <ImgSetting fileName="brgyLogo" name="Barangay Logo"/>
    </NavLayout>
  );
};

export default Setting;

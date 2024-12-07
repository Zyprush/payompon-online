"use client";
import NavLayout from "@/components/NavLayout";
import React, { useState } from "react";
import InfoSetting from "./InfoSettings";
import ImgSetting from "./ImgSetting";
import Services from "./Services";
import Purposes from "./Purposes";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";

const Setting = () => {
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);

  return (
    <NavLayout>
      <div className="flex justify-center flex-col gap-5">
        <div className="flex flex-wrap mx-auto gap-8 mb-8">
          <ImgSetting fileName="brgyLogo" name="Barangay Logo" />
          <ImgSetting fileName="municipalLogo" name="Municipal Logo" />
          <ImgSetting fileName="gcashQR" name="Gcash QR" />
          <ImgSetting fileName="captainSign" name="Brgy Captain Signature" />
        </div>
        <Services />
        <Purposes />
        <InfoSetting />

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-3  items-start content-start">
            <button
              className="btn btn-primary m-auto mt-0 rounded-none"
              onClick={() => setShowChangeEmail(!showChangeEmail)}
            >
              {showChangeEmail ? "Hide" : "Show"} Change Email
            </button>
            {showChangeEmail && <ChangeEmail />}
          </div>

          <div className="flex flex-col gap-3  items-start content-start">
            <button
              className="btn btn-primary m-auto mt-0 rounded-none"
              onClick={() => setShowChangePass(!showChangePass)}
            >
              {showChangePass ? "Hide" : "Show"} Change Password
            </button>
            {showChangePass && <ChangePassword />}
          </div>
        </div>

      </div>
    </NavLayout>
  );
};

export default Setting;

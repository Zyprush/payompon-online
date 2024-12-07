"use client";
import UserNavLayout from "@/components/UserNavLayout";
import React, { useState, useEffect } from "react";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import GetImage from "@/components/GetImage";
import GetText from "@/app/admin/settings/GetText";

const About: React.FC = (): JSX.Element => {
  

  return (
    <UserNavLayout>
      <div className="bg-white rounded-xl border p-10 md:m-10 shadow-sm">
   
          <div className="flex flex-col">
            <div className="flex gap-4 h-20 mb-4">
              <div className="width-20">
                <GetImage storageLink="settings/municipalLogo" />
              </div>

              <div className="width-20">
                <GetImage storageLink="settings/brgyLogo" />
              </div>
            </div>

            <h2 className="text-lg font-semibold drop-shadow text-primary mb-4">
              About Barangay
            </h2>
            <span className="mb-4">
              <p className="text-sm text-zinc-500"><GetText name="barangayInfo" title="BarangayInfo"/></p>
            </span>
            <div className="mb-4 mt-5">
              <span className="text-gray-700 text-sm font-semibold">
                Address:
              </span>
              <p className="text-sm text-zinc-500"><GetText name="address" title="Address"/></p>
            </div>
            <div className="mb-4">
              <span className="text-gray-700 text-sm font-semibold">
                Contact:
              </span>
              <p className="text-sm text-zinc-500"><GetText name="contact" title="Contact"/></p>
            </div>
            <div className="mb-4">
              <span className="text-gray-700 text-sm font-semibold">
                Email:
              </span>
              <p className="text-sm text-zinc-500"><GetText name="email" title="Email"/></p>
            </div>
          </div>
      </div>
    </UserNavLayout>
  );
};

export default About;

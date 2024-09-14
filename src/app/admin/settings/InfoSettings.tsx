"use client";
import React, { useState, useEffect } from "react";
import { db, storage } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DetailItem from "./DetailItem";
import TextSetting from "./TextSettings";

const InfoSetting: React.FC = (): JSX.Element => {


  return (
    <div className="bg-white grid rounded-lg border shadow-sm ml-0">
      <TextSetting name="name" title="Barangay Name"/>
      <hr />
      <TextSetting name="address" title="Complete Address"/>
      <hr />
      <TextSetting name="municipality" title="Municipality"/>
      <hr />
      <TextSetting name="province" title="Province"/>
      <hr />
      <TextSetting name="barangayInfo" title="Description"/>
      <hr />
      <TextSetting name="contact" title="Contact"/>
      <hr />
      <TextSetting name="email" title="Email Address"/>
      <hr />
      <TextSetting name="gcash" title="Gcash Number"/>
    </div>
  );
};

export default InfoSetting;

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";

interface SignatureUploadProps {
  label: string;
  value: string;
  isEditing: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filePreviewUrl: string | null;
}

const SignatureUpload: React.FC<SignatureUploadProps> = ({
  label,
  value,
  isEditing,
  onFileChange,
  filePreviewUrl,
}) => {
  return (
    <div className="mb-2">
      <span className="font-semibold text-gray-700 capitalize">
        {label.replace(/([A-Z])/g, " $1").trim()}:{" "}
      </span>
      {isEditing ? (
        <>
          <input
            type="file"
            name={label}
            accept="image/png"
            onChange={onFileChange}
            className="border bg-zinc-200 rounded px-2 py-1 w-full mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {filePreviewUrl && (
            <img
              src={filePreviewUrl}
              alt="Signature Preview"
              className="mt-2 h-auto w-40 object-contain"
            />
          )}
        </>
      ) : value ? (
        <img
          src={value}
          alt="Current Signature"
          className="mt-2 h-auto w-40 object-contain"
        />
      ) : (
        <span className="text-gray-600">No signature available</span>
      )}
    </div>
  );
};

export default SignatureUpload;

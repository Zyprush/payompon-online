/* eslint-disable @next/next/no-img-element */
import React from "react";

interface SignatureUploadProps {
  label: string;
  previewUrl: string;
  isEditing: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SignatureUpload: React.FC<SignatureUploadProps> = ({
  label,
  previewUrl,
  isEditing,
  onFileChange,
}) => {
  return (
    <div className="mb-4">
      <span className="font-semibold text-gray-700 capitalize">
        {label.replace(/([A-Z])/g, " $1").trim()}:{" "}
      </span>
      {isEditing ? (
        <>
          <input
            type="file"
            accept="image/png"
            onChange={onFileChange}
            className="border bg-zinc-200 rounded px-2 py-1 w-full mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt={`${label} Preview`}
              className="mt-2 h-auto w-40 object-contain"
            />
          )}
        </>
      ) : previewUrl ? (
        <img
          src={previewUrl}
          alt={`${label} Current`}
          className="mt-2 h-auto w-40 object-contain"
        />
      ) : (
        <span className="text-gray-600 block">No {label.toLowerCase()} available</span>
      )}
    </div>
  );
};

export default SignatureUpload;

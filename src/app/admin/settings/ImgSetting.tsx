/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";

const ImgSetting: React.FC<{ fileName: string; name: string }> = ({
  fileName,
  name,
}): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state for fetch
  const [uploading, setUploading] = useState<boolean>(false); // Loading state for upload

  // Fetch image URL when not editing
  useEffect(() => {
    if (!isEditing) {
      const fetchImageURL = async () => {
        setLoading(true);
        try {
          const storageRef = ref(storage, `settings/${fileName}`);
          const url = await getDownloadURL(storageRef);
          setImageURL(url);
          setPreview(url);
        } catch (error) {
          console.error("Error fetching image URL", error);
          setImageURL(null); // Handle errors or absence of image
        } finally {
          setLoading(false);
        }
      };

      fetchImageURL();
    }
  }, [isEditing, fileName]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (file) {
      setUploading(true);
      try {
        const storageRef = ref(storage, `settings/${fileName}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setImageURL(url);
        setPreview(url); // Clear preview after successful upload
        setIsEditing(false);
        setFile(null); // Clear file state
      } catch (error) {
        console.error("Upload failed", error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center border w-44 bg-white rounded-lg gap-3 p-3">
      {loading ? (
        "loading"
      ) : (
        <div className="flex flex-col gap-3">
          {isEditing ? (
            <>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mb-4 w-32 h-32 object-cover"
                />
              )}
              <label htmlFor="file-upload" className="custom-file-upload">
                Upload
              </label>
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="text-xs border"
              />
              <span className="flex gap-2">
                <button onClick={toggleEdit} className="bt-outline">
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="bt-primary"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Update"}
                </button>
              </span>
            </>
          ) : (
            <>
              {loading ? (
                <div className="w-32 h-32 flex items-center justify-center">
                  <span>Loading...</span>{" "}
                  {/* You can replace this with a spinner */}
                </div>
              ) : imageURL ? (
                <img
                  src={imageURL}
                  alt="Uploaded"
                  className="w-32 h-32 object-cover"
                />
              ) : (
                <span className="text-xs w-full h-32 font-semibold border rounded p-2 flex items-center justify-center">
                  <p className="text-center">No {name} uploaded</p>
                </span>
              )}
              <button onClick={toggleEdit} className="bt-outline mx-auto">
                Edit
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImgSetting;

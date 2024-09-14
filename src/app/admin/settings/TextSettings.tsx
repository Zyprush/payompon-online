"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface TextSettingProps {
  name: string;
  title: string;
}

const TextSetting: React.FC<TextSettingProps> = ({
  name,
  title,
}): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newValue, setNewValue] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false); // Loading state for saving changes

  // Fetch setting value by name from Firestore on component mount
  useEffect(() => {
    const fetchSetting = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "settings", name);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setValue(docSnap.data().value);
        } else {
          setValue(null); // No data for this name
        }
      } catch (error) {
        console.error("Error fetching setting:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSetting();
  }, [name]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setNewValue(value || ""); // Set initial value in input when editing starts
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewValue(event.target.value);
  };

  const handleSave = async () => {
    setIsSaving(true); // Set saving state to true
    try {
      await setDoc(doc(db, "settings", name), { value: newValue });
      setValue(newValue);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving setting:", error);
    } finally {
      setIsSaving(false); // Set saving state back to false after saving
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewValue(value || "");
  };

  return (
    <div className="flex flex-col items-center justify-apart w-full p-5 group text-zinc-600">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {isEditing ? (
            <div className="flex w-full justify-between items-center">
              <p className="font-semibold text-primary text-sm w-40">
                {title}
              </p>
              <input
                type="text"
                value={newValue}
                placeholder={title}
                onChange={handleChange}
                className="input input-sm border-primary mx-auto w-80"
                disabled={isSaving} // Disable input when saving
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="btn btn-sm btn-outline text-secondary rounded-sm ml-auto"
                  disabled={isSaving} // Disable cancel button when saving
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-primary btn-sm rounded-sm text-white"
                  disabled={isSaving} // Disable save button when saving
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex w-full my-auto justify-between items-center">
              <p className="font-semibold text-primary text-sm mr-auto w-40">
                {title}
              </p>
              <p className="text-sm text-zinc-500 ml-1 max-w-80 text-center">
                {value ? value : `No data for ${title}`}
              </p>
              <button
                onClick={toggleEdit}
                className="btn btn-outline btn-sm rounded-sm text-primary mx-auto hover:text-secondary ml-auto mr-0"
              >
                Edit
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TextSetting;
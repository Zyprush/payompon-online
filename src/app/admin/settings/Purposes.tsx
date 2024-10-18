import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

const Purposes = () => {
  const [purposes, setPurposes] = useState<string[]>([]); // Change state to an array of strings
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPurposes = async () => {
      const purposesDoc = await getDoc(doc(db, "settings", "purposes"));
      if (purposesDoc.exists()) {
        setPurposes(purposesDoc.data().purposes || []);
      }
    };
    fetchPurposes();
  }, []);

  const savePurposes = async () => {
    if (!isFormValid()) {
      setError("Please complete all fields.");
      return;
    }

    setError(null);
    setLoading(true);
    await setDoc(doc(db, "settings", "purposes"), { purposes });
    setLoading(false);
    setIsEditing(false);
  };

  const isFormValid = () => {
    return purposes.every((purpose) => purpose.trim() !== ""); // Only check for non-empty strings
  };

  const handlePurposeChange = (index: number, value: string) => {
    setPurposes((prevPurposes) =>
      prevPurposes.map((s, i) => (i === index ? value : s))
    );
  };

  const deletePurpose = (index: number) =>
    setPurposes(purposes.filter((_, i) => i !== index));

  const addPurpose = () =>
    setPurposes([...purposes, ""]); // Add an empty string to the array

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-white p-5 rounded-lg border flex flex-col gap-3 text-zinc-600">
      <div className="flex justify-between items-center">
        {/* <span className="font-bold text-primary">Purposes</span> */}
        <button
          onClick={toggleEdit}
          className="btn btn-sm text-primary btn-outline rounded-sm ml-auto mr-0"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {purposes.length > 0 && (
        <table className="table-auto w-full">
          <thead>
            <tr className="border-b-2 text-primary">
              <th className="text-left p-2">Purpose Name</th>
              {isEditing && <th className="text-left p-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {purposes.map((purpose, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 text-sm">
                  {isEditing ? (
                    <input
                      type="text"
                      placeholder="Purpose Name"
                      value={purpose}
                      onChange={(e) =>
                        handlePurposeChange(index, e.target.value)
                      }
                      className="p-2 text-sm border-primary border-2 rounded-sm w-full"
                    />
                  ) : (
                    purpose
                  )}
                </td>
                {isEditing && (
                  <td className="p-2">
                    <button
                      onClick={() => deletePurpose(index)}
                      className="btn btn-sm rounded-sm text-white btn-error"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isEditing && (
        <div className="mt-5 flex gap-5 justify-end">
          <button
            onClick={addPurpose}
            className="btn btn-sm text-primary btn-outline"
          >
            Add Purpose
          </button>
          <button
            onClick={savePurposes}
            className="btn btn-sm btn-primary text-white"
            disabled={!isFormValid() || loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Purposes;

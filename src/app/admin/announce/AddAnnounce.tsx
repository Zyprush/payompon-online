import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase";

interface AddAnnounceProps {
  onClose: () => void; // Prop to handle modal close
}

const AddAnnounce: React.FC<AddAnnounceProps> = ({ onClose }) => {
  const [what, setWhat] = useState("");
  const [when, setWhen] = useState("");
  const [who, setWho] = useState("");
  const [where, setWhere] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!what || !when || !who || !where) {
      setError("All fields are required.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const uploadedFiles: string[] = [];

      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileRef = ref(storage, `announcements/${file.name}`);
          await uploadBytes(fileRef, file);
          const downloadURL = await getDownloadURL(fileRef);
          uploadedFiles.push(downloadURL);
        }
      }

      await addDoc(collection(db, "announce"), {
        what,
        when,
        who,
        where,
        files: uploadedFiles,
        createdAt: new Date(),
      });

      setWhat("");
      setWhen("");
      setWho("");
      setWhere("");
      setFiles(null);
      onClose(); // Close the modal after successful submission
    } catch (err) {
      setError("Failed to submit announcement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-full bg-zinc-800 bg-opacity-50 py-6 flex p-4 flex-col justify-center sm:py-12 z-50">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto bg-white rounded-lg p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Add Announcement</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>What:</label>
            <input
              type="text"
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label>When:</label>
            <input
              type="datetime-local"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label>Who:</label>
            <input
              type="text"
              value={who}
              onChange={(e) => setWho(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label>Where:</label>
            <input
              type="text"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label>Attach Files:</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAnnounce;

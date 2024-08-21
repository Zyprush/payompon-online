"use client";
import NavLayout from "@/components/NavLayout";
import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage"; // Import for deleting files
import { db, storage } from "@/firebase"; // Ensure this path is correct
import AddAnnounce from "./AddAnnounce";

interface Announcement {
  id: string;
  what: string;
  when: string;
  who: string;
  where: string;
  files: string[];
}

const Announce: React.FC = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    fetchAnnouncements(); // Fetch updated announcements after adding a new one
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "announce"));
    const announcementsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Announcement[];
    setAnnouncements(announcementsData);
    setLoading(false);
  };

  const deleteAnnouncement = async (id: string, files: string[]) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?"
    );
    if (confirmed) {
      try {
        // Delete the announcement document
        await deleteDoc(doc(db, "announce", id));

        // Delete associated files from Firebase Storage
        for (const fileUrl of files) {
          const fileRef = ref(storage, fileUrl);
          await deleteObject(fileRef);
        }

        fetchAnnouncements(); // Refresh the announcements after deletion
      } catch (error) {
        console.error("Error deleting announcement or files: ", error);
      }
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <NavLayout>
      <div>
        <h1 className="text-xl font-semibold mb-4">Announcements</h1>
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
        >
          Add Announcement
        </button>

        {loading ? (
          <p>Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p>No announcements available.</p>
        ) : (
          <ul className="space-y-4">
            {announcements.map((announce) => (
              <li
                key={announce.id}
                className="p-4 bg-white shadow rounded-md flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold">{announce.what}</h2>
                  <p>
                    <strong>When:</strong> {announce.when}
                  </p>
                  <p>
                    <strong>Who:</strong> {announce.who}
                  </p>
                  <p>
                    <strong>Where:</strong> {announce.where}
                  </p>
                  {announce.files.length > 0 && (
                    <div className="mt-2">
                      <strong>Attachments:</strong>
                      <ul className="list-disc pl-5">
                        {announce.files.map((file, index) => (
                          <li key={index}>
                            <a
                              href={file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500"
                            >
                              File {index + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteAnnouncement(announce.id, announce.files)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {isModalOpen && <AddAnnounce onClose={closeModal} />}
    </NavLayout>
  );
};

export default Announce;

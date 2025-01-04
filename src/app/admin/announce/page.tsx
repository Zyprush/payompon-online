"use client";
import NavLayout from "@/components/NavLayout";
import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "@/firebase";
import AddAnnounce from "./AddAnnounce";
import { format } from "date-fns";
import AdminRouteGuard from "@/components/AdminRouteGuard";

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
  const [selectedAnnouncements, setSelectedAnnouncements] = useState<string[]>(
    []
  );

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    fetchAnnouncements();
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
    try {
      await deleteDoc(doc(db, "announce", id));
      for (const fileUrl of files) {
        const fileRef = ref(storage, fileUrl);
        await deleteObject(fileRef);
      }
    } catch (error) {
      console.error("Error deleting announcement or files: ", error);
    }
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedAnnouncements((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteSelected = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete the selected announcements?"
    );
    if (confirmed) {
      for (const id of selectedAnnouncements) {
        const announcement = announcements.find(
          (announce) => announce.id === id
        );
        if (announcement) {
          await deleteAnnouncement(announcement.id, announcement.files);
        }
      }
      setSelectedAnnouncements([]);
      fetchAnnouncements();
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <AdminRouteGuard>
      <NavLayout>
        <div className="flex flex-col">
          <div className="flex self-start">
            <button
              onClick={openModal}
              className="btn-primary btn-sm btn text-xs font-base text-white px-4 rounded-md mb-4"
            >
              Add Announcement
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={selectedAnnouncements.length === 0}
              className="btn-error btn btn-sm text-xs font-base text-white px-4 rounded-md mb-4 ml-4"
            >
              Delete
            </button>
          </div>

          {loading ? (
            <span className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto">
              <span className="loading loading-spinner loading-md"></span>{" "}
              Loading announcements...
            </span>
          ) : announcements.length === 0 ? (
            <span className="text-sm font-semibold text-zinc-600 border rounded-sm p-2 px-6 block m-auto md:ml-0 md:mr-auto">
              {" "}
              No announcements available.
            </span>
          ) : (
            <table className="min-w-full bg-white shadow rounded-md border border-gray-300 border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-800 border-b border-gray-300"></th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-800 border-b border-gray-300">
                    What
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-800 border-b border-gray-300">
                    When
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-800 border-b border-gray-300">
                    Who
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-800 border-b border-gray-300">
                    Where
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-800 border-b border-gray-300">
                    Attachments
                  </th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((announce) => (
                  <tr
                    key={announce.id}
                    className="text-xs text-start align-top"
                  >
                    <td className="p-4 border-b border-gray-300 align-top">
                      <input
                        type="checkbox"
                        checked={selectedAnnouncements.includes(announce.id)}
                        onChange={() => handleCheckboxChange(announce.id)}
                      />
                    </td>
                    <td className="p-4 border-b border-gray-300 align-top w-40 fon">
                      {announce.what}
                    </td>
                    <td className="p-4 border-b border-gray-300 align-top">
                      {format(
                        new Date(announce.when),
                        "MMM dd, yyyy 'at' hh:mm a"
                      )}
                    </td>
                    <td className="p-4 border-b border-gray-300 align-top">
                      {announce.who}
                    </td>
                    <td className="p-4 border-b border-gray-300 align-top">
                      {announce.where}
                    </td>
                    <td className="p-4 border-b border-gray-300 align-top w-40 font-bold">
                      {announce.files.length > 0 ? (
                        <ul className="list-none pl-5">
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
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {isModalOpen && <AddAnnounce onClose={closeModal} />}
      </NavLayout>
    </AdminRouteGuard>
  );
};

export default Announce;

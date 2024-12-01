"use client";
import { useState, useEffect } from "react";
import UserNavLayout from "@/components/UserNavLayout";
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "@/firebase";
import Image from "next/image";
import { getRelativeTime } from "@/helper/time";
import { format } from "date-fns";

interface Announcement {
  id: string;
  what: string;
  when: string;
  who: string;
  where: string;
  createdAt: string;
  files: string[];
  addedBy: string;
}

const Announce: React.FC = (): JSX.Element => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const q = query(
          collection(db, "announce"),
          orderBy("when", "desc"),
          limit(30)
        );

        const querySnapshot = await getDocs(q);
        const fetchedAnnouncements: Announcement[] = querySnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as Announcement[];

        setAnnouncements(fetchedAnnouncements);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError("Failed to fetch announcements.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const openModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
  };

  return (
    <UserNavLayout>
      <div className="md:p-4 pt-0">
        {loading && <p>Loading announcements...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && announcements.length === 0 && (
          <p>No announcements available.</p>
        )}

        {!loading && !error && announcements.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center mb-2">
              <h2 className="text-xl font-bold text-primary drop-shadow">
                Announcements
              </h2>
            </div>
            <div className="border-b border-gray-200 mb-2"></div>
            {announcements.map((announce) => (
              <div
                className="flex items-start mb-8 cursor-pointer"
                key={announce.id}
                onClick={() => openModal(announce)}
              >
                <Image
                  src="/img/brgy-logo.png"
                  alt="user picture"
                  height={100}
                  width={100}
                  className="w-10 h-10 rounded-full mr-3 custom-shadow"
                />
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-700">
                    {announce.what}
                  </p>
                  <p className="font-light text-xs text-gray-700">
                    {announce.addedBy}
                  </p>
                  <div className="flex items-center ">
                    <div className="text-xs text-zinc-500">
                      <p>{getRelativeTime(announce.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex bg-white border p-2 rounded text-sm text-zinc-500 mt-2 max-w-[30rem]">
                    This advisory is meant for &nbsp;
                    <b className="inline">{announce.who}</b>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && selectedAnnouncement && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2 max-w-4xl relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-xl font-bold"
              >
                &times;
              </button>
              <div
                className="flex items-start mb-2 cursor-pointer"
              >
                <Image
                  src="/img/brgy-logo.png"
                  alt="user picture"
                  height={100}
                  width={100}
                  className="w-10 h-10 rounded-full mr-3 custom-shadow"
                />
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-700">
                   Barangay Admin
                  </p>
                  <div className="flex items-center ">
                    <div className="text-xs text-zinc-500">
                      <p>{getRelativeTime(selectedAnnouncement.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-1">
                {selectedAnnouncement.what}
              </h3>
              <h3 className="text-xs font-light mb-4">
                {selectedAnnouncement.addedBy}
              </h3>
              <p className="text-sm mb-2">
                <strong>When:</strong> {format(new Date(selectedAnnouncement.when), "MMM dd, yyyy")}
              </p>
              <p className="text-sm mb-2">
                <strong>Who:</strong> {selectedAnnouncement.who}
              </p>
              <p className="text-sm mb-2">
                <strong>Where:</strong> {selectedAnnouncement.where}
              </p>
              {selectedAnnouncement.files.length > 0 && (
                <div>
                  <h4 className="font-bold mb-2 text-gray-600 text-sm">Attached Files</h4>
                  <ul className="flex flex-wrap">
                    {selectedAnnouncement.files.map((file, index) => (
                      <li key={index} className="mr-2 mb-2">
                        <a
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={file}
                            alt={`Document ${index}`}
                            height={200}
                            width={200}
                            className="rounded border border-gray-300"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </UserNavLayout>
  );
};

export default Announce;

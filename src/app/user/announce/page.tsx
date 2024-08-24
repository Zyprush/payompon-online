"use client";

import UserNavLayout from "@/components/UserNavLayout";
import React, { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "@/firebase";
import { format } from "date-fns";

interface Announcement {
  id: string;
  what: string;
  when: string;
  who: string;
  where: string;
  files: string[];
}

const Announce: React.FC = (): JSX.Element => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const q = query(
          collection(db, "announce"),
          orderBy("when", "desc"),
          limit(30)
        );

        const querySnapshot = await getDocs(q);
        const fetchedAnnouncements: Announcement[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Announcement[];

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

  return (
    <UserNavLayout>
      <div className="p-4 pt-0">
        <h2 className="text-xl font-bold mb-4 text-primary drop-shadow">Announcements</h2>

        {loading && <p>Loading announcements...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && announcements.length === 0 && (
          <p>No announcements available.</p>
        )}

        {!loading && !error && announcements.length > 0 && (
          <table className="min-w-full bg-white shadow rounded-md border">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left text-sm font-semibold text-gray-800">What</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-800">When</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-800">Who</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-800">Where</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-800">Attachments</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((announce) => (
                <tr key={announce.id} className="text-sm text-start border-b">
                  <td className="p-4 align-top">{announce.what}</td>
                  <td className="p-4 align-top">
                    {format(new Date(announce.when), "MMM dd, yyyy 'at' hh:mm a")}
                  </td>
                  <td className="p-4 align-top">{announce.who}</td>
                  <td className="p-4 align-top">{announce.where}</td>
                  <td className="p-4 w-40 align-top">
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
                      "No attachments"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </UserNavLayout>
  );
};

export default Announce;

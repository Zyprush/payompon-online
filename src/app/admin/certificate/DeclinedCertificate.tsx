"use client";
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

interface RequestData {
  id: string;
  requestType: string;
  gcashRefNo: string;
  submittedName: string;
  proofOfPaymentURL: string;
  status: string;
}

const DeclinedCertificate: React.FC = (): JSX.Element => {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(
          collection(db, "requests"),
          where("status", "==", "declined")
        );
        const querySnapshot = await getDocs(q);
        const fetchedRequests: RequestData[] = [];
        querySnapshot.forEach((doc) => {
          fetchedRequests.push({ id: doc.id, ...doc.data() } as RequestData);
        });
        setRequests(fetchedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Filter the requests based on the search term
  const filteredRequests = requests.filter((request) =>
    request.submittedName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="certificate-list">
      <div className="search-bar mb-4">
        <input
          type="text"
          className="border p-2 rounded-md w-60 text-sm"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto justify-center w-40">
          Loading...
        </p>
      ) : filteredRequests.length > 0 ? (
        <table className="min-w-full bg-white mt-4 rounded-lg shadow-sm border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
                Name
              </th>
              <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
                Request Type
              </th>
              <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
                GCash Ref No
              </th>
              <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
                Proof of Payment
              </th>
              <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request.id}>
                <td className="py-2 px-4 border-b text-left text-xs">
                  {request.submittedName}
                </td>
                <td className="py-2 px-4 border-b text-left text-xs">
                  {request.requestType}
                </td>
                <td className="py-2 px-4 border-b text-left text-xs">
                  {request.gcashRefNo}
                </td>
                <td className="py-2 px-4 border-b text-left text-xs font-semibold">
                  <a
                    href={request.proofOfPaymentURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    View Doc
                  </a>
                </td>
                <td className="py-2 px-4 border-b text-left text-xs">
                  {request.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto justify-center w-80">
          No declined certificates found.
        </p>
      )}
    </div>
  );
};

export default DeclinedCertificate;

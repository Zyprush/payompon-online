"use client";
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";

import { db } from "@/firebase";
import UpdateCertificate from "./UpdateCertificate";
import DeclineModal from "./DeclineModal";

interface RequestData {
  id: string;
  requestType: string;
  gcashRefNo: string;
  proofOfPaymentURL: string;
  status: string;
}

const PendingCertificate: React.FC = (): JSX.Element => {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(
    null
  );
  const [declineRequest, setDeclineRequest] = useState<RequestData | null>(
    null
  );

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(
          collection(db, "requests"),
          where("status", "==", "pending")
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
  }, [selectedRequest, declineRequest]);

  const handleUpdate = (request: RequestData) => {
    setSelectedRequest(request);
  };

  const handleDecline = (request: RequestData) => {
    setDeclineRequest(request);
  };

  return (
    <div className="certificate-list">
      {loading ? (
        <span className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto justify-center w-40">
          Loading...
        </span>
      ) : requests.length > 0 ? (
        <table className="min-w-full bg-white mt-4 rounded-lg shadow-sm border">
          <thead>
            <tr>
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
            {requests.map((request) => (
              <tr key={request.id} className="cursor-pointer hover:bg-gray-100">
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
                    onClick={(e) => e.stopPropagation()} // Prevents row click when link is clicked
                  >
                    View Proof
                  </a>
                </td>
                <td className="py-2 px-4 border-b text-left text-xs space-x-3">
                  <button onClick={() => handleUpdate(request)} className="btn-xs rounded-sm btn-primary btn text-white">
                    Approve
                  </button>
                  <button onClick={() => handleDecline(request)}  className="btn-xs rounded-sm btn-outline btn text-error">
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto justify-center w-80">
          No pending certificates found.
        </p>
      )}

      {selectedRequest && (
        <UpdateCertificate
          selectedRequest={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      {declineRequest && (
        <DeclineModal
          declineRequest={declineRequest}
          onClose={() => setDeclineRequest(null)}
        />
      )}
    </div>
  );
};

export default PendingCertificate;
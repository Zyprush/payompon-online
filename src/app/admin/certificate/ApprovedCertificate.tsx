"use client";
import React, { useEffect, useRef, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import ReactToPrint from "react-to-print";
import Header from "@/app/document/[id]/Header";

interface RequestData {
  id: string;
  requestType: string;
  gcashRefNo: string;
  proofOfPaymentURL: string;
  status: string;
  submittedName: string;
  issueOn: string;
  amount: string;
}

const ApprovedCertificate: React.FC = (): JSX.Element => {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>(""); // State to store search input
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(
          collection(db, "requests"),
          where("status", "==", "approved"),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedRequests: RequestData[] = [];
        querySnapshot.forEach((doc) => {
          fetchedRequests.push({ id: doc.id, ...doc.data() } as RequestData);
        });
        setRequests(fetchedRequests);
        setFilteredRequests(fetchedRequests); // Initialize filtered requests
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Filter requests by submittedName
  useEffect(() => {
    const filtered = requests.filter((request) =>
      request.submittedName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRequests(filtered);
  }, [searchTerm, requests]);

  return (
    <div className="certificate-list">
      <ReactToPrint
        trigger={() => (
          <button className="btn btn-sm btn-primary text-white fixed bottom-4 right-4">
            Print
          </button>
        )}
        content={() => printRef.current}
      />
      <div className="flex flex-col" ref={printRef}>
        <div className="print-header hidden">
          <Header />
        </div>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search by name"
          className="p-2 text-sm w-60 border rounded mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <p className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto justify-center w-40">
            Loading...
          </p>
        ) : filteredRequests.length > 0 ? (
          <table className="min-w-full bg-white mt-4 rounded-lg shadow-sm border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
                  Request Type
                </th>
                <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
                  Name
                </th>
                <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
                  GCash Ref No
                </th>
                <th className="print:hidden py-2 px-4 border-b text-left text-xs text-gray-700">
                  Proof of Payment
                </th>
                <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
                  Certficate Link
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td className="py-2 px-4 border-b text-left text-xs w-60">
                    {request.requestType}
                  </td>
                  <td className="py-2 px-4 border-b text-left text-xs">
                    {request.submittedName}
                  </td>
                  <td className="py-2 px-4 border-b text-left text-xs">
                    {request.gcashRefNo}
                  </td>
                  <td className="print:hidden py-2 px-4 border-b text-left text-xs font-semibold">
                    <a
                      href={request.proofOfPaymentURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      View
                    </a>
                  </td>
                  <td className="py-2 px-4 border-b text-left text-xs font-semibold">
                    <a
                      href={`https://payompon-online.vercel.app/document/${request.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      View Doc
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto justify-center w-80">
            No completed certificates found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ApprovedCertificate;

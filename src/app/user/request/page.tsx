"use client";
import React, { useState, useEffect } from "react";
import UserNavLayout from "@/components/UserNavLayout";
import AddRequest from "./AddRequest";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import EditRequest from "./EditRequest";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface RequestData {
  id: string;
  requestType: string;
  gcashRefNo: string;
  proofOfPaymentURL: string;
}

const Request: React.FC = (): JSX.Element => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [editRequestData, setEditRequestData] = useState<RequestData | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
      } else {
        setUserUid(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      if (userUid) {
        const q = query(collection(db, "request"), where("submittedBy", "==", userUid));
        const querySnapshot = await getDocs(q);
        const fetchedRequests: RequestData[] = [];
        querySnapshot.forEach((doc) => {
          fetchedRequests.push({ id: doc.id, ...doc.data() } as RequestData);
        });
        setRequests(fetchedRequests);
      }
    };

    fetchRequests();
  }, [userUid, openAddModal, openEditModal]);

  const handleOpenAdd = () => setOpenAddModal(true);
  const handleCloseAdd = () => setOpenAddModal(false);

  const handleOpenEdit = (requestData: RequestData) => {
    setEditRequestData(requestData);
    setOpenEditModal(true);
  };
  const handleCloseEdit = () => setOpenEditModal(false);

  return (
    <UserNavLayout>
      <div className="p-4">
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-primary text-xs font-semibold text-white rounded-md"
        >
          New Request
        </button>

        <table className="min-w-full bg-white mt-4 rounded-lg shadow-sm border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left text-sm">Request Type</th>
              <th className="py-2 px-4 border-b text-left text-sm">GCash Ref No</th>
              <th className="py-2 px-4 border-b text-left text-sm">Proof of Payment</th>
              <th className="py-2 px-4 border-b text-left text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="py-2 px-4 border-b text-left text-xs">{request.requestType}</td>
                <td className="py-2 px-4 border-b text-left text-xs">{request.gcashRefNo}</td>
                <td className="py-2 px-4 border-b text-left text-xs">
                  <a href={request.proofOfPaymentURL} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    View Proof
                  </a>
                </td>
                <td className="py-2 px-4 border-b text-left text-xs">
                  <button
                    onClick={() => handleOpenEdit(request)}
                    className="btn-outline btn btn-sm text-neutral rounded-md mr-2 mb-auto mt-0"
                  >
                    edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <AddRequest open={openAddModal} handleClose={handleCloseAdd} />
        {editRequestData && (
          <EditRequest
            open={openEditModal}
            handleClose={handleCloseEdit}
            requestData={editRequestData}
          />
        )}
      </div>
    </UserNavLayout>
  );
};

export default Request;

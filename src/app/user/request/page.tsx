"use client";
import React, { useState, useEffect } from "react";
import UserNavLayout from "@/components/UserNavLayout";
import AddRequest from "./AddRequest";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import EditRequest from "./EditRequest";
import { IconMessage2Question } from "@tabler/icons-react";
import { RequestTable } from "./RequestTable";
import { ApprovedTable } from "./ApprovedTable";
import useUserData from "@/hooks/useUserData";
import Unathorized from "./Unathorized";
import { ResidentDeclinedTable } from "./ResidentDeclinedTable";

interface RequestData {
  id: string;
  requestType: string;
  gcashRefNo: string;
  proofOfPaymentURL: string;
  status: string;
  certLink?: string;
  affiant?: string;
  certNo?: string;
  issueOn?: string;
  orNo?: string;
  submittedBy?: string;
  submittedName?: string;
  timestamp?: string;
  declineReason?: string;
  purpose?: string;
}

const Request: React.FC = (): JSX.Element => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RequestData[]>([]);
  const [editRequestData, setEditRequestData] = useState<RequestData | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("pending");
  const { userUid, verified } = useUserData();

  const fetchRequests = async () => {
    if (userUid) {
      console.log('userUid', userUid)
      const q = query(
        collection(db, "requests"),
        where("submittedBy", "==", userUid),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const fetchedRequests: RequestData[] = [];
      querySnapshot.forEach((doc) => {
        fetchedRequests.push({ id: doc.id, ...doc.data() } as RequestData);
      });
      setRequests(fetchedRequests);
    }
  };

  useEffect(() => {
    fetchRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userUid]);

  useEffect(() => {
    const filtered = requests.filter(
      (request) => request.status === selectedTab
    );
    setFilteredRequests(filtered);
  }, [requests, selectedTab]);

  const handleOpenAdd = () => setOpenAddModal(true);
  const handleCloseAdd = () => setOpenAddModal(false);

  const handleOpenEdit = (requestData: RequestData) => {
    console.log('requestData', requestData)
    setEditRequestData(requestData);
    setOpenEditModal(true);
  };
  const handleCloseEdit = () => setOpenEditModal(false);

  const handleRequestAdded = () => {
    fetchRequests();
  };

  if (!verified) {
    return <Unathorized />;
  }

  return (
    <UserNavLayout>
      <div className="p-4">
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-primary text-xs mb-4 font-semibold text-white rounded-md"
        >
          New Request
        </button>

        <AddRequest 
          open={openAddModal} 
          handleClose={handleCloseAdd} 
          onRequestAdded={handleRequestAdded}
        />
        {editRequestData && (
          <EditRequest
            open={openEditModal}
            handleClose={handleCloseEdit}
            requestData={{ ...editRequestData, purpose: editRequestData.purpose || '' }}
            onRequestUpdated={fetchRequests}
          />
        )}

        <div role="tablist" className="tabs tabs-lifted">
          {/* Pending Tab */}
          <input
            type="radio"
            name="request_tabs"
            role="tab"
            className="tab text-primary font-semibold"
            aria-label="Pending"
            checked={selectedTab === "pending"}
            onChange={() => setSelectedTab("pending")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            {filteredRequests.length === 0 ? (
              <span className="max-w-[15rem] mx-auto border rounded-md p-4 text-sm text-zinc-600 flex items-center gap-2 justify-center">
                <IconMessage2Question /> No request data
              </span>
            ) : (
              <RequestTable
                requests={filteredRequests}
                handleOpenEdit={handleOpenEdit}
                showEditButton={selectedTab === "pending"}
              />
            )}
          </div>

          {/* Approved Tab */}
          <input
            type="radio"
            name="request_tabs"
            role="tab"
            className="tab text-primary font-semibold"
            aria-label="Approved"
            checked={selectedTab === "approved"}
            onChange={() => setSelectedTab("approved")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            {filteredRequests.length === 0 ? (
              <span className="max-w-[15rem] mx-auto border rounded-md p-4 text-sm text-zinc-600 flex items-center gap-2 justify-center">
                <IconMessage2Question /> No request data
              </span>
            ) : (
              <ApprovedTable
                requests={filteredRequests}
                handleOpenEdit={handleOpenEdit}
                showEditButton={selectedTab === "pending"}
              />
            )}
          </div>

          {/* Declined Tab */}
          <input
            type="radio"
            name="request_tabs"
            role="tab"
            className="tab text-primary font-semibold"
            aria-label="Declined"
            checked={selectedTab === "declined"}
            onChange={() => setSelectedTab("declined")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            {filteredRequests.length === 0 ? (
              <span className="max-w-[15rem] mx-auto border rounded-md p-4 text-sm text-zinc-600 flex items-center gap-2 justify-center">
                <IconMessage2Question /> No request data
              </span>
            ) : (
              <ResidentDeclinedTable
                requests={filteredRequests}
                handleOpenEdit={handleOpenEdit}
                showEditButton={selectedTab === "pending"}
              />
            )}
          </div>
        </div>
      </div>
    </UserNavLayout>
  );
};

export default Request;

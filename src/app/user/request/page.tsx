"use client";
import React, { useState, useEffect } from "react";
import UserNavLayout from "@/components/UserNavLayout";
import AddRequest from "./AddRequest";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import EditRequest from "./EditRequest";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { IconMessage2Question } from "@tabler/icons-react";
import { RequestTable } from "./RequestTable";
import { ApprovedTable } from "./ApprovedTable";

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
}

// const RequestTable: React.FC<{
//   requests: RequestData[];
//   handleOpenEdit: (requestData: RequestData) => void;
//   showEditButton: boolean;
// }> = ({ requests, handleOpenEdit, showEditButton }) => {
//   return (
//     <table className="min-w-full bg-white mt-4 rounded-lg shadow-sm border">
//       <thead>
//         <tr>
//           <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
//             Request Type
//           </th>
//           <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
//             GCash Ref No
//           </th>
//           <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
//             Proof of Payment
//           </th>
//           <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
//             {showEditButton ? "Actions" : "Status"}
//           </th>
//         </tr>
//       </thead>
//       <tbody>
//         {requests.map((request) => (
//           <tr key={request.id}>
//             <td className="py-2 px-4 border-b text-left text-xs">
//               {request.requestType}
//             </td>
//             <td className="py-2 px-4 border-b text-left text-xs">
//               {request.gcashRefNo}
//             </td>
//             <td className="py-2 px-4 border-b text-left text-xs font-semibold">
//               <a
//                 href={request.proofOfPaymentURL}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-500"
//               >
//                 View Proof
//               </a>
//             </td>
//             {showEditButton ? (
//               <td className="py-2 px-4 border-b text-left text-xs">
//                 <button
//                   onClick={() => handleOpenEdit(request)}
//                   className="btn-outline btn btn-sm text-neutral rounded-md"
//                 >
//                   Edit
//                 </button>
//               </td>
//             ) : (
//               <td className="py-2 px-4 border-b text-left text-xs">
//                 {request.status}
//               </td>
//             )}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

const Request: React.FC = (): JSX.Element => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RequestData[]>([]);
  const [editRequestData, setEditRequestData] = useState<RequestData | null>(
    null
  );
  const [selectedTab, setSelectedTab] = useState<string>("pending");
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
        const q = query(
          collection(db, "requests"),
          where("submittedBy", "==", userUid)
        );
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

  useEffect(() => {
    const filtered = requests.filter(
      (request) => request.status === selectedTab
    );
    setFilteredRequests(filtered);
  }, [requests, selectedTab]);

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
          className="px-4 py-2 bg-primary text-xs mb-4 font-semibold text-white rounded-md"
        >
          New Request
        </button>

        <AddRequest open={openAddModal} handleClose={handleCloseAdd} />
        {editRequestData && (
          <EditRequest
            open={openEditModal}
            handleClose={handleCloseEdit}
            requestData={editRequestData}
          />
        )}

        <div role="tablist" className="tabs tabs-lifted">
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
              <RequestTable
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

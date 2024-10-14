import React from "react";

interface RequestData {
  id: string;
  requestType: string;
  gcashRefNo: string;
  submittedName: string;
  proofOfPaymentURL: string;
  status: string;
  declineReason: string;
}

interface ViewRequestModalProps {
  request: RequestData | null;
  onClose: () => void;
}

const ViewRequestModal: React.FC<ViewRequestModalProps> = ({ request, onClose }) => {
  if (!request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold text-primary mb-4">Request Details</h2>
        <RequestDetails request={request} />
        <button onClick={onClose} className="mt-4 btn btn-sm btn-primary">
          Close
        </button>
      </div>
    </div>
  );
};

const RequestDetails: React.FC<{ request: RequestData }> = ({ request }) => {
  const { requestType, submittedName, gcashRefNo, declineReason } = request;

  return (
    <>
      <DetailRow label="Request Type" value={requestType} />
      <DetailRow label="Name" value={submittedName} />
      <DetailRow label="GCash Ref No" value={gcashRefNo} />
      <DetailRow label="Reason of Decline" value={declineReason || "N/A"} />
    </>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <p className="mb-3 text-xs font-normal text-zinc-500">
    <span className="font-bold text-gray-600 block text-sm">{label}:</span> {value}
  </p>
);

export default ViewRequestModal;

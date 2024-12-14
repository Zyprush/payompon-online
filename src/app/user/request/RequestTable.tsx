import { format } from "date-fns";

interface RequestData {
  id: string;
  requestType: string;
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
}

export const RequestTable: React.FC<{
  requests: RequestData[];
  handleOpenEdit: (requestData: RequestData) => void;
  showEditButton: boolean;
}> = ({ requests, handleOpenEdit, showEditButton }) => {
  return (
    <table className="min-w-full bg-white mt-4 rounded-lg shadow-sm border">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
            Request Type
          </th>
          <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
            Date
          </th>
          <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
            Proof of Payment
          </th>
          <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
            {showEditButton ? "Actions" : "Status"}
          </th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => (
          <tr key={request.id}>
            <td className="py-2 px-4 border-b text-left text-xs">
              {request.requestType}
            </td>
            <td className="py-2 px-4 border-b text-left text-xs">
              {request.timestamp ? format(new Date(request.timestamp), "MMM dd, yyyy : hh:mm a") : "N/A"}
            </td>
            <td className="py-2 px-4 border-b text-left text-xs font-semibold">
              {request.proofOfPaymentURL !== "n/a" && (
                <a
                  href={request.proofOfPaymentURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500" 
                >
                  View Proof
                </a>
              )}
            </td>
            {showEditButton ? (
              <td className="py-2 px-4 border-b text-left text-xs">
                {request.timestamp && (new Date().getTime() - new Date(request.timestamp).getTime()) / 60000 <= 6 ? (
                  <button
                    onClick={() => handleOpenEdit(request)}
                    data-tip="Request cannot be edited after 6 minutes of submission"
                    className="btn-outline btn btn-sm text-neutral rounded-md"
                  >
                    Edit
                  </button>
                ) : null}
              </td>
            ) : (
              <td className="py-2 px-4 border-b text-left text-xs">
                {request.status}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

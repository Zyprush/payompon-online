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
    declineReason?: string;
  }
  
  export const ResidentDeclinedTable: React.FC<{
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
              Proof of Payment
            </th>
            <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
              Reason of Decline
            </th>
            {showEditButton && (
              <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td className="py-2 px-4 border-b text-left text-xs">
                <>
                  {request.requestType}
                </>
              </td>
              <td className="py-2 px-4 border-b text-left text-xs font-semibold">
                <a
                  href={request.proofOfPaymentURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Proof
                </a>
              </td>
              <td 
                className="py-2 px-4 border-b text-left text-xs max-w-xs"
                dangerouslySetInnerHTML={{ 
                  __html: request.declineReason || 'No specific reason provided' 
                }}
              />
              {showEditButton && (
                <td className="py-2 px-4 border-b text-left text-xs">
                  <button
                    onClick={() => handleOpenEdit(request)}
                    className="btn btn-xs btn-primary rounded-sm"
                  >
                    Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
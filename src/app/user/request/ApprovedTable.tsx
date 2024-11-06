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
}

export const ApprovedTable: React.FC<{
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
            Cert No
          </th>
          <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
            Issue On
          </th>
          <th className="py-2 px-4 border-b text-left text-xs text-gray-700">
            Cert Link
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
            <td className="py-2 px-4 border-b text-left text-xs font-semibold">
              <a
                href={request.proofOfPaymentURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                View Proof
              </a>
            </td>
            <td className="py-2 px-4 border-b text-left text-xs">
              {request.certNo || "N/A"}
            </td>
            <td className="py-2 px-4 border-b text-left text-xs">
              {request.issueOn || "N/A"}
            </td>
            <td className="py-2 px-4 border-b text-left text-xs font-semibold">
              {request.certLink ? (
                <a
                  href={request.certLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  View Cert
                </a>
              ) : (
                "N/A"
              )}
            </td>
            {showEditButton ? (
              <td className="py-2 px-4 border-b text-left text-xs">
                <button
                  onClick={() => handleOpenEdit(request)}
                  className="btn-outline btn btn-sm text-neutral rounded-md"
                >
                  Edit
                </button>
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

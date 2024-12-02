import React from 'react';

// Timestamp formatting utility function
const formatTimestamp = (timestamp?: string): string => {
  if (!timestamp) return 'N/A';

  try {
    const date = new Date(timestamp);
    
    // Create an array of month names
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    // Extract components
    const month = months[date.getMonth()];
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    
    // Handle hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    // Determine AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // handle midnight (0 hours)
    
    return `${month} ${day}, ${year} - ${hours}:${minutes} ${ampm}`;
  } catch (error) {
    return 'Invalid Date';
  }
};

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
            Timestamp
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
              {formatTimestamp(request.timestamp)}
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
                {request.status.charAt(0).toUpperCase() +
                  request.status.slice(1).toLowerCase()} 
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
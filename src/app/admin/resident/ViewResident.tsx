import React from "react";

interface User {
  id: string;
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  number: string;
  gender: string;
  sitio: string;
  civilStatus: string;
  verified: boolean;
  validID: string;
  validIDType: string;
  selfie: string;
}

interface ViewResidentProps {
  user: User | null;
  onClose: () => void;
}

const ViewResident: React.FC<ViewResidentProps> = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Resident Details</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>First Name:</strong> <p>{user.firstname}</p>
          </div>
          <div>
            <strong>Middle Name:</strong> <p>{user.middlename}</p>
          </div>
          <div>
            <strong>Last Name:</strong> <p>{user.lastname}</p>
          </div>
          <div>
            <strong>Email:</strong> <p>{user.email}</p>
          </div>
          <div>
            <strong>Contact Number:</strong> <p>{user.number}</p>
          </div>
          <div>
            <strong>Gender:</strong> <p>{user.gender}</p>
          </div>
          <div>
            <strong>Sitio:</strong> <p>{user.sitio}</p>
          </div>
          <div>
            <strong>Civil Status:</strong> <p>{user.civilStatus}</p>
          </div>
          <div>
            <strong>Verified:</strong> <p>{user.verified ? "Yes" : "No"}</p>
          </div>
          <div>
            <strong>Valid ID Type:</strong> <p>{user.validIDType}</p>
          </div>
          <div>
            <strong>Valid ID:</strong> <p>{user.validID ? <a href={user.validID} target="_blank" rel="noopener noreferrer" className="text-blue-500">View ID</a> : "No ID Uploaded"}</p>
          </div>
          <div>
            <strong>Selfie:</strong>
            {user.selfie ? (
              <a href={user.selfie} target="_blank" rel="noopener noreferrer" className="text-blue-500">View Selfie</a>
            ) : (
              "No Selfie Uploaded"
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="btn btn-sm btn-neutral rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewResident;

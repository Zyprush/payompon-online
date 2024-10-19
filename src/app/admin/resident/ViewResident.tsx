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
  infoErrors?: string;
  submitted: boolean;
  verifiedAt?: string;
  address: string;
}

interface ViewResidentProps {
  user: User | null;
  onClose: () => void;
}

const ViewResident: React.FC<ViewResidentProps> = ({ user, onClose }) => {
  if (!user) return null;

  const userDetails = [
    { label: "First Name", value: user.firstname },
    { label: "Middle Name", value: user.middlename },
    { label: "Last Name", value: user.lastname },
    { label: "Email", value: user.email },
    { label: "Contact Number", value: user.number },
    { label: "Gender", value: user.gender },
    { label: "Sitio", value: user.sitio },
    { label: "Civil Status", value: user.civilStatus },
    // { label: "Verified", value: user.verified ? "Yes" : "No" },
    { label: "Valid ID Type", value: user.validIDType },
    { label: "Address", value: user.address },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold text-primary drop-shadow ">
          Resident Details
        </h2>
        <hr className=" mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {userDetails.map((detail, index) => (
            <div key={index}>
              <span className="text-primary drop-shadow-sm font-bold">
                {detail.label}:
              </span>{" "}
              <p className="text-sm text-zinc-600 font-[300]">
                {detail.value || "N/A"}
              </p>
            </div>
          ))}

          <div className="mt-4">
            {user.validID ? (
              <a
                href={user.validID}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white btn-xs btn-primary rounded btn"
              >
                View ID
              </a>
            ) : (
              "No ID Uploaded"
            )}
          </div>

          <div className="mt-4">
            {user.selfie ? (
              <a
                href={user.selfie}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white btn-xs btn-primary rounded btn"
              >
                View Selfie
              </a>
            ) : (
              "No Selfie Uploaded"
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="btn btn-sm btn-neutral rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewResident;

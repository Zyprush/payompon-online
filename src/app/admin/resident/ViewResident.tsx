/* eslint-disable @next/next/no-img-element */
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
  validIDBack: string;
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

          {/* Valid ID and Selfie Section */}
          <div className="col-span-2 mt-4">
            <div className="flex gap-4">
            {user.selfie ? (
            <a href={user.selfie} target="_blank" rel="noopener noreferrer">
              <img
                src={user.selfie}
                alt="Selfie"
                className="w-28 h-28 object-cover border shadow-sm rounded-full"
              />
            </a>
          ) : (
            <p className="text-sm text-zinc-600">No Selfie Uploaded</p>
          )}
              {user.validID && (
                <a
                  href={user.validID}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={user.validID}
                    alt="Valid ID"
                    className="w-full h-28 object-cover rounded cursor-pointer border border-dashed border-slate-600"
                  />
                </a>
              )}
              {user.validIDBack && (
                <a
                  href={user.validIDBack}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={user.validIDBack}
                    alt="Valid ID Back"
                    className="w-full h-28 object-cover rounded cursor-pointer border border-dashed border-slate-600"
                  />
                </a>
              )}
            </div>
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

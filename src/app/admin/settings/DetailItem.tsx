import React from "react";

interface DetailItemProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DetailItem: React.FC<DetailItemProps> = ({
  label,
  value,
  isEditing,
  onChange,
}) => (
  <div className="mb-4">
    <span className="font-semibold text-gray-700 capitalize block">
      {label.replace(/([A-Z])/g, " $1").trim()}:{" "}
    </span>
    {isEditing ? (
      <input
        type="text"
        name={label}
        value={value}
        onChange={onChange}
        className="border bg-zinc-200 rounded px-2 py-1 w-full mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    ) : (
      <span className="text-gray-600 text-sm">{value}</span>
    )}
  </div>
);

export default DetailItem;

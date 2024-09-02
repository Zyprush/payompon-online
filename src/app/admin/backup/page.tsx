"use client";

import NavLayout from "@/components/NavLayout";
import React, { useState } from "react";

const Backup: React.FC = (): JSX.Element => {
    const [dbName, setDbName] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const handleBackup = async () => {
        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/backup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ dbName }),
            });

            if (response.ok) {
                const result = await response.json();
                setMessage("Backup created successfully.");
                // You can handle the backup result if needed here
            } else {
                const result = await response.json();
                setError(result.error || "An error occurred");
            }
        } catch (err) {
            console.error("Backup failed:", err);
            setError("Failed to create backup");
        }
    };

    return (
        <NavLayout>
            <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
                <h1 className="text-2xl font-bold text-center text-[#135D66]">
                    Create Backup
                </h1>

                <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleBackup();
                    }}
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Database Name
                        </label>
                        <input
                            type="text"
                            value={dbName}
                            onChange={(e) => setDbName(e.target.value)}
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#135D66] focus:border-[#135D66] sm:text-sm"
                            placeholder="Enter database name"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {message && <p className="text-green-500 text-sm">{message}</p>}

                    <button
                        type="submit"
                        className="bg-[#135D66] text-white p-2 rounded-md shadow hover:bg-[#114A55]"
                    >
                        Create Backup
                    </button>
                </form>
            </div>
        </NavLayout>
    );
};

export default Backup;

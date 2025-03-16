"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconLoader2 } from "@tabler/icons-react";
import NavLayout from "@/components/NavLayout";
import { db } from "@/firebase";
import { useLogs } from "@/hooks/useLogs";
import useUserData from "@/hooks/useUserData";
import { useMessageStore } from "@/state/message";
import { useNotifStore } from "@/state/notif";

interface InfoProps {
  params: {
    id: string;
  };
}

export default function RejectPage({ params }: InfoProps) {
  const { id } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [customReason, setCustomReason] = useState(""); // State for custom reason input
  const { addLog } = useLogs();
  const { userRole, name } = useUserData();
  const { addMessage } = useMessageStore();
  const { addNotif } = useNotifStore();
  const [data, setData] = useState<any>(null);

  // Fetch user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (id) {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);
        setData(docSnap.data());

        if (!docSnap.exists()) {
          toast.error("User data not found.");
        }
      }
    };

    fetchUserInfo();
  }, [id]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Use custom reason if selected, otherwise use the selected reason
    const finalReason = declineReason === "Custom Reason" ? customReason : declineReason;

    if (!finalReason) {
      toast.error("Please provide a reason for rejection.");
      return;
    }

    const currentTime = new Date().toISOString();

    addMessage({
      message: "Your account verification has been rejected.",
      sender: "admin",
      receiverId: id,
      receiverName: data ? `${data.firstname} ${data.lastname}` : "Unknown",
      senderName: "Admin",
      seen: false,
      time: currentTime,
      for: "user",
    });

    addLog({
      name: `Rejected ${data?.firstname + " " + data?.lastname} account verification`,
      date: currentTime,
      role: userRole,
      actionBy: name,
    });

    await addNotif({
      for: id,
      message: "Your account verification was rejected. Reason: " + finalReason,
      time: currentTime,
      type: "user",
      read: false,
    });

    setLoading(true);
    try {
      if (!id) {
        toast.error("User ID is not available.");
        return;
      }

      const userDocRef = doc(db, "users", id);
      await updateDoc(userDocRef, {
        infoErrors: finalReason,
        submitted: false,
      });

      toast.success("User has been rejected successfully!");
      router.push("/admin/resident");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NavLayout>
      <section>
        <div className="flex">
          <div className="mx-auto shadow-md p-4 min-w-[22rem] xl:max-w-md 2xl:max-w-lg rounded-xl m-auto bg-white">
            <h2 className="text-lg font-bold mt-10 md:mt-0 mb-4 text-primary drop-shadow">
              Reject User Verification
            </h2>
            <form className="mt-8" method="POST" onSubmit={onSubmit}>
              <div className="flex flex-col">
                <div className="mt-2 flex flex-col gap-2">
                  <select
                    onChange={(e) => setDeclineReason(e.target.value)}
                    value={declineReason}
                    className="sn-input"
                  >
                    <option value="">Select a reason for rejection</option>
                    <option value="Blurry, unreadable ID">Blurry, unreadable ID</option>
                    <option value="Details don&apos;t match your ID">Details don&apos;t match your ID</option>
                    <option value="Selfie is unclear or doesn&apos;t match your ID">Selfie is unclear or doesn&apos;t match your ID</option>
                    <option value="Address doesn&apos;t match your documents">Address doesn&apos;t match your documents</option>
                    <option value="Custom Reason">Custom Reason</option> {/* New option */}
                  </select>
                  {declineReason === "Custom Reason" && ( // Show input if "Custom Reason" is selected
                    <textarea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Enter custom reason..."
                      className="sn-input mt-2"
                      rows={3}
                    />
                  )}
                </div>
                <div className="flex gap-2 pt-10 ml-auto justify-end">
                  <Link
                    href="/admin/resident"
                    className="btn text-primary btn-outline btn-sm"
                  >
                    Back
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-sm text-white"
                  >
                    {loading ? (
                      <IconLoader2 className="animate-spin" />
                    ) : (
                      "Reject"
                    )}
                  </button>
                </div>
                <ToastContainer />
              </div>
            </form>
          </div>
        </div>
      </section>
    </NavLayout>
  );
}
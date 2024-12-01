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

    if (!declineReason) {
      toast.error("Please select a reason for rejection.");
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
      message: "Your account verification was rejected. Reason: " + declineReason,
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
        infoErrors: declineReason,
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
                <div className="mt-2 flex gap-2">
                  <select
                    onChange={(e) => setDeclineReason(e.target.value)}
                    value={declineReason}
                    className="sn-input"
                  >
                    <option value="">Select a reason for rejection</option>
                    <option value="Invalid ID">Invalid ID</option>
                    <option value="Name and ID don't match">Name and ID do not match</option>
                    <option value="Incomplete information">Incomplete information</option>
                  </select>
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

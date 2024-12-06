"use client";
import UserNavLayout from "@/components/UserNavLayout";
import React, { useEffect, useState } from "react";
import { useNotifications } from "@/hooks/useNotifications"; // Updated import
import { format, formatDate } from "date-fns";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";

const UserNotif: React.FC = (): JSX.Element => {
  // Use the new custom hook
  const { notif, loadingNotif, fetchNotifByUser } = useNotifications();
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());

  // Get user authentication
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;

  // Fetch notifications on component mount
  useEffect(() => {
    if (userId) {
      fetchNotifByUser(userId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle checkbox selection toggle
  const handleCheckboxChange = (id: string) => {
    setSelectedNotifications(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  // Mark selected notifications as read
  const handleMarkAsRead = async () => {
    if (!userId) return;

    try {
      const promises = Array.from(selectedNotifications).map(id => {
        const notifRef = doc(db, "notif", id);
        return updateDoc(notifRef, { read: true });
      });
      
      await Promise.all(promises);
      
      // Show success message
      alert("Selected notifications marked as read!");
      
      // Reset selection and refresh notifications
      setSelectedNotifications(new Set());
      await fetchNotifByUser(userId);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      alert("Failed to mark as read.");
    }
  };

  // Delete selected notifications
  const handleDeleteNotifications = async () => {
    if (!userId) return;

    try {
      const promises = Array.from(selectedNotifications).map(id => {
        const notifRef = doc(db, "notif", id);
        return deleteDoc(notifRef);
      });
      
      await Promise.all(promises);
      
      // Show success message
      alert("Selected notifications deleted successfully!");
      
      // Reset selection and refresh notifications
      setSelectedNotifications(new Set());
      await fetchNotifByUser(userId);
    } catch (error) {
      console.error("Error deleting notifications:", error);
      alert("Failed to delete notifications.");
    }
  };

  // Render notifications table
  const renderNotificationsTable = () => {
    if (loadingNotif) {
      return (
        <span className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto">
          Loading notifications...
        </span>
      );
    }

    if (!notif || notif.length === 0) {
      return (
        <span className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto">
          No notifications available.
        </span>
      );
    }

    return (
      <>
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mb-4">
          <button
            onClick={handleMarkAsRead}
            className="btn btn-xs text-neutral btn-outline rounded-sm"
            disabled={selectedNotifications.size === 0}
          >
            Mark as Read
          </button>
          <button
            onClick={handleDeleteNotifications}
            className="btn btn-xs btn-error rounded-sm text-white"
            disabled={selectedNotifications.size === 0}
          >
            Delete
          </button>
        </div>

        {/* Notifications Table */}
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      const allIds = new Set(notif.map((n) => n.id));
                      setSelectedNotifications(allIds);
                    } else {
                      setSelectedNotifications(new Set());
                    }
                  }}
                  checked={notif && selectedNotifications.size === notif.length}
                />
              </th>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                Notifications
              </th>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                Date
              </th>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                Time
              </th>
              <th className="py-2 px-4 border-b text-sm text-gray-700 font-semibold text-left">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {notif.map((notification: any) => (
              <tr key={notification.id}>
                <td className="py-2 px-4 border-b text-xs">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.has(notification.id)}
                    onChange={() => handleCheckboxChange(notification.id)}
                  />
                </td>
                <td className="py-2 px-4 border-b text-xs">
                  {notification.message}
                </td>
                <td className="py-2 px-4 border-b text-xs">
                  {formatDate(new Date(notification.time), "MMM dd, yyyy")}
                </td>
                <td className="py-2 px-4 border-b text-xs">
                  {format(new Date(notification.time), "hh:mm a")}
                </td>
                <td className="py-2 px-4 border-b text-xs">
                  {notification.read ? (
                    <span className="btn btn-xs text-primary btn-outline">
                      Read
                    </span>
                  ) : (
                    <span className="btn btn-xs text-white btn-error">
                      New
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <UserNavLayout>
      <div className="md:p-4 flex justify-start flex-col">
        {renderNotificationsTable()}
      </div>
    </UserNavLayout>
  );
};

export default UserNotif;
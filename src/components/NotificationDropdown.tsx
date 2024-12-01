"use client";
import React, { useEffect, useState } from "react";
import { BiBell } from "react-icons/bi";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useNotifStore } from "@/state/notif";
import { format } from "date-fns";
import { HiOutlineMailOpen } from "react-icons/hi";
import { IconTrash } from "@tabler/icons-react";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const NotificationsDropdown: React.FC = () => {
  const { notif, fetchNotifByAdmin } = useNotifStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Calculate unread count
  const unreadCount = notif?.filter(n => !n.read).length || 0;

  useEffect(() => {
    fetchNotifByAdmin();
  }, [fetchNotifByAdmin]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const notifRef = doc(db, "notif", id);
      await updateDoc(notifRef, { read: true });
      await fetchNotifByAdmin();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const notifRef = doc(db, "notif", id);
      await deleteDoc(notifRef);
      await fetchNotifByAdmin();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="relative"
      >
        <BiBell className="text-2xl text-gray-700 hover:text-primary" />
        {unreadCount > 0 && (
          <span
            className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center hover:cursor-help tooltip tooltip-left"
            data-tip="You have unread notifications"
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2 border-b flex justify-between items-center">
            <h3 className="font-semibold text-sm">Notifications</h3>
          </div>

          {notif && notif.length > 0 ? (
            notif.map((notification: Notification) => (
              <div 
                key={notification.id} 
                className={`p-3 border-b hover:bg-gray-50 flex justify-between items-start ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <Link href='/admin/notification'>
                
                <div className="flex-grow pr-2">
                  <p className="text-xs font-medium">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(notification.time), "MMM dd, yyyy hh:mm a")}
                  </p>
                </div>
                </Link>
                <div className="flex space-x-2">
                  {!notification.read && (
                    <button 
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-xs text-primary hover:underline" 
                      data-tip="Mark as read"
                    >
                      <HiOutlineMailOpen className="text-2xl" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="text-xs text-red-500 hover:underline" 
                    data-tip="Delete"
                  >
                    <IconTrash className="text-2xl" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              No notifications available.
            </div>
          )}

          {notif && notif.length > 0 && (
            <div className="p-2 text-center text-xs text-gray-500 border-t">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
"use client";
import UserNavLayout from "@/components/UserNavLayout";
import React, { useEffect, useState } from "react";
import { useNotifStore } from "@/state/notif";
import { format } from "date-fns";

const UserNotif: React.FC = (): JSX.Element => {
  const { notif, fetchNotifByUser } = useNotifStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());

  // Replace with actual userId from your authentication context or props
  const userId = "yourUserId"; 

  useEffect(() => {
    const fetchUserNotifications = async () => {
      setLoading(true);
      await fetchNotifByUser(userId);
      setLoading(false);
    };

    fetchUserNotifications();
  }, [fetchNotifByUser, userId]);

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

  return (
    <UserNavLayout>
      <div className="md:p-4 flex justify-start flex-col">
        {loading ? (
          <span className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto">
            Loading notifications...
          </span>
        ) : notif && notif.length > 0 ? (
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
                    checked={selectedNotifications.size === notif.length}
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
                    {format(new Date(notification.time),"MMM dd, yyyy")}
                  </td>
                  <td className="py-2 px-4 border-b text-xs">
                    {format(new Date(notification.time),"hh:mm a")}
                  </td>
                  <td className="py-2 px-4 border-b text-xs">
                    {notification.read ? <span className="btn btn-xs text-primary btn-outline">Read</span> : <span className="btn btn-xs text-white btn-error">new</span> }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <span className="text-sm font-semibold flex items-center gap-3 text-zinc-600 border rounded-sm p-2 px-6 m-auto md:ml-0 md:mr-auto">
            No notifications available.
          </span>
        )}
      </div>
    </UserNavLayout>
  );
};

export default UserNotif;

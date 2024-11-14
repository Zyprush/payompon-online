import { useState, useEffect } from "react";
import { useNotifStore } from "@/state/notif";

const useUnreadNotifications = (): number => {
  const { notif, fetchNotifByAdmin } = useNotifStore();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      await fetchNotifByAdmin();
      const unreadNotifications = notif ? notif.filter((notification) => !notification.read) : [];
      setUnreadCount(unreadNotifications.length);
    };

    fetchNotifications();
  }, [notif, fetchNotifByAdmin]);

  return unreadCount;
};

export default useUnreadNotifications;

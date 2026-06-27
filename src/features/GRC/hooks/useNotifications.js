import { useCallback, useEffect, useState } from "react";
import {
  listNotifications,
  markNotificationAsRead,
} from "../services/grcApi";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markRead = useCallback(async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true } : item))
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const markAllRead = useCallback(async () => {
    const unread = notifications.filter((item) => !item.read);
    await Promise.all(unread.map((item) => markNotificationAsRead(item.id)));
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, [notifications]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  return {
    notifications,
    unreadCount,
    loading,
    error,
    reload: load,
    markRead,
    markAllRead,
  };
}

import { useCallback, useEffect, useState } from "react";
import { getTrackingLogs, getTrackingTimeline } from "../services/phishingApi";

const POLL_MS = 2000;

export default function useTracking(campaignId, live = false, mode = "timeline") {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    const params = campaignId ? { campaignId } : {};
    return mode === "logs" ? getTrackingLogs(params) : getTrackingTimeline(params);
  }, [campaignId, mode]);

  const load = useCallback(async () => {
    try {
      const data = await fetchEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchEvents]);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = campaignId ? { campaignId } : {};
      const data = await getTrackingLogs(params);
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    load();
    if (!live) return undefined;
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [load, live]);

  return { events, loading, error, reload: load, loadLogs };
}

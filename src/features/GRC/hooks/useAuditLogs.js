import { useCallback, useEffect, useState } from "react";
import {
  listAuditLogs,
  listEntityAuditLogs,
} from "../services/grcApi";

export default function useAuditLogs(entityType, entityId) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = entityType && entityId
        ? await listEntityAuditLogs(entityType, entityId)
        : await listAuditLogs(params);
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    logs,
    loading,
    error,
    reload: load,
  };
}

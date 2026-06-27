import { useCallback, useEffect, useState } from "react";
import {
  assignFinding,
  closeFinding,
  createFindingRecord,
  deleteFinding,
  fetchFinding,
  fetchFindingHistory,
  listFindings,
  reopenFinding,
  retestFinding,
  updateFindingRecord,
} from "../services/grcApi";

export default function useFindings(findingId) {
  const [findings, setFindings] = useState([]);
  const [finding, setFinding] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadList = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listFindings(params);
      setFindings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOne = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFinding(id);
      setFinding(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHistory = useCallback(async (id) => {
    if (!id) return;
    try {
      const data = await fetchFindingHistory(id);
      setHistory(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    if (findingId) loadOne(findingId);
    else loadList();
  }, [findingId, loadOne, loadList]);

  const runAction = useCallback(async (fn) => {
    setActionLoading(true);
    setError(null);
    try {
      const result = await fn();
      if (findingId) await loadOne(findingId);
      else await loadList();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [findingId, loadList, loadOne]);

  return {
    findings,
    finding,
    history,
    loading,
    error,
    actionLoading,
    reload: findingId ? () => loadOne(findingId) : loadList,
    loadHistory,
    createFinding: (payload) => runAction(() => createFindingRecord(payload)),
    updateFinding: (id, payload) => runAction(() => updateFindingRecord(id, payload)),
    assignFinding: (id, userId) => runAction(() => assignFinding(id, userId)),
    closeFinding: (id) => runAction(() => closeFinding(id)),
    reopenFinding: (id) => runAction(() => reopenFinding(id)),
    deleteFinding: (id) => runAction(() => deleteFinding(id)),
    retestFinding: (id, payload) => runAction(() => retestFinding(id, payload)),
  };
}

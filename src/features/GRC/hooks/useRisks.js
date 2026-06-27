import { useCallback, useEffect, useState } from "react";
import {
  acceptRisk,
  closeRisk,
  createRiskRecord,
  fetchRisk,
  listRisks,
  mitigateRisk,
  updateRiskRecord,
} from "../services/grcApi";

export default function useRisks(riskId) {
  const [risks, setRisks] = useState([]);
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadList = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listRisks(params);
      setRisks(data);
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
      const data = await fetchRisk(id);
      setRisk(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (riskId) loadOne(riskId);
    else loadList();
  }, [riskId, loadOne, loadList]);

  const runAction = useCallback(async (fn) => {
    setActionLoading(true);
    setError(null);
    try {
      const result = await fn();
      if (riskId) await loadOne(riskId);
      else await loadList();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [riskId, loadList, loadOne]);

  return {
    risks,
    risk,
    loading,
    error,
    actionLoading,
    reload: riskId ? () => loadOne(riskId) : loadList,
    createRisk: (payload) => runAction(() => createRiskRecord(payload)),
    updateRisk: (id, payload) => runAction(() => updateRiskRecord(id, payload)),
    acceptRisk: (id) => runAction(() => acceptRisk(id)),
    mitigateRisk: (id) => runAction(() => mitigateRisk(id)),
    closeRisk: (id) => runAction(() => closeRisk(id)),
  };
}

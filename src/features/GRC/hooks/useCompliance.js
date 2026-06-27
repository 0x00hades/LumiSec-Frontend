import { useCallback, useEffect, useState } from "react";
import {
  createControlRecord,
  fetchComplianceStatus,
  fetchControl,
  linkFindingToControl,
  listControls,
  updateControlRecord,
} from "../services/grcApi";

export default function useCompliance(controlId) {
  const [controls, setControls] = useState([]);
  const [control, setControl] = useState(null);
  const [frameworks, setFrameworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadControls = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listControls(params);
      setControls(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const reloadControls = useCallback(async (params) => {
    setError(null);
    try {
      const data = await listControls(params);
      setControls(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const loadOne = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchControl(id);
      setControl(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchComplianceStatus();
      setFrameworks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const reloadStatus = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchComplianceStatus();
      setFrameworks(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (controlId) loadOne(controlId);
    else {
      loadControls();
      loadStatus();
    }
  }, [controlId, loadControls, loadOne, loadStatus]);

  const runAction = useCallback(async (fn) => {
    setActionLoading(true);
    setError(null);
    try {
      const result = await fn();
      if (controlId) await loadOne(controlId);
      else {
        await reloadControls();
        await reloadStatus();
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [controlId, loadOne, reloadControls, reloadStatus]);

  return {
    controls,
    control,
    frameworks,
    loading,
    error,
    actionLoading,
    reload: controlId ? () => loadOne(controlId) : reloadControls,
    reloadStatus,
    createControl: (payload) => runAction(() => createControlRecord(payload)),
    updateControl: (id, payload) => runAction(() => updateControlRecord(id, payload)),
    linkFinding: (id, payload) => runAction(() => linkFindingToControl(id, payload)),
  };
}

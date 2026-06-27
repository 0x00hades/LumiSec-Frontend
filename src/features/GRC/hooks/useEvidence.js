import { useCallback, useState } from "react";
import {
  fetchEvidence,
  removeEvidence,
  uploadEvidenceFile,
} from "../services/grcApi";

export default function useEvidence() {
  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const upload = useCallback(async (file, metadata = {}) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      Object.entries(metadata).forEach(([key, value]) => {
        if (value != null) formData.append(key, value);
      });
      const data = await uploadEvidenceFile(formData);
      setEvidence(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const load = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvidence(id);
      setEvidence(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await removeEvidence(id);
      setEvidence(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    evidence,
    loading,
    error,
    upload,
    load,
    remove,
  };
}

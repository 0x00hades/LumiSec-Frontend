import { useCallback, useEffect, useState } from "react";
import {
  deleteRecipient,
  getRecipient,
  importRecipientsCsv,
  listRecipients,
  updateRecipient,
} from "../services/phishingApi";

export default function useRecipients(recipientId) {
  const [recipients, setRecipients] = useState([]);
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listRecipients();
      setRecipients(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOne = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getRecipient(id);
      setRecipient(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (recipientId) loadOne(recipientId);
    else load();
  }, [recipientId, loadOne, load]);

  const filtered = recipients.filter((r) => {
    const q = search.toLowerCase();
    return (
      !q ||
      r.email.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q)
    );
  });

  const importCsv = async (file, campaignId) => {
    await importRecipientsCsv(file, campaignId);
    await load();
  };

  return {
    recipients: filtered,
    allRecipients: recipients,
    recipient,
    loading,
    error,
    search,
    setSearch,
    reload: recipientId ? () => loadOne(recipientId) : load,
    importCsv,
    updateRecipient,
    deleteRecipient,
  };
}

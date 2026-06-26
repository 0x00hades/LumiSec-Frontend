import { useCallback, useEffect, useState } from "react";
import {
  downloadReport,
  generateReport,
  getReportStats,
  listCampaigns,
  saveReportBlob,
} from "../services/phishingApi";

export default function useReports(campaignId) {
  const [stats, setStats] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listCampaigns();
      setCampaigns(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async (id) => {
    if (!id) return null;
    setLoading(true);
    try {
      const data = await getReportStats(id);
      setStats(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generate = useCallback(async (id) => {
    const report = await generateReport(id);
    return report;
  }, []);

  const download = useCallback(async (id) => {
    const res = await downloadReport(id);
    saveReportBlob(id, res.data);
  }, []);

  useEffect(() => {
    if (campaignId) loadStats(campaignId);
    else loadCampaigns();
  }, [campaignId, loadStats, loadCampaigns]);

  return {
    stats,
    campaigns,
    loading,
    error,
    reload: campaignId ? () => loadStats(campaignId) : loadCampaigns,
    loadStats,
    generateReport: generate,
    download,
  };
}

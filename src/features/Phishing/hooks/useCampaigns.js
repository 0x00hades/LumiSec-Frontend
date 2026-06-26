import { useCallback, useEffect, useState } from "react";
import {
  attachCampaignRecipients,
  createCampaign,
  deleteCampaign,
  getCampaign,
  launchCampaign,
  listCampaigns,
  pauseCampaign,
  resumeCampaign,
  stopCampaign,
  updateCampaign,
} from "../services/phishingApi";
import { campaignProgressFromCampaign } from "../utils/normalizers";

export default function useCampaigns(campaignId) {
  const [campaigns, setCampaigns] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadList = useCallback(async () => {
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

  const loadOne = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getCampaign(id);
      setCampaign(data);
      setQueue(campaignProgressFromCampaign(data));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadQueue = useCallback(async (id) => {
    if (!id) return;
    try {
      const data = await getCampaign(id);
      setCampaign(data);
      setQueue(campaignProgressFromCampaign(data));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    if (campaignId) loadOne(campaignId);
    else loadList();
  }, [campaignId, loadOne, loadList]);

  return {
    campaigns,
    campaign,
    queue,
    loading,
    error,
    reload: campaignId ? () => loadOne(campaignId) : loadList,
    loadQueue,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    attachCampaignRecipients,
    launchCampaign,
    pauseCampaign,
    resumeCampaign,
    stopCampaign,
  };
}

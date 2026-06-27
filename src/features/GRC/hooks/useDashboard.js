import { useCallback, useEffect, useState } from "react";
import {
  fetchDashboardCompliance,
  fetchDashboardOverview,
  fetchDashboardRisks,
  fetchDashboardTasks,
  fetchRiskHeatmap,
} from "../services/grcApi";

export default function useDashboard() {
  const [overview, setOverview] = useState(null);
  const [risks, setRisks] = useState(null);
  const [complianceChart, setComplianceChart] = useState(null);
  const [tasksChart, setTasksChart] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewData, risksData, complianceData, tasksData, heatmapData] =
        await Promise.all([
          fetchDashboardOverview(),
          fetchDashboardRisks(),
          fetchDashboardCompliance(),
          fetchDashboardTasks(),
          fetchRiskHeatmap(),
        ]);
      setOverview(overviewData);
      setRisks(risksData);
      setComplianceChart(complianceData);
      setTasksChart(tasksData);
      setHeatmap(heatmapData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    overview,
    risks,
    complianceChart,
    tasksChart,
    heatmap,
    loading,
    error,
    reload: load,
  };
}

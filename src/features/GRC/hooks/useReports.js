import { useCallback, useEffect, useState } from "react";
import {
  attachReportFindings,
  createReportRecord,
  deleteReport,
  downloadReportFile,
  fetchReport,
  generateReportPdf,
  listReports,
  updateReportRecord,
} from "../services/grcApi";

export default function useReports(reportId) {
  const [reports, setReports] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadList = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listReports(params);
      setReports(data);
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
      const data = await fetchReport(id);
      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (reportId) loadOne(reportId);
    else loadList();
  }, [reportId, loadOne, loadList]);

  const runAction = useCallback(async (fn) => {
    setActionLoading(true);
    setError(null);
    try {
      const result = await fn();
      if (reportId) await loadOne(reportId);
      else await loadList();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [reportId, loadList, loadOne]);

  return {
    reports,
    report,
    loading,
    error,
    actionLoading,
    reload: reportId ? () => loadOne(reportId) : loadList,
    createReport: (payload) => runAction(() => createReportRecord(payload)),
    updateReport: (id, payload) => runAction(() => updateReportRecord(id, payload)),
    deleteReport: (id) => runAction(() => deleteReport(id)),
    attachFindings: (id, payload) => runAction(() => attachReportFindings(id, payload)),
    generateReport: (id) => runAction(() => generateReportPdf(id)),
    downloadReport: (id, filename) => downloadReportFile(id, filename),
  };
}

import { useCallback, useEffect, useState } from "react";
import {
  createLandingPage,
  deleteLandingPage,
  getLandingPage,
  listLandingPages,
  updateLandingPage,
} from "../services/phishingApi";

export default function useLandingPages(pageId) {
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listLandingPages();
      setPages(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOne = useCallback(async (id) => {
    if (!id || id === "new") return;
    setLoading(true);
    try {
      const data = await getLandingPage(id);
      setPage(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pageId) loadOne(pageId);
    else loadList();
  }, [pageId, loadOne, loadList]);

  return {
    pages,
    page,
    loading,
    error,
    reload: pageId ? () => loadOne(pageId) : loadList,
    createLandingPage,
    updateLandingPage,
    deleteLandingPage,
  };
}

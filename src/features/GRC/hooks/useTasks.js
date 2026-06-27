import { useCallback, useEffect, useState } from "react";
import {
  completeTask,
  createTaskRecord,
  fetchTask,
  listTasks,
  updateTaskRecord,
  verifyTask,
} from "../services/grcApi";

export default function useTasks(taskId) {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadList = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listTasks(params);
      setTasks(data);
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
      const data = await fetchTask(id);
      setTask(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (taskId) loadOne(taskId);
    else loadList();
  }, [taskId, loadOne, loadList]);

  const runAction = useCallback(async (fn) => {
    setActionLoading(true);
    setError(null);
    try {
      const result = await fn();
      if (taskId) await loadOne(taskId);
      else await loadList();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [taskId, loadList, loadOne]);

  return {
    tasks,
    task,
    loading,
    error,
    actionLoading,
    reload: taskId ? () => loadOne(taskId) : loadList,
    createTask: (payload) => runAction(() => createTaskRecord(payload)),
    updateTask: (id, payload) => runAction(() => updateTaskRecord(id, payload)),
    completeTask: (id) => runAction(() => completeTask(id)),
    verifyTask: (id) => runAction(() => verifyTask(id)),
  };
}

import { useCallback, useEffect, useState } from "react";
import {
  activateUser,
  deactivateUser,
  deleteUser,
  getUser,
  listUsers,
  resetUserPassword,
  signup,
  updateUser,
} from "../../../services/auth.api";
import {
  normalizeUser,
  normalizeUserList,
  toSignupPayload,
  toUpdatePayload,
} from "../utils/userNormalizers";

export default function useUsers({
  page = 1,
  limit = 10,
  search = "",
  role = "",
  status = "",
} = {}) {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = { page, limit, sort: "-createdAt" };
      const trimmedSearch = String(search ?? "").trim();
      if (trimmedSearch) params.search = trimmedSearch;
      if (role) params.role = role;
      if (status) params.status = status;

      const result = await listUsers(params);
      setUsers(normalizeUserList(result.items));
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message || "Failed to load users");
      setUsers([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, role, status]);

  useEffect(() => {
    load();
  }, [load]);

  const createUser = useCallback(async (values) => {
    setActionLoading(true);
    try {
      const result = await signup(toSignupPayload(values));
      await load();
      return {
        user: normalizeUser(result.user),
        message: result.message,
      };
    } finally {
      setActionLoading(false);
    }
  }, [load]);

  const fetchUserById = useCallback(async (id) => {
    const result = await getUser(id);
    return normalizeUser(result.user);
  }, []);

  const saveUser = useCallback(async (id, values) => {
    setActionLoading(true);
    try {
      const result = await updateUser(id, toUpdatePayload(values));
      await load();
      return {
        user: normalizeUser(result.user),
        message: result.message,
      };
    } finally {
      setActionLoading(false);
    }
  }, [load]);

  const removeUser = useCallback(async (id) => {
    setActionLoading(true);
    try {
      const result = await deleteUser(id);
      await load();
      return result;
    } finally {
      setActionLoading(false);
    }
  }, [load]);

  const toggleUserStatus = useCallback(async (user) => {
    if (!user?.id) return null;
    setActionLoading(true);
    try {
      const isActive = user.status !== "inactive";
      const result = isActive
        ? await deactivateUser(user.id)
        : await activateUser(user.id);
      await load();
      return {
        user: normalizeUser(result.user),
        message: result.message,
      };
    } finally {
      setActionLoading(false);
    }
  }, [load]);

  const resetPassword = useCallback(async (id, password) => {
    setActionLoading(true);
    try {
      return await resetUserPassword(id, { password });
    } finally {
      setActionLoading(false);
    }
  }, []);

  return {
    users,
    pagination,
    loading,
    error,
    actionLoading,
    reload: load,
    createUser,
    fetchUserById,
    saveUser,
    removeUser,
    toggleUserStatus,
    resetPassword,
  };
}

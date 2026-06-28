import axios from "axios";
import { getToken } from "../features/auth/utils/authStorage";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://lumisec.tech";

const AUTH_BASE = `${API_BASE_URL}/api/auth`;

export class AuthApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "AuthApiError";
    this.status = status ?? null;
    this.data = data ?? null;
  }
}

function mapAuthError(error, fallbackMessage) {
  if (error instanceof AuthApiError) return error;

  const status = error.response?.status ?? null;
  const body = error.response?.data;
  const backendMessage = body?.message || body?.error;

  if (status === 401) {
    return new AuthApiError(backendMessage || "Authentication required", {
      status,
      data: body,
    });
  }
  if (status === 403) {
    return new AuthApiError(backendMessage || "Access denied", { status, data: body });
  }
  if (status === 404) {
    return new AuthApiError(backendMessage || "Not found", { status, data: body });
  }
  if (status === 409) {
    return new AuthApiError(backendMessage || "User already exists", { status, data: body });
  }
  if (status === 422 || status === 400) {
    return new AuthApiError(backendMessage || "Validation failed", { status, data: body });
  }
  if (status >= 500) {
    return new AuthApiError(
      backendMessage || "Server error. Please try again later.",
      { status, data: body }
    );
  }

  return new AuthApiError(backendMessage || error.message || fallbackMessage, {
    status,
    data: body,
  });
}

function authHeaders() {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function unwrapAuthData(body, fallbackMessage) {
  if (!body?.success) {
    throw new AuthApiError(body?.message || fallbackMessage);
  }
  return body.data ?? {};
}

function unwrapUserList(body) {
  if (!body?.success) {
    throw new AuthApiError(body?.message || "Failed to load users");
  }

  const data = body.data;
  const items = Array.isArray(data)
    ? data
    : Array.isArray(data?.users)
      ? data.users
      : [];

  return {
    items,
    pagination: body.pagination ?? data?.pagination ?? null,
    message: body.message || "Users loaded",
  };
}

function unwrapUserEntity(body, fallbackMessage) {
  const data = unwrapAuthData(body, fallbackMessage);
  const user = data.user ?? data;
  if (!user || typeof user !== "object") {
    throw new AuthApiError(body?.message || fallbackMessage);
  }
  return { user, message: body.message };
}

/**
 * POST /api/auth/login
 */
export async function login({ email, password }) {
  try {
    const response = await axios.post(`${AUTH_BASE}/login`, { email, password });
    const body = response.data;
    const data = unwrapAuthData(body, "Login failed");
    const user = data.user;
    const token = data.token;

    if (!token || !user) {
      throw new AuthApiError(body?.message || "Login failed");
    }

    return {
      user,
      token,
      message: body.message || "Logged in successfully",
    };
  } catch (error) {
    throw mapAuthError(error, "Login failed");
  }
}

/**
 * POST /api/auth/signup
 */
export async function signup({ name, email, password, role, department }) {
  try {
    const payload = {
      name: String(name).trim(),
      email: String(email).trim(),
      password,
      role,
    };

    const trimmedDepartment = String(department ?? "").trim();
    if (trimmedDepartment) {
      payload.department = trimmedDepartment;
    }

    const response = await axios.post(`${AUTH_BASE}/signup`, payload, {
      headers: authHeaders(),
    });

    const body = response.data;
    const { user, message } = unwrapUserEntity(body, "User creation failed");

    return { user, token: body.data?.token, message: message || "User created successfully" };
  } catch (error) {
    throw mapAuthError(error, "User creation failed");
  }
}

/**
 * GET /api/auth/profile
 */
export async function getProfile() {
  try {
    const response = await axios.get(`${AUTH_BASE}/profile`, {
      headers: authHeaders(),
    });
    const body = response.data;
    const { user, message } = unwrapUserEntity(body, "Failed to load profile");
    return { user, message: message || "Profile loaded" };
  } catch (error) {
    throw mapAuthError(error, "Failed to load profile");
  }
}

/**
 * GET /api/auth/users
 */
export async function listUsers(params = {}) {
  try {
    const response = await axios.get(`${AUTH_BASE}/users`, {
      headers: authHeaders(),
      params,
    });
    return unwrapUserList(response.data);
  } catch (error) {
    throw mapAuthError(error, "Failed to load users");
  }
}

/**
 * GET /api/auth/users/:id
 */
export async function getUser(id) {
  try {
    const response = await axios.get(`${AUTH_BASE}/users/${id}`, {
      headers: authHeaders(),
    });
    const body = response.data;
    const { user, message } = unwrapUserEntity(body, "Failed to load user");
    return { user, message: message || "User loaded" };
  } catch (error) {
    throw mapAuthError(error, "Failed to load user");
  }
}

/**
 * PATCH /api/auth/users/:id
 */
export async function updateUser(id, payload) {
  try {
    const response = await axios.patch(`${AUTH_BASE}/users/${id}`, payload, {
      headers: authHeaders(),
    });
    const body = response.data;
    const { user, message } = unwrapUserEntity(body, "Failed to update user");
    return { user, message: message || "User updated successfully" };
  } catch (error) {
    throw mapAuthError(error, "Failed to update user");
  }
}

/**
 * DELETE /api/auth/users/:id
 */
export async function deleteUser(id) {
  try {
    const response = await axios.delete(`${AUTH_BASE}/users/${id}`, {
      headers: authHeaders(),
    });
    const body = response.data;
    if (!body?.success) {
      throw new AuthApiError(body?.message || "Failed to delete user");
    }
    return { message: body.message || "User deleted successfully" };
  } catch (error) {
    throw mapAuthError(error, "Failed to delete user");
  }
}

/**
 * PATCH /api/auth/users/:id/activate
 */
export async function activateUser(id) {
  try {
    const response = await axios.patch(`${AUTH_BASE}/users/${id}/activate`, null, {
      headers: authHeaders(),
    });
    const body = response.data;
    const { user, message } = unwrapUserEntity(body, "Failed to activate user");
    return { user, message: message || "User activated successfully" };
  } catch (error) {
    throw mapAuthError(error, "Failed to activate user");
  }
}

/**
 * PATCH /api/auth/users/:id/deactivate
 */
export async function deactivateUser(id) {
  try {
    const response = await axios.patch(`${AUTH_BASE}/users/${id}/deactivate`, null, {
      headers: authHeaders(),
    });
    const body = response.data;
    const { user, message } = unwrapUserEntity(body, "Failed to deactivate user");
    return { user, message: message || "User deactivated successfully" };
  } catch (error) {
    throw mapAuthError(error, "Failed to deactivate user");
  }
}

/**
 * POST /api/auth/users/:id/reset-password
 */
export async function resetUserPassword(id, { password }) {
  try {
    const response = await axios.post(
      `${AUTH_BASE}/users/${id}/reset-password`,
      { password },
      { headers: authHeaders() }
    );
    const body = response.data;
    if (!body?.success) {
      throw new AuthApiError(body?.message || "Failed to reset password");
    }
    return { message: body.message || "Password reset successfully" };
  } catch (error) {
    throw mapAuthError(error, "Failed to reset password");
  }
}

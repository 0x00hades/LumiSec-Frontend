import React from "react";
import { formatUserDate } from "../../utils/userNormalizers";
import "../RemedationTabel/RemedationTabel.css";

function StatusBadge({ status }) {
  const isActive = status !== "inactive";
  return (
    <span className={`user-management__status user-management__status--${isActive ? "active" : "inactive"}`}>
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

export default function UsersTable({
  users = [],
  loading = false,
  actionLoading = false,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onResetPassword,
}) {
  return (
    <div className="rounded-3 overflow-hidden ls-table-scroll">
      <table className="w-100 RemedationTabel user-management__table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Department</th>
            <th>Created</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={8}>Loading users...</td>
            </tr>
          )}

          {!loading && users.length === 0 && (
            <tr>
              <td colSpan={8}>No users found.</td>
            </tr>
          )}

          {!loading &&
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <button
                    type="button"
                    className="btn btn-link p-0 text-white text-decoration-none user-management__name-link"
                    onClick={() => onView?.(user)}
                  >
                    {user.name || "—"}
                  </button>
                </td>
                <td>{user.email || "—"}</td>
                <td>{user.roleLabel || user.role || "—"}</td>
                <td>
                  <StatusBadge status={user.status} />
                </td>
                <td>{user.department || "—"}</td>
                <td>{formatUserDate(user.createdAt)}</td>
                <td>{formatUserDate(user.lastLoginAt)}</td>
                <td>
                  <div className="user-management__actions">
                    <button
                      type="button"
                      className="btn user-management__action-btn"
                      onClick={() => onView?.(user)}
                      disabled={actionLoading}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="btn user-management__action-btn"
                      onClick={() => onEdit?.(user)}
                      disabled={actionLoading}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn user-management__action-btn"
                      onClick={() => onToggleStatus?.(user)}
                      disabled={actionLoading}
                    >
                      {user.status === "inactive" ? "Activate" : "Deactivate"}
                    </button>
                    <button
                      type="button"
                      className="btn user-management__action-btn"
                      onClick={() => onResetPassword?.(user)}
                      disabled={actionLoading}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      className="btn user-management__action-btn user-management__action-btn--danger"
                      onClick={() => onDelete?.(user)}
                      disabled={actionLoading}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

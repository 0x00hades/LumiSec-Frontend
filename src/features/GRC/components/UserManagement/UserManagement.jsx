import React, { useEffect, useState } from "react";
import { BACKEND_ROLES } from "../../../../constants/backendRoles";
import { USER_STATUS_VALUES } from "../../utils/userNormalizers";
import { useToast } from "../../../../components/toast/ToastContext";
import { usePermissions } from "../../../../components/rbac/usePermissions";
import useUsers from "../../hooks/useUsers";
import UsersTable from "./UsersTable";
import CreateUserModal, { CREATE_USER_MODAL_ID } from "./CreateUserModal";
import EditUserModal from "./EditUserModal";
import UserDetailsModal from "./UserDetailsModal";
import ResetPasswordModal from "./ResetPasswordModal";
import { showBootstrapModal } from "../../utils/userNormalizers";
import "../../../Network/Components/Shared/NetworkShared.css";
import "../../pages/GRCStandards.css";
import "./UserManagement.css";

const DEFAULT_LIMIT = 10;

export default function UserManagement() {
  const toast = useToast();
  const { isAdmin } = usePermissions();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [resetUser, setResetUser] = useState(null);

  const {
    users,
    pagination,
    loading,
    error,
    actionLoading,
    reload,
    createUser,
    saveUser,
    removeUser,
    toggleUserStatus,
    resetPassword,
  } = useUsers({
    page,
    limit: DEFAULT_LIMIT,
    search,
    role: roleFilter,
    status: statusFilter,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCreateUser = async (values) => {
    try {
      const result = await createUser(values);
      toast.success(result.message || "User created successfully");
    } catch (err) {
      toast.error(err.message || "Failed to create user");
      throw err;
    }
  };

  const handleSaveUser = async (id, values) => {
    try {
      const result = await saveUser(id, values);
      toast.success(result.message || "User updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update user");
      throw err;
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Delete user "${user.name}" (${user.email})? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const result = await removeUser(user.id);
      toast.success(result.message || "User deleted successfully");
      if (selectedUser?.id === user.id) setSelectedUser(null);
      if (editUser?.id === user.id) setEditUser(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const result = await toggleUserStatus(user);
      toast.success(result.message || "User status updated");
    } catch (err) {
      toast.error(err.message || "Failed to update user status");
    }
  };

  const handleResetPassword = async (id, password) => {
    try {
      const result = await resetPassword(id, password);
      toast.success(result.message || "Password reset successfully");
    } catch (err) {
      toast.error(err.message || "Failed to reset password");
      throw err;
    }
  };

  const totalPages = pagination?.pages ?? 1;
  const currentPage = pagination?.page ?? page;
  const totalUsers = pagination?.total ?? users.length;

  if (!isAdmin) {
    return (
      <div className="user-management">
        <p className="text-secondary mb-0">
          User administration is restricted to administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="text-white fs-5 mb-1">User Administration</h2>
          <p className="text-secondary small mb-0">
            {loading ? "Loading users..." : `${totalUsers} user${totalUsers === 1 ? "" : "s"} total`}
          </p>
        </div>

        <button
          type="button"
          className="btn add-btn text-white border-0"
          onClick={() => showBootstrapModal(CREATE_USER_MODAL_ID)}
        >
          <i className="fa-solid fa-user-plus me-2" aria-hidden="true" />
          Create User
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <label htmlFor="userSearch" className="form-label text-secondary small mb-1">
            Search
          </label>
          <input
            id="userSearch"
            type="search"
            className="form-control border-0 bg-dark text-white"
            placeholder="Search by name or email"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>

        <div className="col-12 col-md-4">
          <label htmlFor="userRoleFilter" className="form-label text-secondary small mb-1">
            Role
          </label>
          <select
            id="userRoleFilter"
            className="form-select border-0 bg-dark text-white"
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All roles</option>
            {BACKEND_ROLES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-4">
          <label htmlFor="userStatusFilter" className="form-label text-secondary small mb-1">
            Status
          </label>
          <select
            id="userStatusFilter"
            className="form-select border-0 bg-dark text-white"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            {USER_STATUS_VALUES.map((value) => (
              <option key={value} value={value}>
                {value === "active" ? "Active" : "Inactive"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="network-alert network-alert-danger mb-3 d-flex justify-content-between align-items-center gap-3">
          <span>{error}</span>
          <button type="button" className="btn btn-sm network-retry-btn" onClick={reload}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && users.length === 0 ? (
        <div className="user-management__empty rounded-3 text-center p-5">
          <i className="fa-solid fa-users fa-2x text-secondary mb-3" aria-hidden="true" />
          <h3 className="text-white fs-5 mb-2">No users found</h3>
          <p className="text-secondary mb-4">
            {search || roleFilter || statusFilter
              ? "Try adjusting your search or filters."
              : "Get started by creating the first platform user."}
          </p>
          <button
            type="button"
            className="btn add-btn text-white border-0"
            onClick={() => showBootstrapModal(CREATE_USER_MODAL_ID)}
          >
            <i className="fa-solid fa-user-plus me-2" aria-hidden="true" />
            Create User
          </button>
        </div>
      ) : (
        <>
          <UsersTable
            users={users}
            loading={loading}
            actionLoading={actionLoading}
            onView={setSelectedUser}
            onEdit={setEditUser}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleStatus}
            onResetPassword={setResetUser}
          />

          {totalPages > 1 && (
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4">
              <p className="text-secondary small mb-0">
                Page {currentPage} of {totalPages}
              </p>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm network-retry-btn"
                  disabled={currentPage <= 1 || loading}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-sm network-retry-btn"
                  disabled={currentPage >= totalPages || loading}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <CreateUserModal onCreate={handleCreateUser} />

      <EditUserModal
        user={editUser}
        onSave={handleSaveUser}
        onSuccess={() => setEditUser(null)}
      />

      <UserDetailsModal
        user={selectedUser}
        onEdit={(user) => {
          setSelectedUser(null);
          setEditUser(user);
        }}
        onClose={() => setSelectedUser(null)}
      />

      <ResetPasswordModal
        user={resetUser}
        onReset={handleResetPassword}
        onSuccess={() => setResetUser(null)}
      />
    </div>
  );
}

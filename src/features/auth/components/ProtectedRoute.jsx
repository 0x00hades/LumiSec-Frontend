import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../../../components/rbac/usePermissions";

function AuthLoadingScreen() {
  return (
    <div className="login-body vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center text-secondary">
        <div className="spinner-border text-primary mb-3" role="status" />
        <p className="mb-0">Restoring session...</p>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(
      location.pathname + location.search
    );
    return <Navigate to={`/?returnUrl=${returnUrl}`} replace />;
  }

  return children;
}

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { defaultPath, allowedTools } = usePermissions();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    const params = new URLSearchParams(location.search);
    const returnUrl = params.get("returnUrl");

    if (!allowedTools.length) {
      return (
        <div className="login-body vh-100 d-flex align-items-center justify-content-center">
          <div className="text-center text-secondary p-4">
            <h4 className="text-white mb-2">No Module Access</h4>
            <p className="mb-0">Your account is authenticated but has no assigned tools.</p>
          </div>
        </div>
      );
    }

    const destination =
      returnUrl && returnUrl.startsWith("/") ? returnUrl : defaultPath;

    if (destination === location.pathname) {
      return children;
    }

    return <Navigate to={destination} replace />;
  }

  return children;
}

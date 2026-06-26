import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePermissions } from './usePermissions';
import AccessDenied from './AccessDenied';

/**
 * Wraps a page that belongs to a specific tool.
 * If the current user's role does not have access to that tool,
 * redirects once to their first allowed tool — never to "/" (which
 * would bounce back via PublicOnlyRoute and cause an infinite loop).
 */
export default function ToolRoute({ toolId, children }) {
  const { canAccessTool, defaultPath, allowedTools } = usePermissions();
  const location = useLocation();

  if (canAccessTool(toolId)) {
    return children;
  }

  if (!allowedTools.length) {
    return (
      <AccessDenied message="Your account has no module access assigned. Contact an administrator." />
    );
  }

  const fallback = defaultPath;
  const current = location.pathname;

  if (fallback && fallback !== current && !current.startsWith(`${fallback}/`)) {
    return <Navigate to={fallback} replace />;
  }

  return (
    <AccessDenied message="You do not have permission to access this module." />
  );
}

import { useMemo } from 'react';
import { useAuth } from '../../features/auth/context/AuthContext';
import { getAllowedTools, isToolAllowed } from './rbac';
import { normalizeBackendRole } from './roleMap';
import { ROLES } from '../tools/tools.config';

export const DEV_ROLE_KEY = 'lumisec_dev_role';

/**
 * Resolves the current user's role in priority order:
 *   1. user.role from AuthContext (mapped from backend JWT role)
 *   2. localStorage dev override (for local testing without a backend role)
 *   3. GLOBAL_ADMIN as safe default so the app is always usable in dev
 */
function resolveRole(user) {
  if (user?.role) {
    return normalizeBackendRole(user.role) ?? ROLES.GLOBAL_ADMIN;
  }
  const devRole = localStorage.getItem(DEV_ROLE_KEY);
  if (devRole && Object.values(ROLES).includes(devRole)) return devRole;
  return ROLES.GLOBAL_ADMIN;
}

/**
 * Central permissions hook.
 *
 * @returns {{
 *   role: string,
 *   allowedTools: import('../tools/tools.config').Tool[],
 *   canAccessTool: (toolId: string) => boolean,
 *   isAdmin: boolean,
 *   defaultPath: string,
 * }}
 */
export function usePermissions() {
  const { user } = useAuth();
  const role = resolveRole(user);

  return useMemo(() => {
    const allowedTools = getAllowedTools(role);
    const firstToolPath = allowedTools[0]?.path ?? '/GRC';

    return {
      role,
      allowedTools,
      canAccessTool: (toolId) => isToolAllowed(toolId, role),
      isAdmin: role === ROLES.GLOBAL_ADMIN,
      defaultPath: firstToolPath,
    };
  }, [role]);
}

/** Persist a dev-mode role override in localStorage. Pass null to clear. */
export function setDevRole(role) {
  if (role) {
    localStorage.setItem(DEV_ROLE_KEY, role);
  } else {
    localStorage.removeItem(DEV_ROLE_KEY);
  }
  window.location.reload();
}

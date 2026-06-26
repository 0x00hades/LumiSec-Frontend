import React, { createContext, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getToolByPath } from '../rbac/rbac';
import { usePermissions } from '../rbac/usePermissions';

const ToolContext = createContext(null);

/**
 * Provides `allowedTools` — the role-filtered list of tools.
 *
 * IMPORTANT: useLocation() is intentionally NOT called here.
 * Keeping location reads out of this provider means ToolProvider only
 * re-renders when the user's role changes (very rare), NOT on every
 * navigation. Avoiding that cascade prevents MainLayoutInner from
 * re-rendering on navigation, which in turn keeps the outlet context
 * object stable and stops needless re-renders of useOutletContext() consumers.
 *
 * Components that need the "active tool" must call useActiveTool() directly
 * so only those leaf components re-render on navigation.
 */
export function ToolProvider({ children }) {
  const { allowedTools } = usePermissions();

  // Only recompute when allowedTools reference changes (i.e., role changes).
  const value = useMemo(() => ({ allowedTools }), [allowedTools]);

  return <ToolContext.Provider value={value}>{children}</ToolContext.Provider>;
}

export function useToolContext() {
  const ctx = useContext(ToolContext);
  if (!ctx) throw new Error('useToolContext must be used within ToolProvider');
  return ctx;
}

/**
 * Derives the currently active tool from the URL.
 * Call this in LEAF components (Topbar, SidebarA) — each caller gets its
 * own useLocation() subscription so only those components re-render on
 * navigation, not the entire layout tree.
 */
export function useActiveTool() {
  const { allowedTools } = useToolContext();
  const { pathname } = useLocation();

  return useMemo(() => {
    const matched = getToolByPath(pathname);
    if (!matched) return null;
    return allowedTools.find(t => t.id === matched.id) ?? null;
  }, [pathname, allowedTools]);
}

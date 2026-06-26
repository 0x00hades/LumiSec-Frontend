import React, { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToolProvider } from '../context/ToolContext';
import Topbar from './Topbar';
import SidebarA from './SidebarA';
import SidebarB from './SidebarB';
import './MainLayout.css';

/**
 * Inner shell — rendered inside ToolProvider so Topbar / SidebarA / SidebarB
 * can all read from ToolContext.
 *
 * TWO stability rules upheld here:
 *
 * 1. outletContext is memoized: its object reference only changes when
 *    title or collapsed actually change. Without this, every re-render of
 *    MainLayoutInner (e.g., triggered by a title update) would give every
 *    useOutletContext() consumer a new object → needless re-renders of
 *    SOAR / Network pages.
 *
 * 2. MainLayoutInner itself is now stable against navigations: because
 *    ToolProvider no longer calls useLocation(), ToolProvider won't re-render
 *    on navigation, so MainLayoutInner (its child) won't re-render either.
 */
function MainLayoutInner() {
  const [title, setTitle] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  // Stable reference — React state setters (setTitle, setCollapsed) never
  // change identity, so they are safe to omit from the dependency array.
  const outletContext = useMemo(
    () => ({ title, setTitle, collapsed, setCollapsed }),
    [title, collapsed]
  );

  return (
    <div className="lumisec-shell">
      <Topbar />

      <div className="lumisec-body">
        <SidebarB />
        <SidebarA />

        <main className="lumisec-content">
          <Outlet context={outletContext} />
        </main>
      </div>
    </div>
  );
}

export default function MainLayout() {
  return (
    <ToolProvider>
      <MainLayoutInner />
    </ToolProvider>
  );
}

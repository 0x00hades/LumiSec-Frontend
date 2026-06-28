import React, { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToolProvider } from '../context/ToolContext';
import { MobileNavProvider } from './MobileNavContext';
import { MobileFeatureNavProvider } from './MobileFeatureNavContext';
import Topbar from './Topbar';
import SidebarA from './SidebarA';
import SidebarB from './SidebarB';
import MobileNav from './MobileNav';
import MobileFeatureNav from './MobileFeatureNav';
import ToolFeatureNavBar from './ToolFeatureNavBar';
import './MainLayout.css';

function MainLayoutInner() {
  const [title, setTitle] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const outletContext = useMemo(
    () => ({ title, setTitle, collapsed, setCollapsed }),
    [title, collapsed]
  );

  return (
    <MobileNavProvider>
      <MobileFeatureNavProvider>
        <div className="lumisec-shell">
          <Topbar />
          <MobileNav />
          <MobileFeatureNav />

          <div className="lumisec-body">
            <SidebarB />
            <SidebarA />

            <main className="lumisec-content">
              <ToolFeatureNavBar />
              <Outlet context={outletContext} />
            </main>
          </div>
        </div>
      </MobileFeatureNavProvider>
    </MobileNavProvider>
  );
}

export default function MainLayout() {
  return (
    <ToolProvider>
      <MainLayoutInner />
    </ToolProvider>
  );
}

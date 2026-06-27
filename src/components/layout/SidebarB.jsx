import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Activity,
  AlertCircle,
  BarChart2,
  Crosshair,
  FileText,
  FolderOpen,
  GitBranch,
  LayoutDashboard,
  Mail,
  Network,
  ScanLine,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';
import { generateSidebarSections } from '../rbac/rbac';
import { usePermissions } from '../rbac/usePermissions';

const ICON_MAP = {
  'layout-dashboard': <LayoutDashboard size={20} />,
  'shield-check':     <ShieldCheck size={20} />,
  'zap':              <Zap size={20} />,
  'crosshair':        <Crosshair size={20} />,
  'mail-warning':     <Mail size={20} />,
  'network':          <Network size={20} />,
  'users':            <Users size={20} />,
  'shield':           <Shield size={20} />,
  'settings':         <Settings size={20} />,
  'bar-chart-2':      <BarChart2 size={20} />,
  'triangle-alert':   <AlertCircle size={20} />,
  'folder-open':      <FolderOpen size={20} />,
  'file-text':        <FileText size={20} />,
  'server':           <Server size={20} />,
  'scan-line':        <ScanLine size={20} />,
  'activity':         <Activity size={20} />,
  'git-branch':       <GitBranch size={20} />,
  'wrench':           <Wrench size={20} />,
};

function getIcon(iconName) {
  return ICON_MAP[iconName] ?? <LayoutDashboard size={20} />;
}

export default function SidebarB() {
  const { role } = usePermissions();
  const { pathname } = useLocation();
  // Memoized: only recomputed when role changes, not on every navigation.
  const sections = useMemo(() => generateSidebarSections(role), [role]);

  return (
    <nav className="ls-sidebar-b" aria-label="Tool navigation">
      {sections.map((section, si) => (
        <React.Fragment key={section.id}>
          {/* Section divider (skip first) */}
          {si > 0 && <div className="ls-sidebar-b__divider" />}

          {section.items.map(item => {
            const isActive =
              item.id === 'home'
                ? pathname === item.path
                : pathname === item.path || pathname.startsWith(`${item.path}/`);
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={`ls-sidebar-b__item${isActive ? ' active' : ''}`}
                data-tooltip={item.name}
                title={item.name}
                aria-label={item.name}
              >
                {getIcon(item.icon)}
              </NavLink>
            );
          })}
        </React.Fragment>
      ))}
    </nav>
  );
}

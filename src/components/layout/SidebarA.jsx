import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Activity,
  AlertCircle,
  BarChart2,
  Building2,
  ClipboardCheck,
  Crosshair,
  Eye,
  FileBadge,
  FileText,
  FolderOpen,
  GitBranch,
  Globe,
  LayoutDashboard,
  LayoutGrid,
  List,
  Network,
  Rss,
  ScanLine,
  Search,
  Send,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Target,
  TrendingUp,
  TriangleAlert,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';
import { useActiveTool } from '../context/ToolContext';

const ICON_MAP = {
  'layout-dashboard': <LayoutDashboard size={16} />,
  'layout-grid':      <LayoutGrid size={16} />,
  'shield-check':     <ShieldCheck size={16} />,
  'clipboard-check':  <ClipboardCheck size={16} />,
  'file-badge':       <FileBadge size={16} />,
  'wrench':           <Wrench size={16} />,
  'settings':         <Settings size={16} />,
  'zap':              <Zap size={16} />,
  'bar-chart-2':      <BarChart2 size={16} />,
  'triangle-alert':   <TriangleAlert size={16} />,
  'folder-open':      <FolderOpen size={16} />,
  'alert-circle':     <AlertCircle size={16} />,
  'crosshair':        <Crosshair size={16} />,
  'rss':              <Rss size={16} />,
  'target':           <Target size={16} />,
  'file-text':        <FileText size={16} />,
  'send':             <Send size={16} />,
  'layout':           <LayoutGrid size={16} />,
  'users':            <Users size={16} />,
  'eye':              <Eye size={16} />,
  'network':          <Network size={16} />,
  'search':           <Search size={16} />,
  'scan-line':        <ScanLine size={16} />,
  'activity':         <Activity size={16} />,
  'server':           <Server size={16} />,
  'git-branch':       <GitBranch size={16} />,
  'shield':           <Shield size={16} />,
  'building-2':       <Building2 size={16} />,
  'trending-up':      <TrendingUp size={16} />,
  'globe':            <Globe size={16} />,
  'list':             <List size={16} />,
};

function getIcon(name) {
  return ICON_MAP[name] ?? <LayoutDashboard size={16} />;
}

// Icons for the tool itself (shown in the sidebar A header)
const TOOL_HEADER_ICONS = {
  'shield-check': <ShieldCheck size={16} />,
  'zap':          <Zap size={16} />,
  'crosshair':    <Crosshair size={16} />,
  'mail-warning': <AlertCircle size={16} />,
  'network':      <Network size={16} />,
};

export default function SidebarA() {
  // useActiveTool() reads useLocation() locally — only SidebarA re-renders
  // on navigation, not the entire layout tree.
  const activeTool = useActiveTool();

  const isHidden = !activeTool;

  return (
    <aside
      className={`ls-sidebar-a${isHidden ? ' hidden' : ''}`}
      aria-label={activeTool ? `${activeTool.name} navigation` : 'Tool navigation'}
    >
      {activeTool && (
        <>
          {/* Tool header */}
          <div className="ls-sidebar-a__header icon-title icon-title--block">
            <div className="ls-sidebar-a__tool-icon icon-title__icon">
              {TOOL_HEADER_ICONS[activeTool.icon] ?? <ShieldCheck size={16} />}
            </div>
            <span className="ls-sidebar-a__tool-name">{activeTool.name}</span>
          </div>

          {/* Feature links */}
          <nav className="ls-sidebar-a__nav">
            {activeTool.features.map(feature => (
              <NavLink
                key={feature.id}
                to={feature.path}
                end={feature.path === activeTool.path}
                className={({ isActive }) =>
                  `ls-sidebar-a__link icon-title icon-title--block${isActive ? ' active' : ''}`
                }
              >
                <span className="ls-sidebar-a__link-icon icon-title__icon">
                  {getIcon(feature.icon)}
                </span>
                {feature.name}
              </NavLink>
            ))}
          </nav>
        </>
      )}
    </aside>
  );
}

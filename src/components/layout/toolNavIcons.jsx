import React from 'react';
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
  Mail,
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

export const TOOL_HEADER_ICON_MAP = {
  'shield-check': ShieldCheck,
  zap: Zap,
  crosshair: Crosshair,
  'mail-warning': Mail,
  network: Network,
};

export const FEATURE_ICON_MAP = {
  'layout-dashboard': LayoutDashboard,
  'layout-grid': LayoutGrid,
  'shield-check': ShieldCheck,
  'clipboard-check': ClipboardCheck,
  'file-badge': FileBadge,
  wrench: Wrench,
  settings: Settings,
  zap: Zap,
  'bar-chart-2': BarChart2,
  'triangle-alert': TriangleAlert,
  'folder-open': FolderOpen,
  'alert-circle': AlertCircle,
  crosshair: Crosshair,
  rss: Rss,
  target: Target,
  'file-text': FileText,
  send: Send,
  layout: LayoutGrid,
  users: Users,
  eye: Eye,
  network: Network,
  search: Search,
  'scan-line': ScanLine,
  activity: Activity,
  server: Server,
  'git-branch': GitBranch,
  shield: Shield,
  'building-2': Building2,
  'trending-up': TrendingUp,
  globe: Globe,
  list: List,
};

export function ToolHeaderIcon({ name, size = 16 }) {
  const Icon = TOOL_HEADER_ICON_MAP[name] ?? ShieldCheck;
  return <Icon size={size} aria-hidden="true" />;
}

export function FeatureIcon({ name, size = 16 }) {
  const Icon = FEATURE_ICON_MAP[name] ?? LayoutDashboard;
  return <Icon size={size} aria-hidden="true" />;
}

export function getActiveFeature(activeTool, pathname) {
  if (!activeTool?.features?.length) return null;

  const sorted = [...activeTool.features].sort(
    (a, b) => b.path.length - a.path.length
  );

  return (
    sorted.find(
      (feature) =>
        pathname === feature.path ||
        (feature.path !== activeTool.path &&
          pathname.startsWith(`${feature.path}/`))
    ) ??
    sorted.find((feature) => feature.path === activeTool.path) ??
    null
  );
}

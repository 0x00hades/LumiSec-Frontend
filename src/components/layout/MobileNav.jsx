import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
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
  X,
} from 'lucide-react';
import { generateSidebarSections } from '../rbac/rbac';
import { usePermissions } from '../rbac/usePermissions';
import { useMobileNav } from './MobileNavContext';

export const MOBILE_NAV_ID = 'lsMobileNav';

const TOOL_ICON_MAP = {
  'layout-dashboard': LayoutDashboard,
  'shield-check': ShieldCheck,
  zap: Zap,
  crosshair: Crosshair,
  'mail-warning': Mail,
  network: Network,
  users: Users,
  shield: Shield,
  settings: Settings,
  'bar-chart-2': BarChart2,
  'triangle-alert': AlertCircle,
  'folder-open': FolderOpen,
  'file-text': FileText,
  server: Server,
  'scan-line': ScanLine,
  activity: Activity,
  'git-branch': GitBranch,
  wrench: Wrench,
};

function ToolIcon({ name }) {
  const Icon = TOOL_ICON_MAP[name] ?? LayoutDashboard;
  return <Icon size={18} aria-hidden="true" />;
}

export default function MobileNav() {
  const { isOpen, isMobile, close } = useMobileNav();
  const { role } = usePermissions();
  const sections = useMemo(() => generateSidebarSections(role), [role]);

  if (!isMobile) {
    return null;
  }

  return createPortal(
    <>
      <button
        type="button"
        className={`ls-mobile-nav-backdrop${isOpen ? ' is-visible' : ''}`}
        aria-label="Close navigation menu"
        tabIndex={isOpen ? 0 : -1}
        onClick={close}
      />

      <aside
        id={MOBILE_NAV_ID}
        className={`ls-mobile-nav${isOpen ? ' is-open' : ''}`}
        aria-hidden={!isOpen}
        aria-modal="true"
        role="dialog"
        aria-labelledby="lsMobileNavLabel"
      >
        <div className="ls-mobile-nav__header">
          <div className="ls-mobile-nav__brand">
            <ShieldCheck size={18} className="ls-mobile-nav__brand-icon" aria-hidden="true" />
            <h2 className="ls-mobile-nav__title mb-0" id="lsMobileNavLabel">
              Navigation
            </h2>
          </div>
          <button
            type="button"
            className="ls-mobile-nav__close ls-topbar__icon-btn"
            onClick={close}
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="ls-mobile-nav__body">
          {sections.map((section, si) => (
            <React.Fragment key={section.id}>
              {si > 0 && <div className="ls-mobile-nav__divider" role="presentation" />}
              {section.label && (
                <div className="ls-mobile-nav__section-label">{section.label}</div>
              )}
              <nav className="ls-mobile-nav__group" aria-label={section.label ?? section.id}>
                {section.items.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    end={item.id === 'home'}
                    className={({ isActive }) =>
                      `ls-mobile-nav__link${isActive ? ' active' : ''}`
                    }
                    onClick={close}
                  >
                    <span className="ls-mobile-nav__link-icon">
                      <ToolIcon name={item.icon} />
                    </span>
                    <span className="ls-mobile-nav__link-text">{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </React.Fragment>
          ))}
        </div>
      </aside>
    </>,
    document.body
  );
}

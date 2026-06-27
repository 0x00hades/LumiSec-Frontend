import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Search, Shield } from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';
import { usePermissions, setDevRole, DEV_ROLE_KEY } from '../rbac/usePermissions';
import { useActiveTool } from '../context/ToolContext';
import { ROLE_LABELS } from '../tools/tools.config';

export default function Topbar() {
  const { user, logout } = useAuth();
  const { role } = usePermissions();
  // useActiveTool() reads useLocation() here — Topbar re-renders on navigation
  // but the rest of MainLayoutInner stays stable.
  const activeTool = useActiveTool();
  const navigate = useNavigate();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const roleMenuRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target)) {
        // Functional update: only schedules a real re-render when menu was open.
        // Passing a function instead of a value lets React bail out if the
        // returned value equals the current state — no render if already closed.
        setRoleMenuOpen(prev => (prev ? false : prev));
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleLogout() {
    logout();
    navigate('/');
  }

  function handleRoleChange(newRole) {
    setRoleMenuOpen(false);
    setDevRole(newRole);
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  const displayName = user?.name ?? user?.email ?? 'User';
  const displayEmail = user?.email ?? '';

  const isDevOverride = !user?.role && Boolean(localStorage.getItem(DEV_ROLE_KEY));

  return (
    <header className="ls-topbar">

      {/* ── Brand ── */}
      <div className="ls-topbar__brand">
        <div className="ls-topbar__logo-icon">
          <Shield size={15} />
        </div>
        <span className="ls-topbar__wordmark">LumiSec</span>
      </div>

      {/* Active module breadcrumb */}
      {activeTool && (
        <>
          <div className="ls-topbar__divider" />
          <span className="ls-topbar__module-name">{activeTool.name}</span>
        </>
      )}

      <div className="ls-topbar__spacer" />

      {/* ── Search ── */}
      {/* <div className="ls-topbar__search">
        <span className="ls-topbar__search-icon">
          <Search size={14} />
        </span>
        <input
          type="text"
          className="ls-topbar__search-input"
          placeholder="Search LumiSec..."
        />
      </div> */}

      <div className="ls-topbar__actions">

        {/* Notification bell */}
        <button className="ls-topbar__icon-btn" title="Notifications">
          <Bell size={16} />
          <span className="ls-topbar__notif-dot" />
        </button>

        {/* Role badge / dev switcher */}
        <div className="ls-topbar__role-switcher" ref={roleMenuRef}>
          <button
            className="ls-topbar__role-badge"
            onClick={() => setRoleMenuOpen(v => !v)}
            title={isDevOverride ? 'Dev role override — click to change' : 'Current role'}
          >
            <Shield size={11} />
            {ROLE_LABELS[role] ?? role}
            {isDevOverride && ' (dev)'}
            <ChevronDown size={11} />
          </button>

          {roleMenuOpen && (
            <div className="ls-role-menu">
              <div className="ls-role-menu__header">Switch Dev Role</div>
              {Object.entries(ROLE_LABELS).map(([key, label]) => (
                <div
                  key={key}
                  className={`ls-role-menu__item${role === key ? ' active' : ''}`}
                  onClick={() => handleRoleChange(key)}
                >
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User info */}
        <div className="ls-topbar__user">
          <div className="ls-topbar__avatar">{initials}</div>
          <div className="ls-topbar__user-info">
            <span className="ls-topbar__user-name">{displayName}</span>
            {displayEmail && (
              <span className="ls-topbar__user-email">{displayEmail}</span>
            )}
          </div>
        </div>

        {/* Logout */}
        <button
          className="ls-topbar__logout-btn"
          onClick={handleLogout}
          title="Sign out"
        >
          <LogOut size={15} />
        </button>

      </div>
    </header>
  );
}

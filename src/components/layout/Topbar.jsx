import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Menu, Shield, X } from 'lucide-react';
import logo from '../../assets/LumiSecLogoB 1@3x.png';
import { useAuth } from '../../features/auth/context/AuthContext';
import { usePermissions, setDevRole, DEV_ROLE_KEY } from '../rbac/usePermissions';
import { useActiveTool } from '../context/ToolContext';
import { ROLE_LABELS } from '../tools/tools.config';
import { useMobileNav } from './MobileNavContext';
import { useMobileFeatureNavOptional } from './MobileFeatureNavContext';

export default function Topbar() {
  const { user, logout } = useAuth();
  const { role } = usePermissions();
  const activeTool = useActiveTool();
  const navigate = useNavigate();
  const { isOpen: mobileNavOpen, isMobile, toggle: toggleMobileNav } = useMobileNav();
  const featureNav = useMobileFeatureNavOptional();

  const handleMobileNavToggle = () => {
    featureNav?.close();
    toggleMobileNav();
  };
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const roleMenuRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target)) {
        setRoleMenuOpen((prev) => (prev ? false : prev));
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (mobileNavOpen) {
      setRoleMenuOpen(false);
    }
  }, [mobileNavOpen]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function handleRoleChange(newRole) {
    setRoleMenuOpen(false);
    setDevRole(newRole);
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  const displayName = user?.name ?? user?.email ?? 'User';
  const displayEmail = user?.email ?? '';
  const isDevOverride = !user?.role && Boolean(localStorage.getItem(DEV_ROLE_KEY));

  return (
    <header className="ls-topbar">
      {isMobile && (
        <button
          type="button"
          className={`ls-topbar__menu-btn ls-topbar__icon-btn${mobileNavOpen ? ' is-open' : ''}`}
          onClick={handleMobileNavToggle}
          aria-controls="lsMobileNav"
          aria-expanded={mobileNavOpen}
          aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <span className="ls-topbar__menu-icon" aria-hidden="true">
            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </span>
        </button>
      )}

      <div className="ls-topbar__brand">
        <img src={logo} alt="LumiSec" className="ls-topbar__logo-img" />
        <h1 className="ls-topbar__wordmark mb-0">LumiSec</h1>
      </div>

      {activeTool && (
        <>
          <div className="ls-topbar__divider" />
          <span className="ls-topbar__module-name">{activeTool.name}</span>
        </>
      )}

      <div className="ls-topbar__spacer" />

      <div className="ls-topbar__actions">
        <button type="button" className="ls-topbar__icon-btn" title="Notifications">
          <Bell size={16} />
          <span className="ls-topbar__notif-dot" />
        </button>

        <div className="ls-topbar__role-switcher" ref={roleMenuRef}>
          <button
            type="button"
            className="ls-topbar__role-badge"
            onClick={() => setRoleMenuOpen((v) => !v)}
            title={isDevOverride ? 'Dev role override — click to change' : 'Current role'}
          >
            <Shield size={11} />
            <span className="ls-topbar__role-label">{ROLE_LABELS[role] ?? role}</span>
            {isDevOverride && ' (dev)'}
            <ChevronDown size={11} />
          </button>

          {roleMenuOpen && (
            <div className="ls-role-menu">
              <div className="ls-role-menu__header">Switch Dev Role</div>
              {Object.entries(ROLE_LABELS).map(([key, label]) => (
                <button
                  type="button"
                  key={key}
                  className={`ls-role-menu__item${role === key ? ' active' : ''}`}
                  onClick={() => handleRoleChange(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ls-topbar__user">
          <div className="ls-topbar__avatar">{initials}</div>
          <div className="ls-topbar__user-info">
            <span className="ls-topbar__user-name">{displayName}</span>
            {displayEmail && (
              <span className="ls-topbar__user-email">{displayEmail}</span>
            )}
          </div>
        </div>

        <button
          type="button"
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

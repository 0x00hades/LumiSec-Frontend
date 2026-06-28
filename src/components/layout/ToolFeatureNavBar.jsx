import React from 'react';
import { ChevronDown, LayoutGrid } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useActiveTool } from '../context/ToolContext';
import { useMobileFeatureNav } from './MobileFeatureNavContext';
import { useMobileNavOptional } from './MobileNavContext';
import { getActiveFeature, ToolHeaderIcon } from './toolNavIcons';

export default function ToolFeatureNavBar() {
  const activeTool = useActiveTool();
  const { pathname } = useLocation();
  const { isMobile, isOpen, toggle } = useMobileFeatureNav();
  const mainNav = useMobileNavOptional();
  const activeFeature = getActiveFeature(activeTool, pathname);

  if (!isMobile || !activeTool) {
    return null;
  }

  const handleToggle = () => {
    mainNav?.close();
    toggle();
  };

  return (
    <div className="ls-feature-nav-bar">
      <button
        type="button"
        className={`ls-feature-nav-bar__toggle${isOpen ? ' is-open' : ''}`}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls="lsMobileFeatureNav"
        aria-label={
          isOpen
            ? 'Close module navigation menu'
            : `Open ${activeTool.name} navigation menu`
        }
      >
        <span className="ls-feature-nav-bar__toggle-icon" aria-hidden="true">
          <ToolHeaderIcon name={activeTool.icon} size={16} />
        </span>
        <span className="ls-feature-nav-bar__toggle-copy">
          <span className="ls-feature-nav-bar__tool-name">{activeTool.name}</span>
          <span className="ls-feature-nav-bar__page-name">
            {activeFeature?.name ?? 'Select page'}
          </span>
        </span>
        <span className="ls-feature-nav-bar__menu-icon" aria-hidden="true">
          {isOpen ? <LayoutGrid size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
    </div>
  );
}

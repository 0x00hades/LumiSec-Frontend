import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useActiveTool } from '../context/ToolContext';
import { useMobileFeatureNav } from './MobileFeatureNavContext';
import ToolFeatureNavLinks from './ToolFeatureNavLinks';
import { ToolHeaderIcon } from './toolNavIcons';

export const MOBILE_FEATURE_NAV_ID = 'lsMobileFeatureNav';

export default function MobileFeatureNav() {
  const { isOpen, isMobile, close } = useMobileFeatureNav();
  const activeTool = useActiveTool();

  if (!isMobile || !activeTool) {
    return null;
  }

  return createPortal(
    <>
      <button
        type="button"
        className={`ls-feature-nav-backdrop${isOpen ? ' is-visible' : ''}`}
        aria-label="Close module navigation menu"
        tabIndex={isOpen ? 0 : -1}
        onClick={close}
      />

      <aside
        id={MOBILE_FEATURE_NAV_ID}
        className={`ls-feature-nav${isOpen ? ' is-open' : ''}`}
        aria-hidden={!isOpen}
        aria-modal="true"
        role="dialog"
        aria-labelledby="lsMobileFeatureNavLabel"
      >
        <div className="ls-feature-nav__header">
          <div className="ls-feature-nav__brand">
            <span className="ls-feature-nav__tool-icon" aria-hidden="true">
              <ToolHeaderIcon name={activeTool.icon} size={18} />
            </span>
            <div className="ls-feature-nav__titles">
              <p className="ls-feature-nav__eyebrow mb-0">{activeTool.name}</p>
              <h2 className="ls-feature-nav__title mb-0" id="lsMobileFeatureNavLabel">
                Module Pages
              </h2>
            </div>
          </div>
          <button
            type="button"
            className="ls-feature-nav__close ls-topbar__icon-btn"
            onClick={close}
            aria-label="Close module navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="ls-feature-nav__body" aria-label={`${activeTool.name} pages`}>
          <ToolFeatureNavLinks
            activeTool={activeTool}
            linkClassName="ls-feature-nav__link"
            iconClassName="ls-feature-nav__link-icon"
            onNavigate={close}
          />
        </nav>
      </aside>
    </>,
    document.body
  );
}

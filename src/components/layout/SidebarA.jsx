import React from 'react';
import { useActiveTool } from '../context/ToolContext';
import ToolFeatureNavLinks from './ToolFeatureNavLinks';
import { ToolHeaderIcon } from './toolNavIcons';

export default function SidebarA() {
  const activeTool = useActiveTool();
  const isHidden = !activeTool;

  return (
    <aside
      className={`ls-sidebar-a${isHidden ? ' hidden' : ''}`}
      aria-label={activeTool ? `${activeTool.name} navigation` : 'Tool navigation'}
    >
      {activeTool && (
        <>
          <div className="ls-sidebar-a__header icon-title icon-title--block">
            <div className="ls-sidebar-a__tool-icon icon-title__icon">
              <ToolHeaderIcon name={activeTool.icon} size={16} />
            </div>
            <span className="ls-sidebar-a__tool-name">{activeTool.name}</span>
          </div>

          <nav className="ls-sidebar-a__nav">
            <ToolFeatureNavLinks activeTool={activeTool} />
          </nav>
        </>
      )}
    </aside>
  );
}

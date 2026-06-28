import React from 'react';
import { NavLink } from 'react-router-dom';
import { FeatureIcon } from './toolNavIcons';

export default function ToolFeatureNavLinks({
  activeTool,
  linkClassName = 'ls-sidebar-a__link icon-title icon-title--block',
  iconClassName = 'ls-sidebar-a__link-icon icon-title__icon',
  onNavigate,
}) {
  if (!activeTool) return null;

  return activeTool.features.map((feature) => (
    <NavLink
      key={feature.id}
      to={feature.path}
      end={feature.path === activeTool.path}
      className={({ isActive }) => `${linkClassName}${isActive ? ' active' : ''}`}
      onClick={onNavigate}
    >
      <span className={iconClassName}>
        <FeatureIcon name={feature.icon} size={16} />
      </span>
      {feature.name}
    </NavLink>
  ));
}

import React from 'react';
import { Link } from 'react-router-dom';
import { usePermissions } from './usePermissions';

export default function AccessDenied({ message }) {
  const { defaultPath, role } = usePermissions();

  return (
    <div className="lumisec-access-denied">
      <h2>Access Denied</h2>
      <p>{message ?? 'You do not have permission to view this module.'}</p>
      <p className="text-secondary small">Current role: {role}</p>
      {defaultPath && defaultPath !== '/' && (
        <Link to={defaultPath} className="btn btn-sm btn-primary mt-3">
          Go to your dashboard
        </Link>
      )}
    </div>
  );
}

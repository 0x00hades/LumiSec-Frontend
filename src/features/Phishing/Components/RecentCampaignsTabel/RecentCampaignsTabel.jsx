import React from 'react';
import { Link } from 'react-router-dom';
import "./RecentCampaignsTabel.css";
import { calcRate } from '../../utils/normalizers';

function statusClass(status) {
  const s = String(status ?? '').toUpperCase();
  if (s === 'RUNNING' || s === 'SCHEDULED') return 'active-status';
  if (s === 'COMPLETED') return 'completed-status';
  if (s === 'PAUSED') return 'paused-status';
  return 'draft-status';
}

export default function RecentCampaignsTabel({ campaigns = [] }) {
  const rows = campaigns.slice(0, 5);

  return (
    <>
      <div className='d-flex justify-content-between align-items-center'>
        <div>
          <h6 className='text-white mb-2'>Recent Campaigns</h6>
          <p>Latest simulation performance</p>
        </div>
        <Link to="/Phishing/Campaigns" className='purple-number text-decoration-none'>View all →</Link>
      </div>

      <div className="table-responsive-wrapper">
        <table className="w-100 recent-campigns discover-tabel">
          <thead>
            <tr>
              <th className='p-3'>Campaign</th>
              <th>Sent</th>
              <th>Open Rate</th>
              <th>Click Rate</th>
              <th>Submit Rate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {!rows.length && (
              <tr>
                <td colSpan={6} className="text-secondary text-center py-4">No campaigns yet</td>
              </tr>
            )}
            {rows.map((c) => (
              <tr key={c.id}>
                <td className='ip-address text-white fw-medium px-1'>
                  <Link to={`/Phishing/Campaigns/${c.id}`} className="text-white text-decoration-none">{c.name}</Link>
                </td>
                <td className='mac-address text-secondary text-center'>{c.sentCount ?? c.sent}</td>
                <td className='text-white text-center'><p className='purple-number mb-0'>{calcRate(c.opened, c.sent)}%</p></td>
                <td className='text-white text-center'><p className='orange-number mb-0'>{calcRate(c.clicked, c.sent)}%</p></td>
                <td className='text-white text-center'><p className='red-number mb-0'>{calcRate(c.submitted, c.sent)}%</p></td>
                <td className='py-3 px-1'>
                  <p className={`${statusClass(c.status)} w-fit-content rounded-3 mb-0 ps-4 text-capitalize`}>
                    {String(c.status ?? 'draft').toLowerCase()}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

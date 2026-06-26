import React from 'react';
import "./CampaignFunnel.css";
import { formatNumber } from '../../utils/normalizers';

function FunnelRow({ label, count, percent, barClass, numberClass }) {
  const width = Math.min(100, Math.max(0, percent));
  return (
    <div className='mb-3'>
      <div className='d-flex justify-content-between align-items-center'>
        <p>{label}</p>
        <p><span className={`${numberClass} me-1`}>{formatNumber(count)}</span>({percent}%)</p>
      </div>
      <div className="progress">
        <div
          className={`progress-bar ${barClass}`}
          role="progressbar"
          style={{ width: `${width}%` }}
          aria-valuenow={width}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
}

export default function CampaignFunnel({ funnel, overview }) {
  const sent = funnel?.sent ?? overview?.emailsSent ?? 0;
  const opened = funnel?.opened ?? 0;
  const clicked = funnel?.clicked ?? 0;
  const submitted = funnel?.submitted ?? 0;

  const openPct = sent ? Math.round((opened / sent) * 100) : 0;
  const clickPct = sent ? Math.round((clicked / sent) * 100) : 0;
  const submitPct = sent ? Math.round((submitted / sent) * 100) : 0;

  return (
    <>
      <h6 className='text-white mb-2'>Campaign Funnel</h6>
      <p>Email → Submission conversion</p>

      <FunnelRow label="Opened" count={opened} percent={openPct} barClass="progress-bar-blue" numberClass="blue-number" />
      <FunnelRow label="Clicked Link" count={clicked} percent={clickPct} barClass="progress-bar-purple" numberClass="purple-number" />
      <FunnelRow label="Submitted Data" count={submitted} percent={submitPct} barClass="progress-bar-orange" numberClass="orange-number" />
      <FunnelRow label="Emails Sent" count={sent} percent={sent ? 100 : 0} barClass="progress-bar-red" numberClass="red-number" />
    </>
  );
}

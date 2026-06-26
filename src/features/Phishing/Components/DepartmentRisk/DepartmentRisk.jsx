import React from 'react';
import "./DepartmentRisk.css";

function riskBarClass(vulnerability) {
  if (vulnerability >= 70) return { bar: 'progress-bar-red', text: 'red-number' };
  if (vulnerability >= 50) return { bar: 'progress-bar-orange', text: 'orange-number' };
  return { bar: 'progress-bar-green', text: 'green-number' };
}

export default function DepartmentRisk({ departments = [] }) {
  const rows = departments.slice(0, 6);

  return (
    <>
      <h6 className='text-white mb-2'>Department Risk</h6>
      <p>Submission rate by department</p>

      {!rows.length && <p className="text-secondary">No department data</p>}

      {rows.map((d) => {
        const { bar, text } = riskBarClass(d.vulnerability);
        const width = Math.min(100, Math.max(0, d.vulnerability));
        return (
          <div key={d.department} className='mb-3'>
            <div className='d-flex justify-content-between align-items-center'>
              <p>{d.department}</p>
              <p className={`${text} fw-medium`}>{d.vulnerability}%</p>
            </div>
            <div className="progress">
              <div
                className={`progress-bar ${bar}`}
                role="progressbar"
                style={{ width: `${width}%` }}
                aria-valuenow={width}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

import React from 'react'
import "./RemedationTabel.css"
import { riskStatusClass } from '../../utils/normalizers'

export default function RemedationTabel({ tasks = [], loading = false, onComplete, onVerify }) {
  return <>
  
  <div className='rounded-3 overflow-hidden'>
  <table className='w-100 RemedationTabel'>
    <thead>
        <tr>
            <th>Control ID</th>
            <th className=''>Finding</th>
            <th>Risk</th>
            <th>Assigned To</th>
            <th>Due Date</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        {!loading && tasks.length === 0 && (
            <tr>
                <td colSpan={6}>No remediation tasks found.</td>
            </tr>
        )}
        {tasks.map((row) => (
            <tr key={row.id ?? `${row.controlId}-${row.dueDate}`}>
                <td>{row.controlId}</td>
                <td>{row.finding}</td>
                <td className={`risk-td ${riskStatusClass(row.risk)} p-0`}> <p>{row.risk}</p></td>
                <td>{row.assignedTo}</td>
                <td>{row.dueDate}</td>
                <td
                    className={`risk-td ${riskStatusClass(row.status)} p-0`}
                    onDoubleClick={() => {
                        if (!row.id) return
                        const status = String(row.status).toLowerCase()
                        if (status.includes("complete") && onVerify) onVerify(row.id)
                        else if (onComplete) onComplete(row.id)
                    }}
                >
                    <p>{row.status}</p>
                </td>
            </tr>
        ))}
    </tbody>
  </table>
  
  </div>
  
  </>
}

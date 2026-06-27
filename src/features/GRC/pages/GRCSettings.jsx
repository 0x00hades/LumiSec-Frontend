import React from 'react'
import "./GRCSettings.css"
import ProfileModal from '../components/ProfileModal/ProfileModal'
import useAuditLogs from '../hooks/useAuditLogs'

export default function GRCSettings() {
    const { logs, loading } = useAuditLogs()

return <>
    <div>
        <h1 className='text-white fs-2'>Settings</h1>
        <ul className="nav mb-4" id="myTab" role="tablist">
            <li className="nav-item">
                <a className="nav-link active" data-bs-toggle="tab" href="#Profile">Profile</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab"  href="#UserManagement">User Management</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" href="#Integrations">Integrations</a>
            </li>
        </ul>

        <div className="tab-content" id="pills-tabContent">
            <div className="tab-pane fade show active" id="Profile" role="tabpanel" aria-labelledby="Profile"><ProfileModal /> </div>
            <div className="tab-pane fade text-white" id="UserManagement" role="tabpanel" aria-labelledby="UserManagement">
                {loading && "Loading audit logs..."}
                {!loading && logs.length === 0 && "No audit logs found."}
                {!loading && logs.map((log) => (
                    <p key={log.id} className="mb-2">
                        {log.timestamp ? `${log.timestamp} — ` : ""}{log.action} ({log.entityType}/{log.entityId}) by {log.user}
                    </p>
                ))}
            </div>
            <div className="tab-pane fade text-white" id="Integrations" role="tabpanel" aria-labelledby="Integrations">Integrations</div>
        </div>
    </div>

</>
}

import React, { useCallback, useMemo, useRef, useState } from 'react'
import AuditCard from '../components/AuditCard/AuditCard'
import AuditAccordion from '../components/AuditAccordion/AuditAccordion'
import useReports from '../hooks/useReports'
import useCompliance from '../hooks/useCompliance'
import {
  computeControlsProgress,
  getControlKey,
  groupControlsBySection,
  toApiControlStatus,
} from '../utils/normalizers'

export default function GRCAudits() {
    const { reports, loading: reportsLoading, updateReport } = useReports()
    const {
      controls,
      loading: controlsLoading,
      actionLoading,
      updateControl,
      reload,
      reloadStatus,
    } = useCompliance()

    const [pendingStatuses, setPendingStatuses] = useState({})
    const [saving, setSaving] = useState(false)
    const pendingStatusesRef = useRef(pendingStatuses)

    pendingStatusesRef.current = pendingStatuses

    const activeReport = reports[0]

    const effectiveControls = useMemo(
      () =>
        controls.map((control) => {
          const controlKey = getControlKey(control)
          return {
            ...control,
            id: controlKey ?? control.id,
            status: controlKey != null && Object.prototype.hasOwnProperty.call(pendingStatuses, controlKey)
              ? pendingStatuses[controlKey]
              : control.status,
          }
        }),
      [controls, pendingStatuses]
    )

    const groupedControls = groupControlsBySection(effectiveControls)
    const sections = Object.keys(groupedControls)

    const progressPercent = computeControlsProgress(effectiveControls)

    const handleStatusChange = useCallback((controlId, newStatus) => {
      if (!controlId) return
      setPendingStatuses((prev) => ({
        ...prev,
        [String(controlId)]: newStatus,
      }))
    }, [])

    const handleSaveProgress = useCallback(async () => {
      console.log("SAVE PROGRESS CLICKED")

      const pendingEntries = Object.entries(pendingStatusesRef.current)
      console.log("Pending statuses:", pendingEntries)

      setSaving(true)
      try {
        if (pendingEntries.length) {
          for (const [controlId, status] of pendingEntries) {
            await updateControl(controlId, { status: toApiControlStatus(status) })
          }
          setPendingStatuses({})
        }

        await reload()
        await reloadStatus()

        if (activeReport?.id) {
          try {
            await updateReport(activeReport.id, { progress: progressPercent })
          } catch (reportError) {
            console.error("Report progress update failed:", reportError)
          }
        }
      } catch (error) {
        console.error("Save progress failed:", error)
      } finally {
        setSaving(false)
      }
    }, [
      activeReport?.id,
      progressPercent,
      reload,
      reloadStatus,
      updateControl,
      updateReport,
    ])

    const isSaving = saving || actionLoading
    const visibleSections = controlsLoading && controls.length === 0 ? [] : sections

return <>
    
    <div className='ps-0'>

        <h2 className='text-white mb-5'>
            Active Audits
        </h2>

        <div className='mb-3'>

            <AuditCard
                title={reportsLoading ? "Loading audit..." : activeReport?.title ?? "No active audits"}
                desc={activeReport?.desc ?? "Assigned to: — | Due: —"}
                progrssText={`Progress: ${progressPercent}%`}
                progressPercent={progressPercent}
                onSaveProgress={handleSaveProgress}
                saving={isSaving}
            />

        </div>

        {visibleSections.map((section, index) => (
            <AuditAccordion
                key={section}
                title={section}
                id={`collapse${index + 1}`}
                controls={groupedControls[section] ?? []}
                onStatusChange={handleStatusChange}
                statusUpdating={isSaving}
            />
        ))}

    </div>

</>
}

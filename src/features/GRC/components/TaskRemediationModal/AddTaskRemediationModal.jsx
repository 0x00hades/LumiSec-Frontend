import React, { useState } from 'react'
import "./AddTaskRemediationModal.css"
import { Upload } from 'lucide-react'
import { toTaskPayload } from '../../utils/normalizers'

export default function AddTaskRemediationModal({ onCreate, onUpload, onSuccess }) {
    const [form, setForm] = useState({
        controlId: "",
        riskLevel: "High",
        description: "",
        assignedTo: "",
        dueDate: "",
        status: "Open",
        remediationPlan: "",
    })
    const [submitting, setSubmitting] = useState(false)

    const updateField = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0]
        if (!file || !onUpload) return
        await onUpload(file, { controlId: form.controlId || undefined })
    }

    const handleSubmit = async () => {
        if (!onCreate) return
        setSubmitting(true)
        try {
            await onCreate(toTaskPayload({
                controlId: form.controlId,
                riskLevel: form.riskLevel,
                finding: form.description,
                description: form.description,
                assignedTo: form.assignedTo || undefined,
                dueDate: form.dueDate || undefined,
                status: form.status,
                remediationPlan: form.remediationPlan || undefined,
            }))
            onSuccess?.()
            setForm({
                controlId: "",
                riskLevel: "High",
                description: "",
                assignedTo: "",
                dueDate: "",
                status: "Open",
                remediationPlan: "",
            })
        } finally {
            setSubmitting(false)
        }
    }

return <>
  
<div
    className="modal fade"
    id="AddTaskRemediationModal"
    tabIndex="-1"
    aria-hidden="true"
>

    <div className="modal-dialog modal-dialog-centered AddTaskRemediationModal" role="document">

        <div className="modal-content">

            <div className="modal-header border-0">

                <h5 className="modal-title text-white">
                    Create Remediation Task
                </h5>

                <button
                    type="button"
                    className="btn-close btn-close-white"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                ></button>

            </div>

            <div className="modal-body border-0">

                <form action="" onSubmit={(e) => e.preventDefault()}>

                    <div className='row justify-content-between align-items-center'>
                        <div className='col-6'>
                            <label htmlFor="ControlID" className='d-block mb-2'>
                                Control ID
                            </label>
                        </div>
                        <div className='col-6'>
                            <label htmlFor="RiskLevel" className='d-block mb-2'>
                                Risk Level
                            </label>
                        </div>
                    </div>


                    <div className='d-flex justify-content-arou align-items-center mb-4'>
                        <input className='form-control border-0 me-3' type="text" placeholder='Type to search Control ID...' name="" id="ControlID" value={form.controlId} onChange={updateField("controlId")} />
                        <input className='form-control border-0' type="text" value={form.riskLevel} onChange={updateField("riskLevel")} name="" id="RiskLevel" />
                    </div>

                    <label htmlFor="Description" className='d-block mb-2'>
                        Finding / Description
                    </label>
                    <input className='form-control border-0 mb-4' type="text"  name="" id="Description" placeholder='Brief description of the issue...' value={form.description} onChange={updateField("description")} />


                    <div className='row justify-content-between align-items-center'>
                        <div className="col-6">
                            <label htmlFor="AssignedTo" className='d-block mb-2'>
                                Assigned To
                            </label>
                        </div>
                        <div className="col-6">
                            <label htmlFor="DueDate" className='d-block mb-2'>
                                Risk Level
                            </label>
                        </div>
                        
                    </div>


                    <div className='row justify-content-between align-items-center mb-4'>
                        <div className='col-6'>
                            <select
                                id='AssignedTo'
                                className='form-select bg-dark text-white border-0 me-3'
                                value={form.assignedTo}
                                onChange={updateField("assignedTo")}
                            >
                                <option value="" disabled>
                                    -- Choose a framework --
                                </option>
                            </select> 
                        </div>
                        <div className='col-6'>
                            <input className='form-control border-0' type="date" name="" id="DueDate" value={form.dueDate} onChange={updateField("dueDate")} />
                        </div>                      
                </div>


                    <label htmlFor="Status" className='d-block mb-2'>
                        Status
                    </label>
                    <input className='form-control border-0 mb-4' type="text"  name="" value={form.status} onChange={updateField("status")} id="Status" />


                    <label htmlFor="RemediationPlan" className='d-block mb-2'>
                        Remediation Plan (Optional)
                    </label>
                    <textarea className='form-control mb-4 border-0' name="" id="RemediationPlan" placeholder='Steps required to fix this issue...' value={form.remediationPlan} onChange={updateField("remediationPlan")}></textarea>

                    <div className="upload-box">

                        <label htmlFor="Upload" className="upload-label">

                            <Upload size={40} className='mb-3' />

                            <small className="text-secondary">
                                Click to browse or drag & drop (.xlsx, .csv)
                            </small>

                        </label>

                        <input
                            id="Upload"
                            type="file"
                            className="d-none"
                            onChange={handleFileChange}
                        />

                    </div>

                </form>

            </div>

            <div className="modal-footer border-0">

                <button
                    type="button"
                    className="btn import-btn border-0 btn-primary"
                    data-bs-dismiss="modal"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className='btn add-btn text-white border-0'
                    onClick={handleSubmit}
                    disabled={submitting || !form.controlId || !form.description}
                >
                    Add Task
                </button>

            </div>

        </div>

    </div>

</div>
  
</>
}

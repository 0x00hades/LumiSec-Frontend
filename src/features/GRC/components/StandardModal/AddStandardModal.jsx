import React, { useState } from 'react'
import "./AddNewStandardModal.css"
import { Upload } from 'lucide-react'
import { toControlPayload } from '../../utils/normalizers'

export default function AddStandardModal({ onCreate, onSuccess }) {
    const [framework, setFramework] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!onCreate || !framework) return
        setSubmitting(true)
        try {
            await onCreate(toControlPayload({ framework }))
            onSuccess?.()
            setFramework("")
        } finally {
            setSubmitting(false)
        }
    }

return <>
  
<div
    className="modal fade"
    id="addStandardModal"
    tabIndex="-1"
    aria-hidden="true"
>

    <div className="modal-dialog modal-dialog-centered" role="document">

        <div className="modal-content">

            <div className="modal-header border-0">

                <h5 className="modal-title text-white">
                    Add New Standard
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

                    <label htmlFor="select" className='d-block mb-2'>
                        Select from Library
                    </label>

                    <select
                        id='select'
                        className='form-control form-select bg-dark text-white mb-3 border-0'
                        value={framework}
                        onChange={(e) => setFramework(e.target.value)}
                    >
                        <option value="" disabled>
                            -- Choose a framework --
                        </option>
                        <option value="ISO27001">ISO 27001:2022</option>
                        <option value="PCI_DSS">PCI-DSS v4.0</option>
                        <option value="SOC2">SOC 2</option>
                        <option value="NIST">NIST CSF 1.1</option>
                    </select>

                    <p className='text-secondary text-center position-relative sepration-text'>
                        OR
                    </p>

                    <label htmlFor="Upload" className="mb-3">
                        Upload Custom Framework
                    </label>

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
                    disabled={submitting || !framework}
                >
                    Add Standard
                </button>

            </div>

        </div>

    </div>

</div>
  
</>
}

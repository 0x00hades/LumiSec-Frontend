import React, { useState } from 'react'
import "./AuditAccordion.css"
import {
  controlStatusClass,
  controlStatusLabel,
  cycleControlStatus,
  getControlKey,
} from '../../utils/normalizers'

export default function AuditAccordion ({title , id, controls = [], onStatusChange, statusUpdating = false}) {

const [isDown , setIsDown] = useState(true)
const safeControls = Array.isArray(controls) ? controls : []

const handleStatusClick = (control) => {
    const controlKey = getControlKey(control)
    if (!controlKey || !onStatusChange || statusUpdating) return
    const newStatus = cycleControlStatus(control.status)
    onStatusChange(controlKey, newStatus)
}

return <> 

<div id="accordion" className='mb-3'>

    <div className="card audit-accordion w-100">

        <div className="card-header" id="headingOne">

            <h5 className="mb-0">

                <div className='d-flex justify-content-between align-items-center gap-3'>

                    <button
                        type="button"
                        onClick={()=>{
                            setIsDown(!isDown)
                        }}
                        className="btn btn-link text-decoration-none text-white w-100 text-start accordion-btn"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${id}`}
                        aria-expanded="true"
                        aria-controls={`#${id}`}
                    >
                        {title}
                    </button>

                    {
                        isDown
                        ?
                        <i className="fa-solid fa-angle-down accordion-icon"></i>
                        :
                        <i className="fa-solid fa-angle-up accordion-icon"></i>
                    }

                </div>

            </h5>

        </div>

        <div
            id={`${id}`}
            className="collapse"
            aria-labelledby="headingOne"
            data-parent={`#${id}`}
        >

            <div className="card-body ps-2 ps-md-4 ps-lg-5">

                {safeControls.length === 0 && (
                    <p className='mb-0'>No controls available.</p>
                )}

                {safeControls.map((control, index) => {
                    const controlKey = getControlKey(control)

                    return (
                    <React.Fragment key={controlKey ?? control.code ?? index}>
                        {index > 0 && <hr />}

                        <div className='d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3'>

                            <div className='d-flex justify-content-between align-items-start w-100'>

                                <div>

                                    <h5 className='me-3 mb-1'>
                                        {control.code}
                                    </h5>

                                    <p className='mb-0'>
                                        {control.title}
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    className={`${controlStatusClass(control.status)} p-2 py-1 btn text-white flex-shrink-0`}
                                    onClick={() => handleStatusClick(control)}
                                    disabled={!controlKey || !onStatusChange || statusUpdating}
                                >
                                    {controlStatusLabel(control.status)}
                                </button>

                            </div>

                        </div>
                    </React.Fragment>
                    )
                })}

            </div>

        </div>

    </div>

</div>

</>
}

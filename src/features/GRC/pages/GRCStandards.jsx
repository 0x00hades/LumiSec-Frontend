import React from 'react'
import StandardsCard from '../components/StandardsCard/StandardsCard'
import "./GRCStandards.css"
import AddStandardModal from '../components/StandardModal/AddStandardModal'
import useCompliance from '../hooks/useCompliance'

export default function GRCStandards() {
    const { frameworks, loading, createControl, reloadStatus } = useCompliance()

return <>
    
    <div>

        <div className='d-flex justify-content-between align-items-center mb-4 mb-lg-5 standards-header gap-3'>

            <h1 className='text-white mb-0'>
                Standards Library
            </h1>

            <button
                className='btn add-btn text-white border-0'
                data-bs-toggle="modal"
                data-bs-target="#addStandardModal"
            >
                <i className="fa-solid fa-plus me-2"></i>
                Add Standard
            </button>

        </div>

        <div className='row g-4'>

            {!loading && frameworks.length === 0 && (
                <div className='col-12 text-white'>No standards found.</div>
            )}

            {frameworks.map((framework) => (
                <StandardsCard
                    key={framework.id}
                    backgroundColor={framework.backgroundColor}
                    type={framework.type}
                    title={framework.title}
                    desc={framework.desc}
                    progressTitle={framework.progressTitle}
                    progressPercent={framework.progressPercent}
                    Controls={framework.Controls}
                />
            ))}

        </div>

    </div>

    <AddStandardModal onCreate={createControl} onSuccess={reloadStatus} />

</>
}

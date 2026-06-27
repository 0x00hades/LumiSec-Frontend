import React from 'react'
import AddTaskRemediationModal from '../components/TaskRemediationModal/AddTaskRemediationModal'
import RemedationTabel from '../components/RemedationTabel/RemedationTabel'
import useTasks from '../hooks/useTasks'
import useEvidence from '../hooks/useEvidence'

export default function GRCRemediation() {
    const { tasks, loading, createTask, completeTask, verifyTask, reload } = useTasks()
    const { upload } = useEvidence()

return <>
    <div className='d-flex justify-content-between align-items-center mb-5'>
                <h1 className='text-white'>Standards Library</h1>
                <button className='btn add-btn text-white border-0' data-bs-toggle="modal" data-bs-target="#AddTaskRemediationModal"><i className="fa-solid fa-plus me-2"></i>New Task</button>
    </div>
    <div>
        <RemedationTabel
            tasks={tasks}
            loading={loading}
            onComplete={completeTask}
            onVerify={verifyTask}
        />
    </div>


<AddTaskRemediationModal onCreate={createTask} onUpload={upload} onSuccess={reload} />

</>
}

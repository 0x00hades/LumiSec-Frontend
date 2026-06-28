import React from 'react'
import "./Recipient.css"
import RecipientContent from '../Components/RecipientTabel/RecipientTabel'

export default function Recipients() {
  return <>
  
  <div className='d-flex justify-content-between align-items-center mb-3'>
          <div>
              <h5 className='text-white'>Recipients</h5>
              <p className='dashboard-desc'>8 total · 1 invalid emails</p>
          </div>
          <div className='d-flex align-items-center'>

            <button className='btn import-btn text-white border-0 me-3'>
                        <i className="fa-solid fa-upload me-2"></i>
                        Import CSV
            </button>


            <button className='btn add-btn text-white border-0'>
                        <i className="fa-solid fa-plus me-2"></i>
                        Add Recipient
            </button>
          
          </div>
      </div>


              <ul className="nav mb-4 ls-nav-tabs-scroll" id="myTab" role="tablist">
            <li className="nav-item">
                <a className="nav-link active" data-bs-toggle="tab" href="#RecipientsList">Recipients List</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab"  href="#Groups">Groups</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" href="#ImportCSV">Import CSV</a>
            </li>
        </ul>

    <div className="tab-content" id="pills-tabContent">
        <div className="tab-pane fade show active" id="RecipientsList" role="tabpanel" aria-labelledby="RecipientsList"><RecipientContent /> </div>
        <div className="tab-pane fade text-white" id="Groups" role="tabpanel" aria-labelledby="Groups">Groups</div>
        <div className="tab-pane fade text-white" id="ImportCSV" role="tabpanel" aria-labelledby="ImportCSV">Import CSV</div>
    </div>
  
  
  
  </>
}

import React from 'react'
import DashboardCard from '../Components/DashboardCard/DashboardCard'
import CampaignComparisonChart from '../Components/CampaignPerformanceChart/CampaignComparisonChart'
import DepartmentRiskChart from '../Components/DepartmentRiskChart/DepartmentRiskChart'
import TopVulnerableEmployeesTabel from '../Components/TopVulnerableEmployeesTabel/TopVulnerableEmployeesTabel'

export default function Reports() {
  return <>
  

  <div className='px-3'>
  <div className='d-flex justify-content-between align-items-center mb-3'>
          <div>
              <h5 className='text-white'>Recipients</h5>
              <p className='dashboard-desc'>8 total · 1 invalid emails</p>
          </div>
          <div className='d-flex align-items-center'>

            <button className='btn import-btn text-white border-0 me-3'>
                        <i className="fa-solid fa-download me-2"></i>
                        Export PDF
            </button>


            <button className='btn import-btn text-white border-0 me-3'>
                        <i className="fa-solid fa-download me-2"></i>
                        Export Excel
            </button>

            <button className='btn import-btn text-white border-0 me-3'>
                        <i className="fa-solid fa-download me-2"></i>
                        Export CSV
            </button>
          
          </div>
    </div>

    <div className='row justify-content-between align-items-center mb-4'>

        <DashboardCard
            text={"Total Campaigns"}
            Statistics={"12"}        
        />


        <DashboardCard
            text={"Emails Sent"}
            Statistics={"12,540"}        
        />


        <DashboardCard
            text={"Avg Click Rate"}
            Statistics={"31%"}        
        />


        <DashboardCard
            text={"Avg Submission Rate"}
            Statistics={"11%"}        
        />

    </div>


    <div className='row justify-content-between g-3 mb-4'>
        <div className='col-12 col-lg-8'>
            <div className='dashboard-card'>
                <CampaignComparisonChart />
            </div>
        </div>
        <div className='col-12 col-lg-4'>
            <div className='dashboard-card'>
                <DepartmentRiskChart />
            </div>
        </div>
    </div>


    <div className='dashboard-card'>
        <div>
                <h5 className='text-white'>Top Vulnerable Employees</h5>
                <p className='dashboard-desc'>Users who repeatedly fell for simulations</p>
            </div>
        <TopVulnerableEmployeesTabel />
    </div>

    
  </div>
  
  
  </>
}

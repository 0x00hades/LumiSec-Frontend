import React from 'react'
import analysisIcon from "../../../assets/Overlay (6).png"
import sendIcon from "../../../assets/Container.png"
import emailIcon from "../../../assets/Container (1).png"
import clickIcon from "../../../assets/Container (2).png"
import databaseIcon from "../../../assets/Container (3).png"
import infoIcon from "../../../assets/Container (4).png"
import DashboardCard4 from '../Components/DashboardCard4/DashboardCard4'
import "./PhishingDashboard.css"
import CampaignTrendChart from '../Components/CampaignTrendChart/CampaignTrendChart'
import CampaignFunnel from '../Components/CampaignFunnel/CampaignFunnel'
import DepartmentRisk from '../Components/DepartmentRisk/DepartmentRisk'
import RecentCampaignsTabel from '../Components/RecentCampaignsTabel/RecentCampaignsTabel'
export default function PhishingDashboard() {
  return <>
  
  <div className='p-3'>
    <div>
      <h5 className='text-white'>Dashboard</h5>
      <p className='dashboard-desc'>Phishing simulation platform — live overview</p>
    </div>

    <div className='row justify-content-between align-items-center mb-3'> 
          <DashboardCard4
              title={"Active Campaigns"}
              icon={analysisIcon}
              Statistics={"12"}
              text2={"4 ending this week"}
              text3={"▲ 3 more"}
              text4={"vs last month"}
          />


          <DashboardCard4
              title={"Emails Sent"}
              icon={sendIcon}
              Statistics={"12,540"}
              text2={"across 12 campaigns"}
          />



          <DashboardCard4
              title={"Open Rate"}
              icon={emailIcon}
              Statistics={"74%"}
              text2={"Industry avg: 65%"}
              text3={"▼ 9% more"}
              text4={"vs last month"}
            />



          <DashboardCard4
            title={"Click Rate"}
            icon={clickIcon}
            Statistics={"31%"}
            text2={"Industry avg: 41%"}
            text3={"▼ 10% less"}
            text4={"vs last month"}
            
          />


          <DashboardCard4
            title={"Submitted Rate"}
            icon={databaseIcon}
            Statistics={"11%"}
            text2={"Critical threshold: 15%"}
            text3={"▼ 4% less"}
            text4={"vs last month"}
            
          />



          <DashboardCard4
            title={"Risks Created"}
            icon={infoIcon}
            Statistics={"45"}
            text2={"In GRC pipeline"}
            text3={"▼ 12 new"}
            text4={"vs last month"}
            
          />
    </div>

    <div className='row justify-content-between g-3 m-0'>
      <div className='col-12 col-lg-7 dashboard-card mb-3'>
        <CampaignTrendChart />
      </div>

      <div className='col-12 col-lg dashboard-card mb-3'>
        <CampaignFunnel />
      </div>
    </div>


    <div className='row justify-content-between g-3 m-0'>
      <div className='col-12 col-lg-4 dashboard-card mb-3'>
        <DepartmentRisk />
      </div>

      <div className='col-12 col-lg dashboard-card mb-3'>
        <RecentCampaignsTabel />
      </div>
    </div>


  </div>



  
  </>
}

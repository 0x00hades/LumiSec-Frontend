import React from 'react'
import "./RecentCampaignsTabel.css"

export default function RecentCampaignsTabel() {
  return <>
  
  <div className='d-flex justify-content-between align-items-center'>
    <div>
        <h6 className='text-white mb-2'>Recent Campaigns</h6>
        <p>Latest simulation performance</p>
    </div>
    <p className='purple-number'>View all →</p>
  </div>
  
  
  <div className="table-responsive-wrapper">

  <table className="w-100 recent-campigns discover-tabel">
    <thead>
      <tr>
        <th>Campaign</th>
        <th className='text-center'>Sent</th>
        <th className='text-center'>Open Rate</th>
        <th className='text-center'>Click Rate</th>
        <th className='text-center'>Submit Rate</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>

        
    <tr>
            <td className='ip-address text-white fw-medium px-2'>Microsoft Password Reset</td>
            <td className='mac-address text-secondary text-center'>420</td>
            <td className='text-white text-center'><p className='purple-number mb-0'>68%</p></td>
            <td className='text-white text-center'><p className='orange-number mb-0'>31%</p></td>
            <td className='text-white text-center'><p className='red-number mb-0'>12%</p></td>
            <td className='py-3 px-1'><p className='active-status w-fit-content rounded-3 mb-0 ps-4'>Active</p></td>
    </tr>


    <tr>
            <td className='ip-address text-white fw-medium px-2'>HR Salary Update</td>
            <td className='mac-address text-secondary text-center'>310</td>
            <td className='text-white text-center'><p className='purple-number mb-0'>74%</p></td>
            <td className='text-white text-center'><p className='orange-number mb-0'>44%</p></td>
            <td className='text-white text-center'><p className='red-number mb-0'>22%</p></td>
            <td className='py-3 px-1'><p className='active-status w-fit-content rounded-3 mb-0 ps-4'>Active</p></td>
    </tr>



    <tr>
            <td className='ip-address text-white fw-medium px-2'>Netflix Billing Alert</td>
            <td className='mac-address text-secondary text-center'>280</td>
            <td className='text-white text-center'><p className='purple-number mb-0'>61%</p></td>
            <td className='text-white text-center'><p className='orange-number mb-0'>27%</p></td>
            <td className='text-white text-center'><p className='red-number mb-0'>9%</p></td>
            <td className='py-3 px-1'><p className='completed-status w-fit-content rounded-3 mb-0 ps-4'>Completed</p></td>
    </tr>




    <tr>
            <td className='ip-address text-white fw-medium px-2'>VPN Login Required</td>
            <td className='mac-address text-secondary text-center'>195</td>
            <td className='text-white text-center'><p className='purple-number mb-0'>55%</p></td>
            <td className='text-white text-center'><p className='orange-number mb-0'>19%</p></td>
            <td className='text-white text-center'><p className='red-number mb-0'>6%</p></td>
            <td className='py-3 px-1'><p className='completed-status w-fit-content rounded-3 mb-0 ps-4'>Completed</p></td>
    </tr>



    </tbody>
  </table>

</div>
  
  
  
  </>
}

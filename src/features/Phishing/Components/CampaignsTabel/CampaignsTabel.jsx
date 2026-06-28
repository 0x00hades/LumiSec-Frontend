import React from 'react'
import "./CampaignsTabel.css"

export default function CampaignsTabel() {
  return <>
  
  <div className='row g-2 align-items-center search-container mb-3'>
    
    <div className='col-12 col-lg-9'>
        <i className="fa-brands fa-sistrix discover-search-icon"></i>

        <input
            type="text"
            className='form-control header-search-input rounded-3'
            placeholder='Search...'
        />
    </div>
    <div className='col-12 col-lg-3 d-flex flex-wrap gap-2 justify-content-lg-end align-items-center'>
        <button className='all rounded-5 mb-0 me-2 btn'>All</button>
        <button className='inActive-btn rounded-5 mb-0 me-2 btn'>Active</button>
        <button className='inActive-btn rounded-5 mb-0 me-2 btn'>Paused</button>
        <button className='inActive-btn rounded-5 mb-0 me-2 btn'>Completed</button>
        <button className='inActive-btn rounded-5 mb-0 me-2 btn'>Draft</button>
    </div>

    </div>


    <div className="table-responsive-wrapper">

  <table className="w-100 recent-campigns discover-tabel">
    <thead>
      <tr>
      <th>Campaign Name</th>
        <th>Template</th>
        <th>Group</th>
        <th>Sent</th>
        <th>Opened</th>
        <th>Clicked</th>
        <th>Submitted</th>
        <th>Status</th>
        <th>Launched</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>

        
    <tr>
            <td className='ip-address text-white fw-medium px-1'>Microsoft Password Reset</td>
            <td className='ip-address text-secondary fw-medium px-1'>O365 Login</td>
            <td className='ip-address text-secondary fw-medium px-1'>All Employees</td>
            <td className='mac-address text-white text-center'>420</td>
            <td className='text-white text-center'><p className='purple-number mb-0'>68%</p></td>
            <td className='text-white text-center'><p className='orange-number mb-0'>31%</p></td>
            <td className='text-white text-center'><p className='red-number mb-0'>12%</p></td>
            <td className='py-3 px-1'><p className='active-status w-fit-content rounded-3 mb-0 ps-4'>Active</p></td>
            <td className='ip-address text-secondary fw-medium px-1'>2026-06-01</td>
            <td className='vendor'>
                <button className='btn purple-background mx-2'><i class="fa-solid text-white fa-eye"></i></button>
                <button className='btn bg-secondary mx-2'><i class="fa-solid text-white fa-pen-to-square"></i></button>
                <button className='btn orange-background mx-2'><i class="fa-solid text-white fa-pause"></i></button>
                <button className='btn bg-secondary mx-2'><i class="fa-solid text-white fa-chart-simple"></i></button>
                <button className='btn red-background mx-2'><i class="fa-solid text-white fa-trash"></i></button>
            </td>

    </tr>


    <tr>
            <td className='ip-address text-white fw-medium px-1'>HR Salary Update</td>
            <td className='ip-address text-secondary fw-medium px-1'>HR Payroll</td>
            <td className='ip-address text-secondary fw-medium px-1'>Finance Dept</td>
            <td className='mac-address text-white text-center'>310</td>
            <td className='text-white text-center'><p className='purple-number mb-0'>74%</p></td>
            <td className='text-white text-center'><p className='orange-number mb-0'>44%</p></td>
            <td className='text-white text-center'><p className='red-number mb-0'>22%</p></td>
            <td className='py-3 px-1'><p className='active-status w-fit-content rounded-3 mb-0 ps-4'>Active</p></td>
            <td className='ip-address text-secondary fw-medium px-1'>2026-06-03</td>
            <td className='vendor'>
                <button className='btn purple-background mx-2'><i class="fa-solid text-white fa-eye"></i></button>
                <button className='btn bg-secondary mx-2'><i class="fa-solid text-white fa-pen-to-square"></i></button>
                <button className='btn orange-background mx-2'><i class="fa-solid text-white fa-pause"></i></button>
                <button className='btn bg-secondary mx-2'><i class="fa-solid text-white fa-chart-simple"></i></button>
                <button className='btn red-background mx-2'><i class="fa-solid text-white fa-trash"></i></button>
            </td>

    </tr>



    <tr>
            <td className='ip-address text-white fw-medium px-1'>Netflix Billing Alert</td>
            <td className='ip-address text-secondary fw-medium px-1'>Netflix</td>
            <td className='ip-address text-secondary fw-medium px-1'>Marketing Dept</td>
            <td className='mac-address text-white text-center'>280</td>
            <td className='text-white text-center'><p className='purple-number mb-0'>61%</p></td>
            <td className='text-white text-center'><p className='orange-number mb-0'>27%</p></td>
            <td className='text-white text-center'><p className='red-number mb-0'>9%</p></td>
            <td className='py-3 px-1'><p className='completed-status w-fit-content rounded-3 mb-0 ps-4'>Completed</p></td>
            <td className='ip-address text-secondary fw-medium px-1'>2026-05-20</td>
            <td className='vendor'>
                <button className='btn purple-background mx-2'><i class="fa-solid text-white fa-eye"></i></button>
                <button className='btn bg-secondary mx-2'><i class="fa-solid text-white fa-pen-to-square"></i></button>
                <button className='btn green-background mx-2'><i class="fa-solid text-white fa-play"></i></button>
                <button className='btn bg-secondary mx-2'><i class="fa-solid text-white fa-chart-simple"></i></button>
                <button className='btn red-background mx-2'><i class="fa-solid text-white fa-trash"></i></button>
            </td>

    </tr>


    <tr>
            <td className='ip-address text-white fw-medium px-1'>VPN Login Required</td>
            <td className='ip-address text-secondary fw-medium px-1'>VPN Portal</td>
            <td className='ip-address text-secondary fw-medium px-1'>Engineering Dept</td>
            <td className='mac-address text-white text-center'>195</td>
            <td className='text-white text-center'><p className='purple-number mb-0'>55%</p></td>
            <td className='text-white text-center'><p className='orange-number mb-0'>19%</p></td>
            <td className='text-white text-center'><p className='red-number mb-0'>6%</p></td>
            <td className='py-3 px-1'><p className='completed-status w-fit-content rounded-3 mb-0 ps-4'>Completed</p></td>
            <td className='ip-address text-secondary fw-medium px-1'>2026-05-15</td>
            <td className='vendor'>
                <button className='btn purple-background mx-2'><i class="fa-solid text-white fa-eye"></i></button>
                <button className='btn bg-secondary mx-2'><i class="fa-solid text-white fa-pen-to-square"></i></button>
                <button className='btn green-background mx-2'><i class="fa-solid text-white fa-play"></i></button>
                <button className='btn bg-secondary mx-2'><i class="fa-solid text-white fa-chart-simple"></i></button>
                <button className='btn red-background mx-2'><i class="fa-solid text-white fa-trash"></i></button>
            </td>

    </tr>



    <tr>
            <td className='ip-address text-white fw-medium px-1'>LinkedIn Hiring Campaign</td>
            <td className='ip-address text-secondary fw-medium px-1'>LinkedIn Job</td>
            <td className='ip-address text-secondary fw-medium px-1'>HR Dept</td>
            <td className='mac-address text-white text-center'>150</td>
            <td className='text-white text-center'><p className='purple-number mb-0'>60%</p></td>
            <td className='text-white text-center'><p className='orange-number mb-0'>35%</p></td>
            <td className='text-white text-center'><p className='red-number mb-0'>12%</p></td>
            <td className='py-3 px-1'><p className=' paused-status w-fit-content rounded-3 mb-0 ps-4'>Paused</p></td>
            <td className='ip-address text-secondary fw-medium px-1'>2026-06-05</td>
            <td className='vendor'>
                <button className='btn purple-background mx-2'><i class="fa-solid text-white fa-eye"></i></button>
                <button className='btn bg-secondary mx-2'><i class="fa-solid text-white fa-pen-to-square"></i></button>
                <button className='btn orange-background mx-2'><i class="fa-solid text-white fa-pause"></i></button>
                <button className='btn bg-secondary mx-2'><i class="fa-solid text-white fa-chart-simple"></i></button>
                <button className='btn red-background mx-2'><i class="fa-solid text-white fa-trash"></i></button>
            </td>

    </tr>



    <tr>
            <td className='ip-address text-white fw-medium px-1'>IT Security Update</td>
            <td className='ip-address text-secondary fw-medium px-1'>IT Notice</td>
            <td className='ip-address text-secondary fw-medium px-1'>All Employees</td>
            <td className='mac-address text-white text-center'>500</td>
            <td className='text-white text-center'><p className='purple-number mb-0'>70%</p></td>
            <td className='text-white text-center'><p className='orange-number mb-0'>29%</p></td>
            <td className='text-white text-center'><p className='red-number mb-0'>12%</p></td>
            <td className='py-3 px-1'><p className='active-status w-fit-content rounded-3 mb-0 ps-4'>Active</p></td>
            <td className='ip-address text-secondary fw-medium px-1'>2026-06-07</td>
            <td className='vendor'>
                <button className='btn purple-background mx-2'><i class="fa-solid text-white fa-eye"></i></button>
                <button className='btn bg-secondary mx-2'><i class="fa-solid text-white fa-pen-to-square"></i></button>
                <button className='btn orange-background mx-2'><i class="fa-solid text-white fa-pause"></i></button>
                <button className='btn bg-secondary mx-2'><i class="fa-solid text-white fa-chart-simple"></i></button>
                <button className='btn red-background mx-2'><i class="fa-solid text-white fa-trash"></i></button>
            </td>

    </tr>


    <tr>
            <td className='ip-address text-white fw-medium px-1'>AWS Console Alert</td>
            <td className='ip-address text-secondary fw-medium px-1'>AWS Phish</td>
            <td className='ip-address text-secondary fw-medium px-1'>Engineering Dept</td>
            <td className='mac-address text-white text-center'>88</td>
            <td className='text-white text-center'><p className='purple-number mb-0'>59%</p></td>
            <td className='text-white text-center'><p className='orange-number mb-0'>32%</p></td>
            <td className='text-white text-center'><p className='red-number mb-0'>11%</p></td>
            <td className='py-3 px-1'><p className='draft-status w-fit-content rounded-3 mb-0 ps-4'>Draft</p></td>
            <td className='ip-address text-secondary fw-medium px-1'>-</td>
            <td className='vendor'>
                <button className='btn purple-background mx-2'><i class="fa-solid text-white fa-eye"></i></button>
                <button className='btn bg-secondary mx-2'><i class="fa-solid text-white fa-pen-to-square"></i></button>
                <button className='btn orange-background mx-2'><i class="fa-solid text-white fa-pause"></i></button>
                <button className='btn bg-secondary mx-2'><i class="fa-solid text-white fa-chart-simple"></i></button>
                <button className='btn red-background mx-2'><i class="fa-solid text-white fa-trash"></i></button>
            </td>

    </tr>






    </tbody>
  </table>

</div>


  
  
  </>
}

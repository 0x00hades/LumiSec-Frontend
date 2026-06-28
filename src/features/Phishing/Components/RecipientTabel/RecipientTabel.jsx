import React from 'react'
import "./RecipientTabel.css"

export default function RecipientTabel() {
  return <>

<div className='px-2'>
  <div className='search-container mb-3 mx-0 w-100'>
          <i className="fa-brands fa-sistrix discover-search-icon"></i>

          <input
              type="text"
              className='form-control header-search-input rounded-3 w-100'
              placeholder='Search...'
          />

    </div>

    <div className='invalid-div d-flex rounded-3 py-2 mb-3'>
      <i class="fa-solid fa-circle-info mt-1 me-1"></i>
      <p className='mb-0'>1 recipient(s) have invalid email addresses and will be skipped in campaigns.</p>
    </div>


    <div className="table-responsive-wrapper">

  <table className="w-100 recent-campigns discover-tabel">
    <thead>
      <tr>
      <th>Name</th>
        <th>Email</th>
        <th>Department</th>
        <th>Role</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>

        
    <tr>
            <td className='ip-address text-white fw-medium px-1'>Alice Morgan</td>
            <td className='ip-address text-secondary fw-medium px-1'>alice@example.com</td>
            <td className='ip-address text-secondary fw-medium px-1'>Finance</td>
            <td className='ip-address text-secondary fw-medium px-1'>Manager</td>
            <td className='py-3 px-1'><p className='active-status w-fit-content rounded-3 mb-0 ps-4'>Valid</p></td>
            <td className='vendor'>
                <button className='btn red-background mx-2'><i class="fa-solid text-white fa-trash"></i></button>
            </td>

    </tr>


    <tr>
            <td className='ip-address text-white fw-medium px-1'>Bob Chen</td>
            <td className='ip-address text-secondary fw-medium px-1'>bob@example.com</td>
            <td className='ip-address text-secondary fw-medium px-1'>Engineering</td>
            <td className='ip-address text-secondary fw-medium px-1'>Engineer</td>
            <td className='py-3 px-1'><p className='active-status w-fit-content rounded-3 mb-0 ps-4'>Valid</p></td>
            <td className='vendor'>
                <button className='btn red-background mx-2'><i class="fa-solid text-white fa-trash"></i></button>
            </td>

    </tr>


    <tr>
            <td className='ip-address text-white fw-medium px-1'>Carol Davis</td>
            <td className='ip-address text-secondary fw-medium px-1'>carol@example.com</td>
            <td className='ip-address text-secondary fw-medium px-1'>HR</td>
            <td className='ip-address text-secondary fw-medium px-1'>Analyst</td>
            <td className='py-3 px-1'><p className='active-status w-fit-content rounded-3 mb-0 ps-4'>Valid</p></td>
            <td className='vendor'>
                <button className='btn red-background mx-2'><i class="fa-solid text-white fa-trash"></i></button>
            </td>

    </tr>



    <tr>
            <td className='ip-address text-white fw-medium px-1'>Dave Kim</td>
            <td className='ip-address text-secondary fw-medium px-1'>dave@example.com</td>
            <td className='ip-address text-secondary fw-medium px-1'>Marketing</td>
            <td className='ip-address text-secondary fw-medium px-1'>Director</td>
            <td className='py-3 px-1'><p className='active-status w-fit-content rounded-3 mb-0 ps-4'>Valid</p></td>
            <td className='vendor'>
                <button className='btn red-background mx-2'><i class="fa-solid text-white fa-trash"></i></button>
            </td>

    </tr>


    <tr>
            <td className='ip-address text-white fw-medium px-1'>Eve Johnson</td>
            <td className='ip-address text-secondary fw-medium px-1'>eve@example.com</td>
            <td className='ip-address text-secondary fw-medium px-1'>Finance</td>
            <td className='ip-address text-secondary fw-medium px-1'>Analyst</td>
            <td className='py-3 px-1'><p className='active-status w-fit-content rounded-3 mb-0 ps-4'>Valid</p></td>
            <td className='vendor'>
                <button className='btn red-background mx-2'><i class="fa-solid text-white fa-trash"></i></button>
            </td>

    </tr>




    <tr>
            <td className='ip-address text-white fw-medium px-1'>Frank Lee</td>
            <td className='ip-address text-secondary fw-medium px-1'>frank@example.com</td>
            <td className='ip-address text-secondary fw-medium px-1'>IT</td>
            <td className='ip-address text-secondary fw-medium px-1'>SysAdmin</td>
            <td className='py-3 px-1'><p className='active-status w-fit-content rounded-3 mb-0 ps-4'>Valid</p></td>
            <td className='vendor'>
                <button className='btn red-background mx-2'><i class="fa-solid text-white fa-trash"></i></button>
            </td>

    </tr>



    <tr>
            <td className='ip-address text-white fw-medium px-1'>Grace Patel</td>
            <td className='ip-address text-secondary fw-medium px-1'>grace@badformat</td>
            <td className='ip-address text-secondary fw-medium px-1'>Sales</td>
            <td className='ip-address text-secondary fw-medium px-1'>Rep</td>
            <td className='py-3 px-1'><p className='red-status red-status-border w-fit-content rounded-3 mb-0 ps-4'>Invalid</p></td>
            <td className='vendor'>
                <button className='btn red-background mx-2'><i class="fa-solid text-white fa-trash"></i></button>
            </td>

    </tr>



    <tr>
            <td className='ip-address text-white fw-medium px-1'>Henry Wu</td>
            <td className='ip-address text-secondary fw-medium px-1'>henry@example.com</td>
            <td className='ip-address text-secondary fw-medium px-1'>Legal</td>
            <td className='ip-address text-secondary fw-medium px-1'>Counsel</td>
            <td className='py-3 px-1'><p className='active-status w-fit-content rounded-3 mb-0 ps-4'>Valid</p></td>
            <td className='vendor'>
                <button className='btn red-background mx-2'><i class="fa-solid text-white fa-trash"></i></button>
            </td>

    </tr>






    </tbody>
  </table>

  </div>
</div>
  
  
  
  </>
}

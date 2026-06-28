import React from 'react'
import "./ProfileModal.css"
export default function ProfileModal() {
  return<>
  <div className='profile rounded-3 mb-5'>
    <form action="" className='p-3'>
        <label htmlFor="name" className='mb-2'>Full Name</label>
        <input type="text" name="name" id="name" placeholder='Enter Full Name' className='form-control border-0 mb-2' />

        <label htmlFor="email" className='mb-2'>Email Address</label>
        <input type="email" name="email" id="email" placeholder='Enter Email Address' className='form-control border-0 mb-2' />

        <label htmlFor="role" className='mb-2'>Role</label>
        <input type="text" name="role" id="role" placeholder='Role' className='form-control border-0 mb-2' />

        <hr />

        <label htmlFor="password" className='mb-2'>New Password</label>
        <input type="password" name="password" id="password" placeholder='Enter new password' className='form-control border-0 mb-3' />

        <label htmlFor="confirmPassword" className='mb-2'>Confirm Password</label>
        <input type="password" name="confirmPassword" id="confirmPassword" placeholder='Confirm new password' className='form-control border-0 mb-4' />
        <div className='d-flex justify-content-end'>
            <button className='save-btn p-2 rounded-3 text-white border-0'><i className="fa-solid fa-download pe-2"></i>Save Progress</button>
        </div>
    </form>
  </div>
  </>
}

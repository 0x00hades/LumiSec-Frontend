import React from 'react'
import "./DashboardCard3.css"

export default function DashboardCard3({icon , title , Statistics  , text2 }) {

return<>
    
    <div className='col-12 col-sm-6 col-xl'>

        <div className='rounded-4 dashboard-card p-3 py-4 h-100'>

            <div className='icon-title icon-title--block mb-2'>
                <span className='icon-title__icon'>{icon}</span>
                <p className='mb-0'>{title}</p>
            </div>

            <div className='overflow-hidden'>

                <h4 className='Statistics text-white mb-1'>
                    <span>{Statistics}</span>
                </h4>

                <p className='text mb-2 ms-0'>
                    {text2}
                </p>

            </div>

        </div>

    </div>

</>
}
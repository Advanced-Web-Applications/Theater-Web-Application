import React from 'react'
import '../../style/customer/homepage.css'

export default function Homepage() {
  return (
    <div className='location-div'>
        <div className='location-card'>
            <h2>Choose your location</h2>
            <div className='location-items'>
                <div>Oulu</div>
                <div>Turku</div>
                <div>Helsinki</div>
            </div>
        </div>
    </div>
  )
}


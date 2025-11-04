import React from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router'
import StaffDashboard from '../../pages/staff/StaffDashboard'

export default function StaffNavBar() {
  return (
    <BrowserRouter>
        <nav>
            <Link to="/StaffDashboard">Staff Dashboard</Link>
        </nav>

        <Routes>
            <Route path="/StaffDashboard" element={<StaffDashboard />} />
        </Routes>
    </BrowserRouter>
  )
}

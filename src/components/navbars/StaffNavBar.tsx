import { BrowserRouter, Link, Route, Routes } from 'react-router'
import StaffSetTimes from '../../pages/staff/StaffSetTimes'
import StaffHomePage from '../../pages/staff/StaffHomePage'
import StaffSetSeat from '../../pages/staff/StaffSetSeat'
import StaffSeeTable from '../../pages/staff/StaffSeeTable'

export default function StaffNavBar() {
  return (
    <BrowserRouter>
        <nav>
            <Link to="/StaffHomePage">Staff HomePage</Link>
            <Link to="/StaffSetTimes">Set Show Times</Link>
            <Link to="/StaffSetSeat">Set Seats</Link>
            <Link to="/StaffSeeTable">See Table</Link>
        </nav>

        <Routes>
            <Route path="/StaffHomePage" element={<StaffHomePage />} />
            <Route path="/StaffSetTimes" element={<StaffSetTimes />} />
            <Route path="/StaffSetSeat" element={<StaffSetSeat />} />
            <Route path="/StaffSeeTable" element={<StaffSeeTable />} />
        </Routes>
    </BrowserRouter>
  )
}

import { BrowserRouter, Link, Route, Routes } from 'react-router'
import StaffSetTimes from '../../pages/staff/StaffSetTimes'
import StaffHomePage from '../../pages/staff/StaffHomePage'
import StaffSetSeat from '../../pages/staff/StaffSetSeat'
import StaffSeeTable from '../../pages/staff/StaffSeeTable'
import Logo from "../../assets/north-star-logo.jpg"

export default function StaffNavBar() {
  return (
    <BrowserRouter>
      <nav className='staffNav'>
        <div className="navLeft">
          <img src={Logo} alt="Logo" className="navLogo" />
        </div>

        <Link to="/StaffHomePage/1">Staff HomePage</Link>
      </nav>

      <Routes>
        <Route path="/StaffHomePage/:id" element={<StaffHomePage />} />
        <Route path="/StaffSetTimes/:id/:auditorium" element={<StaffSetTimes />} />
        <Route path="/StaffSetSeat/:id/:auditorium" element={<StaffSetSeat />} />
        <Route path="/StaffSeeTable/:id/:auditorium" element={<StaffSeeTable />} />
      </Routes>
    </BrowserRouter>
  )
}

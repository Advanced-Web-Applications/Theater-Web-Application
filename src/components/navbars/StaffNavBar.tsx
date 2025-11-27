import { Link, Route, Routes } from 'react-router'
import StaffSetTimes from '../../pages/staff/StaffSetTimes'
import StaffHomePage from '../../pages/staff/StaffHomePage'
import StaffSetSeat from '../../pages/staff/StaffSetSeat'
import StaffSeeTable from '../../pages/staff/StaffSeeTable'

export default function StaffNavBar() {
  return (
    <>
      <nav className='staffNav'>

        <Link to="/StaffHomePage/1">Staff HomePage</Link>
      </nav>

      <Routes>
        <Route path="/StaffHomePage/:id" element={<StaffHomePage />} />
        <Route path="/StaffSetTimes/:id/:auditorium" element={<StaffSetTimes />} />
        <Route path="/StaffSetSeat/:id/:auditorium" element={<StaffSetSeat />} />
        <Route path="/StaffSeeTable/:id/:auditorium" element={<StaffSeeTable />} />
      </Routes>
    </>
  )
}

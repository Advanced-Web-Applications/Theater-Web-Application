import { BrowserRouter, Routes, Route, } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Location from './pages/customer/Location';
import StaffHomePage from './pages/staff/StaffHomePage';
import StaffSetTimes from './pages/staff/StaffSetTimes';
import StaffSetSeat from './pages/staff/StaffSetSeat';
import StaffSeeTable from './pages/staff/StaffSeeTable';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import AddTheater from './pages/owner/AddTheater';
import AddAuditorium from './pages/owner/AddAuditorium';
import AddStaff from './pages/owner/AddStaff';
import EditStaff from './pages/owner/EditStaff';
import StaffList from './pages/owner/StaffList';

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/*" element={<Location />} />

        <Route path="/StaffHomePage/:id" element={<StaffHomePage />} />
        <Route path="/StaffSetTimes/:id/:auditorium" element={<StaffSetTimes />} />
        <Route path="/StaffSetSeat/:id/:auditorium" element={<StaffSetSeat />} />
        <Route path="/StaffSeeTable/:id/:auditorium" element={<StaffSeeTable />} />

        <Route path="/OwnerDashboard" element={<OwnerDashboard />} />
        <Route path="/AddTheater" element={<AddTheater />} />
        <Route path="/AddAuditorium" element={<AddAuditorium />} />
        <Route path="/AddStaff" element={<AddStaff />} />
        <Route path="/EditStaff/:id" element={<EditStaff />} />
        <Route path="/StaffList" element={<StaffList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

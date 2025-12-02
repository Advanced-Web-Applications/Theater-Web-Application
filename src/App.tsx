import { BrowserRouter, Routes, Route, } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Location from './pages/customer/Location';
import StaffHomePage from './pages/staff/StaffHomePage';
import StaffSetTimes from './pages/staff/StaffSetTimes';
import StaffSetSeat from './pages/staff/StaffSetSeat';
import StaffSeeTable from './pages/staff/StaffSeeTable';

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/*" element={<Location />} />

        <Route path="/StaffHomePage/:id" element={<StaffHomePage />} />
        <Route path="/StaffSetTimes/:id/:auditorium" element={<StaffSetTimes />} />
        <Route path="/StaffSetSeat/:id/:auditorium" element={<StaffSetSeat />} />
        <Route path="/StaffSeeTable/:id/:auditorium" element={<StaffSeeTable />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

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
import AddMovie from './pages/owner/AddMovie';
import PriceSetting from './pages/owner/PriceSetting';
import MovieManagement from './pages/owner/MovieManagement';
import HomePage from "./pages/customer/HomePage";
import Layout from "./components/customer/Layout";
import MovieDetails from "./pages/customer/MovieDetails";
import Ticket from "./pages/customer/Ticket";
import Checkout from "./pages/customer/Checkout";
import SuccessView from "./pages/customer/SuccessView";
import LoginPage from "./pages/auth/LoginPage";
import Signup from "./pages/auth/Signup"

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Location />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<SuccessView />} />
        </Route>

        <Route path="/StaffHomePage/:id" element={<StaffHomePage />} />
        <Route path="/StaffSetTimes/:id/:auditorium" element={<StaffSetTimes />} />
        <Route path="/StaffSetSeat/:id/:auditorium" element={<StaffSetSeat />} />
        <Route path="/StaffSeeTable/:id/:auditorium" element={<StaffSeeTable />} />

        <Route path="/OwnerDashboard" element={<OwnerDashboard />} />
        <Route path="/AddTheater" element={<AddTheater />} />
        <Route path="/AddAuditorium" element={<AddAuditorium />} />
        <Route path="/AddMovie" element={<AddMovie />} />
        <Route path="/AddStaff" element={<AddStaff />} />
        <Route path="/EditStaff/:id" element={<EditStaff />} />
        <Route path="/StaffList" element={<StaffList />} />
        <Route path="/PriceSetting" element={<PriceSetting />} />
        <Route path="/MovieManagement" element={<MovieManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

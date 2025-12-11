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
import ChangePassword from "./pages/customer/ChangePassword";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Location />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/change-password" element={<ChangePassword />} />
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

        {/* Protected Owner Routes */}
        <Route path="/OwnerDashboard" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/AddTheater" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AddTheater />
          </ProtectedRoute>
        } />
        <Route path="/AddAuditorium" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AddAuditorium />
          </ProtectedRoute>
        } />
        <Route path="/AddMovie" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AddMovie />
          </ProtectedRoute>
        } />
        <Route path="/AddStaff" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AddStaff />
          </ProtectedRoute>
        } />
        <Route path="/EditStaff/:id" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <EditStaff />
          </ProtectedRoute>
        } />
        <Route path="/StaffList" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <StaffList />
          </ProtectedRoute>
        } />
        <Route path="/PriceSetting" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <PriceSetting />
          </ProtectedRoute>
        } />
        <Route path="/MovieManagement" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <MovieManagement />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

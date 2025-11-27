import { BrowserRouter, Routes, Route } from "react-router-dom";
import StaffNavbar from "./components/navbars/StaffNavBar";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Location from './pages/customer/Location';

function App() {
  return (
    <BrowserRouter>
      <StaffNavbar />
      <Routes>
        <Route path="/location" element={<Location />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
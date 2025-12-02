import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import HomePage from '../../pages/customer/HomePage'
import LoginPage from '../../pages/auth/LoginPage'

export default function NavBar() {
  return (
    <BrowserRouter>
        <nav>
            <Link to="/Homepage">Home</Link>
            <Link to="/LoginPage">Login</Link>
        </nav>

        <Routes>
            <Route path="/Homepage" element={<HomePage />} />
            <Route path="/LoginPage" element={<LoginPage />} />
        </Routes>
    </BrowserRouter>
  )
}

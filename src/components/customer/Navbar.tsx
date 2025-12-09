import { useNavigate, Link } from 'react-router-dom'
import '../../style/customer/navbar.css'


export default function Navbar() {

  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const isLoggedIn = Boolean(token)

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className='navbar'>
        <img className='logo' src='/logo.jpg' alt='Logo'/>
        <div>
          {isLoggedIn ? (
            <span onClick={handleLogout}>Log Out</span>
          ) : (
            <Link to='/login'>Log In</Link>
          )}
        </div>
    </div>
  )
}

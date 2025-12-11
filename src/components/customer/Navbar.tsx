import { useNavigate } from 'react-router-dom'
import '../../style/customer/navbar.css'


export default function Navbar() {

  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const isLoggedIn = Boolean(token)

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('selectedCity')
    navigate('/')
  }

  return (
    <div className='navbar'>
        <img className='logo' src='/logo.jpg' alt='Logo' onClick={() => navigate('/home', {replace: true, state: {location: localStorage.getItem('selectedCity')}})}/>
        <div>
          {isLoggedIn ? (
            <span onClick={handleLogout}>Log Out</span>
          ) : (
            <i className="bi bi-list menu" onClick={() => navigate('/login')}></i>
          )}
        </div>
    </div>
  )
}

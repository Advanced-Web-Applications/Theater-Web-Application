import { useNavigate, useLocation } from 'react-router-dom'
import '../../style/customer/navbar.css'


export default function Navbar() {

  const navigate = useNavigate()
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  const token = localStorage.getItem('token')
  const isLoggedIn = Boolean(token)

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('selectedCity');
    navigate('/');
  };

  return (
    <div className='navbar'>
        <img className='logo' src='/logo.jpg' alt='Logo' onClick={() => navigate('/', {replace: true, state: {location: localStorage.getItem('selectedCity')}})}/>
        <div className='home'>
          <i className='bi bi-house menu'
             onClick={() => !isHomePage && navigate('/home')}
             style={{
               pointerEvents: isHomePage ? 'none' : 'auto',
               cursor: isHomePage ? 'not-allowed' : 'pointer',
             }}></i>
          {isLoggedIn ? (
          location.pathname === '/change-password' ? (
            <button className='logout-button' onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <i
              className='bi bi-person-circle menu'
              onClick={() => navigate('/change-password')}
            ></i>
          )
        ) : (
          <i
            className='bi bi-person-circle menu'
            onClick={() => navigate('/login')}
          ></i>
        )}
        </div>
    </div>
  )
}

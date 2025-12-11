import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

interface LocationInfo {
  name: string;
  address: string;
  phone: string;
}

export default function Layout() {

    const navigate = useNavigate()
    const { pathname, state } = useLocation()
    const selectedCity = state?.location || localStorage.getItem('selectedCity')
    const [location, setLocation] = useState<LocationInfo | null>(null)

    useEffect(() => {
    if (!selectedCity) {
        navigate('/')
    }

    fetch(`${BACKEND_URL}/api/customer/locations/${selectedCity}`)
      .then(res => res.json())
      .then(data => setLocation(data))
      .catch(err => console.error(err));
  }, [selectedCity]);
    
    const showFooter = pathname !== '/'

  return (
    <div className='layout-wrapper'>
      <Navbar />
      <div className='layout-content'>
        <Outlet />
      </div>
      {showFooter && location && (
        <footer className="footer">
          <p><strong>{location.name}</strong></p>
          <p>{location.address}</p>
          <p><strong>Phone: </strong>{location.phone}</p>
        </footer>
      )}
    </div>
  )
}

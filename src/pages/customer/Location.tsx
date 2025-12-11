import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import '../../style/customer/location.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

interface LocationType {
  city: string
}

export default function Location() {

  const [activeLocation, setActiveLocation] = useState<string | null>(null)
  const [locations, setLocations] = useState<LocationType[]>([])

  const navigate = useNavigate()
  const handleSelect = (location: string) => {
    setActiveLocation(location)
    localStorage.setItem('selectedCity', location)
    navigate('/home', { replace: true, state: {location}})
  }

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/customer/locations`, {headers: { 'Content-Type': 'application/json'}})
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch (err => console.log('Error fetching locations: ', err))
  }, [])

  return (
    <div className='location-div'>
        <div className='location-card'>
            <h2>Choose your location</h2>
            <div className='location-items'>
                {locations.map(location => (
                  <div 
                    key={location.city}
                    data-test={`location-${location.city.toLowerCase()}`}
                    className={`location-item ${activeLocation === location.city ? 'active' : ''}`}
                    onClick={() => handleSelect(location.city)}
                  >
                    {location.city}
                  </div>
                ))}
            </div>
        </div>
    </div>
  )
}

import {useState} from 'react'
import { useNavigate, Route, Routes } from 'react-router-dom'
import '../../style/customer/location.css'
import Navbar from '../../components/customer/Navbar'
import HomePage from './HomePage'
import MovieDetails from './MovieDetails'

export default function Location() {

  const [activeLocation, setActiveLocation] = useState<string | null>(null)

  const locations = ['Oulu', 'Turku', 'Helsinki Central']

  const navigate = useNavigate()
  const handleSelect = (location: string) => {
    setActiveLocation(location)
    navigate('/home', {state: {location}})
  }
  return (
    <>
      <Navbar/>
      <Routes>
        <Route
          path='/'
          element={
            <div className='location-div'>
                <div className='location-card'>
                    <h2>Choose your location</h2>
                    <div className='location-items'>
                        {locations.map(location => (
                          <div 
                            key={location}
                            data-test={`location-${location.toLowerCase()}`}
                            className={`location-item ${activeLocation === location ? 'active' : ''}`}
                            onClick={() => handleSelect(location)}
                          >
                            {location}
                          </div>
                        ))}
                    </div>
                </div>
            </div>
          }
          />
        <Route path="/home" element={<HomePage />} />
        <Route path="/MovieDetails" element={<MovieDetails />} />
      </Routes>
    </>
  )
}
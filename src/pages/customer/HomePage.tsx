import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, Route, Routes, Outlet } from 'react-router-dom'
import SearchBar from '../../components/customer/SearchBar'
import MovieDetails from './MovieDetails'

const API_URL = import.meta.env.VITE_API_URL


interface MovieProps {
    id: number
  title: string
  genre: string
  duration: number
  age_rating: string
  description: string
  poster_url: string
}

interface LocationProps {
  id: number
  city: string
  name: string
  address: string
  phone: string
}


export default function HomePage() {

  const { state } = useLocation()
  const city = state?.location || 'Unknown'
    const passedCity = state?.location || ''   // e.g. "Oulu"


  const navigate = useNavigate()

  const [movies, setMovies] = useState<MovieProps[]>([])
  const [location, setLocation] = useState('')
    const [currentLocation, setCurrentLocation] = useState<LocationProps | null>(null)


  useEffect(() => {
    const fetchData = async () => {
      try { 
        const locationReq = await fetch(`${API_URL}/api/customer/locations`)
        const locationData = await locationReq.json()

        const moviesReq = await fetch(`${API_URL}/api/customer/movies`)
        const moviesData = await moviesReq.json()

        setLocation(locationData)
        setMovies(moviesData)

        if (passedCity) {
          const match = locationData.find(
            (loc: LocationProps) => loc.city.toLowerCase() === passedCity.toLowerCase()
          )
          setCurrentLocation(match || null)
        }

      } catch (err) {
        console.log('Error fetching data: ', err)
      }
    }  
    fetchData()
  }, [passedCity])

  return (
    <>
      <SearchBar/>
      <div className='poster-grid'>
          {movies.map(movie => (
          <img key={movie.id} 
                src={movie.poster_url} 
                className="poster" 
                onClick={() => navigate(`/movie/${movie.id}`, {state: movie})}></img>
          ))}
      </div>

      <footer className="footer">
       {currentLocation ? (
          <>
            <p><strong>{currentLocation.name}</strong></p>
            <p>{currentLocation.address}</p>
            <p><strong>Phone: </strong>{currentLocation.phone}</p>
          </>
        ) : (
          <>
            <p>Loading page...</p>
          </>
        )}
      </footer>
      
    </>
  )
}

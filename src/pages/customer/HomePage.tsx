import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../../style/customer/homepage.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

interface MovieProps {
  id: number
  title: string
  genre: string
  duration: number
  age_rating: string
  description: string
  poster_url: string
  trailer_url: string
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
  const city = state?.location || localStorage.getItem('selectedCity')

  const navigate = useNavigate()

  const [movies, setMovies] = useState<MovieProps[]>([])
  const [_, setLocation] = useState('')
  const [, setCurrentLocation] = useState<LocationProps | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try { 
        const locationReq = await fetch(`${BACKEND_URL}/api/customer/locations`, {headers: { 'Content-Type': 'application/json'}})
        const locationData = await locationReq.json()

        const moviesReq = await fetch(`${BACKEND_URL}/api/customer/location/movies?city=${city}`, {headers: { 'Content-Type': 'application/json'}})
        const moviesData = await moviesReq.json()

        setLocation(locationData)
        setMovies(moviesData)

        if (city) {
          const match = locationData.find(
            (loc: LocationProps) => loc.city.toLowerCase() === city.toLowerCase()
          )

          setCurrentLocation(match)
        }
      } catch (err) {
        console.log('Error fetching data: ', err)
      }
    }
    fetchData()
  }, [city])

  return (
    <>
      <div className='poster-grid'>
          {movies.map(movie => (
          <img key={movie.id} 
                src={movie.poster_url} 
                onClick={() => navigate(`/movie/${movie.id}`, {state: {movie, city}})}></img>
          ))}
      </div>
    </>
  )
}

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SearchBar from '../../components/customer/SearchBar'

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

  const navigate = useNavigate()

  const [movies, setMovies] = useState<MovieProps[]>([])
  const [_, setLocation] = useState('')
  const [currentLocation, setCurrentLocation] = useState<LocationProps | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try { 
        const locationReq = await fetch(`${API_URL}/api/customer/locations`)
        const locationData = await locationReq.json()

        const moviesReq = await fetch(`${API_URL}/api/customer/location/movies?city=${city}`)
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

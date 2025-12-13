import { useEffect, useState, useRef } from 'react'
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

  const upcomingRef = useRef<HTMLDivElement>(null)

  const [movies, setMovies] = useState<MovieProps[]>([])
  const [upcoming, setUpComing] = useState<MovieProps[]>([])
  const [_, setLocation] = useState('')
  const [, setCurrentLocation] = useState<LocationProps | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try { 
        const locationReq = await fetch(`${BACKEND_URL}/api/customer/locations`, {headers: { 'Content-Type': 'application/json'}})
        const locationData = await locationReq.json()

        const moviesReq = await fetch(`${BACKEND_URL}/api/customer/location/movies?city=${city}`, {headers: { 'Content-Type': 'application/json'}})
        const moviesData = await moviesReq.json()

        const upcomingReq = await fetch(`${BACKEND_URL}/api/customer/movies`, {headers: { 'Content-Type': 'application/json'}})
        const upcomingData = await upcomingReq.json()

        setLocation(locationData)
        setMovies(moviesData)
        setUpComing(upcomingData)

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

  const scrollLeft = () => {
  if (upcomingRef.current) {
    upcomingRef.current.scrollBy({
      left: -upcomingRef.current.offsetWidth,
      behavior: 'smooth'
    })
  }
}

const scrollRight = () => {
  if (upcomingRef.current) {
    upcomingRef.current.scrollBy({
      left: upcomingRef.current.offsetWidth,
      behavior: 'smooth'
    })
  }
}


  return (
    <>
      <h2 className="section-title">Upcoming Movies</h2>
      <div className="upcoming-carousel">
        <button className="scroll-btn left" onClick={scrollLeft}>‹</button>

        <div className="upcoming-viewport" ref={upcomingRef}>
          <div className="upcoming-grid">
            {upcoming.map(movie => (
              <div
                className="upcoming-card"
                key={movie.id}
                onClick={() =>
                  navigate(`/movie/${movie.id}`, { state: { movie, city } })
                }
              >
                <div className="poster-wrapper">
                  <img src={movie.poster_url} alt={movie.title} />
                </div>

                <p className="title">{movie.title}</p>
                <div className="details">
                  <span>{movie.duration} min</span>
                  <span>{movie.age_rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="scroll-btn right" onClick={scrollRight}>›</button>
      </div>


      <h2 className='section-title'>Now showing Movies</h2>
      <div className='poster-grid'>
        {movies.map(movie => (
          <div className='movie-card-now' key={movie.id} 
            onClick={() => navigate(`/movie/${movie.id}`, {state: {movie, city}})}
          >
            <div className="poster-wrapper">
                <img src={movie.poster_url} alt={movie.title} />
            </div>
            <div className="movie-info-bottom">
              <p className="name">{movie.title}</p>
              <div className="details-row">
                <div className='detail-item'>
                  <i className="bi bi-person-square"></i>
                  <p className="age-rating">{movie.age_rating}</p>
                </div>
                <div className='detail-item'>
                  <i className="bi bi-clock"></i>
                  <p className="duration">{movie.duration} mins</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

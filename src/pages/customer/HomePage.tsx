import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, Route, Routes } from 'react-router-dom'
import SearchBar from '../../components/customer/SearchBar'
import MovieDetails from './MovieDetails'

interface MovieProps {
    id: number
  title: string
  genre: string
  duration: number
  age_rating: string
  description: string
  poster_url: string
}


export default function HomePage() {

  const { state } = useLocation()
  const location = state?.location || 'Unknown'

  const navigate = useNavigate()

  const [movies, setMovies] = useState<MovieProps[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/api/customer/movies')
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(err => console.log('Error fetching movies: ', err))
  }, [])

  return (
    <>
      <Routes>
        <Route
          index
          element= {
            <>
              <SearchBar/>
              <div className='poster-grid'>
                  {movies.map(movie => (
                  <img key={movie.id} src={movie.poster_url} className="poster" onClick={() => navigate('/home/MovieDetails', {state: movies})}></img>
                  ))}
              </div>
              <footer className="footer">
                <p><strong>Cinema Nova Oulu</strong></p>
                <p>Kauppurienkatu 45, 90100 Oulu, Finland</p>
                <p>Phone: +358 8 5542 3890</p>
              </footer>
            </>
          }
        >
        </Route>
        <Route path="MovieDetails/*" element={<MovieDetails />} />

      </Routes>

    </>
  )
}

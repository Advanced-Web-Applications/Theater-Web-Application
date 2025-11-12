import { useState, useEffect } from 'react'
import "../../style/customer/movieinfo.css"; 

interface MovieProps {
  id: number
  title: string
  genre: string
  duration: number
  age_rating: string
  description: string
  poster_url: string
}

export default function MovieInfo() {

  const [movie, setMovie] = useState<MovieProps[]>([])

  useEffect(() => {
      fetch('http://localhost:3000/api/customer/movie/:id')
        .then(res => res.json())
        .then(data => setMovie(data))
        .catch(err => console.log('Error fetching movies: ', err))
    }, [])

  return (
    <div className='movie-details'>
      <div className='movie-header'>
        <img></img> 
        <div className='movie-text'>
          <h1 className='movie-title'>{movie.title}</h1>

          <div className='movie-info'>
            <p><strong>Genre: </strong>{movie[0].genre}</p>
            <p><strong>Duration: </strong>{movie[0].duration}</p>
            <p><strong>Rated: </strong>{movie[0].age_rating}</p>
            <p><strong>Description: </strong>{movie[0].description}</p>
          </div>
        </div>
      </div>    
    </div>
  )
}

import { useState, useEffect } from 'react'
import "../../style/customer/movieinfo.css"; 

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

interface MovieInfoProps {
  movieId: string
  setMovie: (movie: MovieProps) => void
  formatDuration: (duration: number) => string;
}

export default function MovieInfo({movieId, setMovie, formatDuration }: MovieInfoProps) {

  const [movie, internalMovie] = useState<MovieProps | null>(null)

  useEffect(() => {
      fetch(`${BACKEND_URL}/api/customer/movies/${movieId}`, {
        headers: { 'Content-Type': 'application/json'}
      })
        .then(res => res.json())
        .then(data => { internalMovie(data); setMovie(data) })
        .catch(err => console.log('Error fetching movies: ', err))
    }, [movieId, setMovie])

    function embedTrailerUrl(url: string) {
      const videoId = url.split('v=')[1]?.split('&'[0])
      return `https://www.youtube.com/embed/${videoId}`
    }

  return (
    <div className='movie-details'>
      {movie && (
        <div className='movie-header'>
          <img src={movie.poster_url}></img> 
          <div className='movie-text'>
            <h1 className='movie-name'>{movie.title}</h1>

            <div className='movie-info'>
              <p><strong>Genre: </strong>{movie.genre}</p>
              <p><strong>Duration: </strong>{formatDuration(movie.duration)}</p>
              <p><strong>Rated: </strong>{movie.age_rating}</p>
              <div className='description'>
                <strong>Description: </strong>
                <span>{movie.description}</span>
              </div>
              <div className='trailer'>
                <p><strong>Trailer: </strong></p>
                <iframe
                  width="560"
                  height="315"
                  src={embedTrailerUrl(movie.trailer_url)}
                  title="Movie trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>    
      )}
    </div>
  )
}

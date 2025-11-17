import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import MovieInfo from '../../components/customer/MovieInfo'
import "../../style/customer/moviedetails.css"; 

const API_URL = import.meta.env.VITE_API_URL


interface Showtimes {
  start_time: string;
}

interface MovieProps {
  id: number
  title: string
  genre: string
  duration: number
  age_rating: string
  description: string
  poster_url: string
}


export default function MovieDetails() {

  const { id } = useParams()
  
  const location = useLocation()
  const navigate = useNavigate()
  
  const [movie, setMovie] = useState<MovieProps | null>(location.state?.movie || null)

  const [showtimes, setShowtimes] = useState<Showtimes[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/api/customer/showtimes/${id}`)
    .then(res => res.json())
    .then(data => setShowtimes(data))
  }, [id])

  const groupedByDate = showtimes.reduce((acc: any, current: any) => {
    const date = new Date(current.start_time)
    const dateKey = date.toDateString()
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(current)
    return acc
  }, {})

  const dates = Object.keys(groupedByDate)

  const formatDay = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {weekday: 'short'})

  const formatDayNumMonth = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <>
      <MovieInfo movieId={id!} setMovie={setMovie}/>
      <div>
        <div className='dates-container'>
          {dates.map((dateStr) => (
            <div
            key={dateStr}
            onClick={() => setSelectedDate(dateStr)}
            className={`date-item ${selectedDate === dateStr ? 'selected' : ''}`}
            >
              <div>{formatDay(dateStr)}</div>
              <div>{formatDayNumMonth(dateStr)}</div>
            </div>
          ))}
        </div>

        {selectedDate && movie && (
          <div className='showtimes-container'>
            {groupedByDate[selectedDate].map((slot: Showtimes) => (
              <div
                key={slot.start_time}
                className='showtime-item'
                onClick={() => navigate('/ticket/', {state: {showtime: formatTime(slot.start_time), movie}})}
              >
                {formatTime(slot.start_time)}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

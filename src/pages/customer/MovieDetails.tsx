import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import MovieInfo from '../../components/customer/MovieInfo'
import "../../style/customer/moviedetails.css"; 

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

interface Showtimes {
  id: number
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
    fetch(`${BACKEND_URL}/api/customer/showtimes/${id}`, {headers: { 'Content-Type': 'application/json'}})
    .then(res => res.json())
    .then(data => setShowtimes(data))
  }, [id])

  const theaterTimezone = "Asia/Kuala_Lumpur"

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: theaterTimezone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })

  const groupedByDate = showtimes.reduce((acc: any, current: any) => {
    const dateKey = dateFormatter.format(new Date(current.start_time))
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(current)
    return acc
  }, {})

  const dates = Object.keys(groupedByDate)

  const formatDay = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', timeZone: theaterTimezone })

  const formatDayNumMonth = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', timeZone: theaterTimezone })

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: theaterTimezone })

  // Date for ticket details
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-GB', { timeZone: theaterTimezone })

  const formatDuration = (duration: number) => {
    const hour = Math.floor(duration / 60)
    const minutes = duration % 60
    return `${hour}h${minutes.toString().padStart(2, '0')}.`
  }

  return (
    <>
      <MovieInfo movieId={id!} setMovie={setMovie} formatDuration={formatDuration}/>
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
                onClick={() => 
                  navigate( '/ticket/', {
                      state: {
                        movie,
                        showtime_id: slot.id,
                        start_time: formatTime(slot.start_time),
                        date: formatDate(selectedDate),
                      }
                    })
                  }
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

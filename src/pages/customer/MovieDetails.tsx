import { useState } from 'react'
import MovieInfo from '../../components/customer/MovieInfo'
import "../../style/customer/moviedetails.css"; 


interface Showtimes {
  id: number;
  start_time: string;
}

const showtimes: Showtimes[] = [
  { id: 1, start_time: "2025-03-10 07:48:37.557788" },
  { id: 2, start_time: "2025-06-11 11:45:25.333333" },
  { id: 3, start_time: "2025-11-21 21:20:37.588888" },
  { id: 4, start_time: "2025-11-22 10:20:37.588888" },
];


export default function MovieDetails() {

  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const groupedByDate = showtimes.reduce((acc: any, current) => {
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
      <MovieInfo/>
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

        {selectedDate && (
          <div className='showtimes-container'>
            {groupedByDate[selectedDate].map((slot: Showtimes) => (
              <div
                key={slot.id}
                className='showtime-item'
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

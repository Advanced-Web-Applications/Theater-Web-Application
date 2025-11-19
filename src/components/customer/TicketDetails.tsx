import React, { useState, useEffect } from 'react'
import '../../style/customer/ticket.css'

const API_URL = import.meta.env.VITE_API_URL

interface TicketDetailsProps {
  movie: {
    id: number
    title: string
    duration: number
  }
  showtime_id: number
  start_time: string
  date: string
}

export default function TicketDetails({ movie, showtime_id, start_time, date }: TicketDetailsProps) {

  const [ticket, setTicket] = useState<any>(null)
  const [childTicket, setChild] = useState<number>(0)
  const [adultTicket, setAdult] = useState<number>(0)

  const formatDuration = (duration: number) => {
    const hour = Math.floor(duration / 60)
    const minutes = duration % 60
    return `${hour}h${minutes.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    fetch(`${API_URL}/api/customer/auditorium/showtimes/${showtime_id}/ticket`)
      .then(res => res.json())
      .then(data => setTicket(data))
      .catch(err => console.error('Error fetching ticket: ',err))
  }, [showtime_id])

  return (
    <>
      <h1 className='title'>{movie.title}</h1>
      <div className='ticket-page'>
        <div className='ticket-details'>
            {ticket && (
              <>
                <p><strong>Theater: </strong>{ticket.theater}</p>   
                <p><strong>Auditorium: </strong>{ticket.auditorium}</p>   
                <p><strong>Date: </strong>{date}</p>
                <p><strong>Duration: </strong>{formatDuration(movie.duration)}</p>   
                <p><strong>Start time: </strong>{start_time}</p>  
              </>
            )}
        </div>

        <div className='choose-tickets'>
              <div className='counter'>
                  <span>Adult ticket:</span>
                  <div onClick={() => setAdult(v => Math.max(0, v-1))}>-</div>
                  <span className='count'>{adultTicket}</span>
                  <div onClick={() => setAdult(v => v + 1)}>+</div>
              </div>
              <div className='counter'>
                  <span>Child ticket:</span>
                  <div onClick={() => setChild(v => Math.max(0, v-1))}>-</div>
                  <span className='count'>{childTicket}</span>
                  <div onClick={() => setChild(v => v + 1)}>+</div>
              </div>
              
              <h3 className='price'>
                Total: {(adultTicket * 10) + (childTicket * 8)} €
              </h3>
          </div>
      </div>
    </>

  )
}

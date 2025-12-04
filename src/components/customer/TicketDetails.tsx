import React, { useState, useEffect } from 'react'
import '../../style/customer/seats.css'

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
  adultTicket: number;
  childTicket: number;
  setAdultTicket: React.Dispatch<React.SetStateAction<number>>;
  setChildTicket: React.Dispatch<React.SetStateAction<number>>;
}

interface Price {
  adult_price: number
  child_price: number
}


export default function TicketDetails({ movie, showtime_id, start_time, date, adultTicket, childTicket, setAdultTicket, setChildTicket }: TicketDetailsProps) {

  const [ticket, setTicket] = useState<any>(null)
  const [price, setPrice] = useState<Price | null>(null)

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

  useEffect(() => {
  fetch(`${API_URL}/api/customer/seats/price`)
    .then(res => res.json())
    .then(data => setPrice(data))
    .catch(err => console.error('Error fetching price: ', err));
  }, []);

  return (
    <>
      <h1 className='title'>{movie.title}</h1>
      <div className='ticket-page'>
        <div className='ticket-details'>
            {ticket && (
              <>
                  <img src={ticket.poster}></img>
                  <div className='strong'>
                    <p><strong>Theater: </strong>{ticket.theater}</p>   
                    <p><strong>Auditorium: </strong>{ticket.auditorium}</p>   
                    <p><strong>Date: </strong>{date}</p>
                    <p><strong>Duration: </strong>{formatDuration(movie.duration)}</p>   
                    <p><strong>Start time: </strong>{start_time}</p>  
                </div>
              </>
            )}
        </div>

        <div className='choose-tickets'>
              <div className='counter'>
                  <span>Adult ticket:</span>
                  <div onClick={() => setAdultTicket(v => Math.max(0, v-1))}>-</div>
                  <span className='count'>{adultTicket}</span>
                  <div onClick={() => setAdultTicket(v => v + 1)}>+</div>
              </div>
              <div className='counter'>
                  <span>Child ticket:</span>
                  <div onClick={() => setChildTicket(v => Math.max(0, v-1))}>-</div>
                  <span className='count'>{childTicket}</span>
                  <div onClick={() => setChildTicket(v => v + 1)}>+</div>
              </div>
              
              {price && (
                <h3 className='price'>
                  {(adultTicket * price.adult_price) + (childTicket * price.child_price)} €
                </h3>
              )}
          </div>
      </div>
    </>

  )
}

import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import TicketDetails from '../../components/customer/TicketDetails'
import SeatsTickets from '../../components/customer/SeatsTickets'



export default function Ticket() {

  const { state } = useLocation()
  const navigate = useNavigate()

  const movie = state?.movie
  const showtime_id = state?.showtime_id
  const start_time = state?.start_time
  const date = state?.date

  return (
    <div>
      <TicketDetails movie={movie} start_time={start_time} date={date} showtime_id={showtime_id}/>
      <SeatsTickets showtime_id={showtime_id}/>
      <h3 onClick={() => navigate('/checkout', {state: movie})}>Go to payment</h3>
    </div>
  )
}

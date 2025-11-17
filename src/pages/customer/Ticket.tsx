import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import TicketDetails from '../../components/customer/TicketDetails'


export default function Ticket() {

  const { state } = useLocation()
  const navigate = useNavigate()
  const movie = state?.movie
  const showtime = state?.showtime


  return (
    <div>
      <TicketDetails showtime={showtime} movie={movie}/>
    </div>
  )
}

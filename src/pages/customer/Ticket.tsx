import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TicketDetails from '../../components/customer/TicketDetails'
import SeatsLayout from '../../components/customer/SeatsLayout'
import '../../style/customer/ticket.css'


export default function Ticket() {

  const { state } = useLocation()
  const navigate = useNavigate()

  const movie = state?.movie
  const showtime_id = state?.showtime_id
  const start_time = state?.start_time
  const date = state?.date

  const [adultTicket, setAdultTicket] = useState<number>(0)
  const [childTicket, setChildTicket] = useState<number>(0)

  return (
    <div>
      <div className='ticket-center'>
        <TicketDetails 
          movie={movie} 
          start_time={start_time} 
          date={date} 
          showtime_id={showtime_id} 
          adultTicket={adultTicket}
          childTicket={childTicket}
          setAdultTicket={setAdultTicket}  
          setChildTicket={setChildTicket}
        />
      </div>
      <SeatsLayout showtime_id={showtime_id} adultTicket={adultTicket} childTicket={childTicket}/>
    </div>
  )
}

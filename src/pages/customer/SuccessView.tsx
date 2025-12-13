import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router';
import '../../style/customer/ticket.css'
import { socket } from '../../services/socket'
import Ticket from './Ticket';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

interface Ticket {
  title: string
  theater: string
  auditorium: string
  date: string
  start_time: string
  duration: string
  seats: number[]
  barcode: string
} 

export default function SuccessView() {

    const navigate = useNavigate()
    const location = useLocation()
    const initialSession = location.state?.ticketData

    const [searchParams] = useSearchParams()
    const [session, setSession] = useState<Ticket | null>(initialSession || null)
    const [loading, setLoading] = useState(!initialSession)
    const [error, setError] = useState<string | null>(null)
    const sessionId = searchParams.get('session_id')

    useEffect(() => {
      if (sessionId) {
        const finalizeSeats = async () => {
          try {
            const res = await fetch(`${BACKEND_URL}/api/customer/session-status?session_id=${sessionId}`, {headers: { 'Content-Type': 'application/json'}})
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
            const data = await res.json()

            if (data.status === 'paid') {
              const ticketDetails = data.ticketData
              setSession(ticketDetails)
              navigate('/success', { replace: true, state: { ticketData: ticketDetails } })
              
              socket.emit('bookSeat', {
                showtimeId: ticketDetails.showtime_id,
                seatId: ticketDetails.seats
              })

              socket.disconnect()
              return;

            } else if (data.status === 'unpaid') {
              setError('Payment is processing.')
            } else {
              setError('Payment failed. Please try again.')
            }

          } catch (err) {
              console.error('Error finalize seats: ', err)
          } finally {
            setLoading(false)
          }
        }

        finalizeSeats()

      } else {
          if (!initialSession) { 
            setError('No session ID provided or payment data found.')
          }
          setLoading(false)
      }
    }, [sessionId, navigate, initialSession, setSession])



    if (loading) return <div>Loading payment status...</div>
    if (error) return (
      <div className='ticket'>
        <h1>Transaction Status</h1>
        <div className='ticket-card error-card'>
          <p>{error}</p>
          <p>Please contact support if the issue persists.</p>
        </div>
        <button onClick={() => navigate('/')}>
          Back to Start
        </button>
      </div>
    )
    if (!session) return <div>No session found</div>


    const start = new Date(session.start_time)
    const end = new Date(start.getTime() + Number(session.duration) * 60 * 1000)

    const formatter = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: 'Europe/Paris',
    });

    const time = `${formatter.format(start)} - ${formatter.format(end)}`

    const dateObj = new Date(session.start_time);
    const day = dateObj.getUTCDate().toString().padStart(2, '0');

    const monthNames = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    const month = monthNames[dateObj.getUTCMonth()]

  return (
    <div className='ticket'>
      <h1>Payment Successful!</h1>
      <div className='ticket-card'>
        <div className='ticket-top'>
          <div className='ticket-info'>
            <div className='ticket-div'>
              <h1 className='ticket-title'>{session.title}</h1>
              <div className='ticket-date-box'>
                <div className='ticket-date-day'>{day}</div>
                <div className='ticket-date-month'>{month}</div>
              </div>
            </div>
            <div className='ticket-detail'><strong>THEATER</strong><p>{session.theater}</p></div>
            <div className='ticket-detail'><strong>AUDITORIUM</strong><p>{session.auditorium}</p></div>
            <div className='ticket-detail'><strong>TIME</strong><p>{time}</p></div>
            <div className='ticket-detail'><strong>SEAT(S)</strong><p>{session.seats.join(', ')}</p></div>
          </div>
          
        </div>

        <div className='ticket-bottom'>
          <img className='barcode' src={`data:image/pnd;base64,${session.barcode}`}/>
        </div>

      </div>
      <button
        onClick={() => navigate('/')}
      >
        Back to Start
      </button>
    </div>
  )
}

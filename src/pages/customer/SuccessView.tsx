import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import '../../style/customer/ticket.css'

const API_URL = import.meta.env.VITE_API_URL

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

    const [searchParams, setSearchParams] = useSearchParams()
    const [session, setSession] = useState<Ticket | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const sessionId = searchParams.get('session_id')

    useEffect(() => {
        if (sessionId) {
            fetch(`${API_URL}/api/customer/session-status?session_id=${sessionId}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`)
                    }
                    return res.json()
                })
                .then((data) => {
                    if (data.error) {
                        throw new Error(data.error)
                    }
                    console.log(data)
                    setSession(data)
                    setLoading(false)
                })
                .catch((err) => {
                    setError(err.message)
                    setLoading(false)
                })
        } else {
            setError('No session ID provided')
            setLoading(false)
        }
    }, [sessionId])

    if (loading) return <div>Loading payment status...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!session) return <div>No session found</div>;


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
          <img src={`data:image/pnd;base64,${session.barcode}`}/>
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

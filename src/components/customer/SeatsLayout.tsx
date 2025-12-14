import { useState, useEffect } from 'react'
import { socket } from '../../services/socket'
import '../../style/customer/seats.css'
import ConfirmPopUp from './ConfirmPopUp'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
interface SeatsTicketsProps {
  showtime_id: number
  adultTicket: number
  childTicket: number
}

interface Layout {
  total_seats: number;
  seats_per_row: number;
  auditorium_id: number
};

interface Seat {
    seat_number: number
    status: 'available' | 'reserved' | 'booked'
}


export default function SeatsTickets({showtime_id, adultTicket, childTicket}: SeatsTicketsProps) {

    const [activeSeats, setActiveSeats] = useState<number[]>([])
    const [layout, setLayout] = useState<Layout | null>(null)
    const [seats, setSeats] = useState<Seat[]>([])
    const [showPopUp, setShowPopUp] = useState(false)

    const maxSelect = adultTicket + childTicket
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const layoutReq = await fetch(`${BACKEND_URL}/api/customer/seats/showtimes/${showtime_id}`, {headers: { 'Content-Type': 'application/json'}})
                const layoutData = await layoutReq.json()
                setLayout(layoutData)

                
                const unavailableReq = await fetch(`${BACKEND_URL}/api/customer/seats/showtimes/${showtime_id}/status`, {headers: { 'Content-Type': 'application/json'}})
                const unavailableData = await unavailableReq.json()
                
                const seatArray: Seat[] = Array.from({length: layoutData.total_seats}, (_, i) => ({
                    seat_number: i + 1,
                    status: unavailableData.some((u: { seat_number: number }) => u.seat_number === i + 1) ? 'booked' : 'available'
                }))
                setSeats(seatArray)

            } catch (err) {
                console.log('Error fetching data: ', err)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        socket.emit('joinShowtime', { showtime_id })
        socket.on('seatUpdate', ({ seatId, status }) => {
            setSeats(prev =>
                prev.map(seat =>
                    seatId.includes(seat.seat_number)
                        ? {...seat, status}
                        : seat
                )
            )

            if (status !== 'available') {
                setActiveSeats(prev => prev.filter(s => !seatId.includes(s)))
            }
        })

        socket.on('seatRejected', (rejectedSeats: number[]) => {
            alert('These seats are already taken: ' + rejectedSeats.join(', '))
            setActiveSeats(prev => prev.filter(s => !rejectedSeats.includes(s)))
        })

        return () => {
            socket.off('seatUpdate')
            socket.off('seatRejected')
        }
    }, [showtime_id])

    function handleSeats(seatNumber:number) {
        const seat = seats.find(s => s.seat_number === seatNumber)
        if (!seat || seat.status !== 'available') return

        if (activeSeats.includes(seatNumber)) {
            setActiveSeats(prev => prev.filter(s => s !== seatNumber))
            socket.emit('releaseSeat', { showtimeId: showtime_id, seatId: [seatNumber] })
        } else {
            if (activeSeats.length >= maxSelect) return
            setActiveSeats(prev => [...prev, seatNumber])
            socket.emit('selectSeat', { showtimeId: showtime_id, seatId: [seatNumber] })
        }
    }

    if (!layout) return <div>Loading...</div>;

  return (
    <>
        <div className='auditorium-container'>
            <div className='legend-payment'>
                <div className="legend">
                    <div>
                        <div className='available'></div>
                        <p>Available</p>
                    </div>
                    <div>
                        <div className='unavailable'></div>
                        <p>Unvailable</p>
                    </div>
                    <div>
                        <div className='choosing'></div>
                        <p>Reserved</p>
                    </div>
                </div>
                <button className='payment' onClick={() => setShowPopUp(true)}>Confirm the selection</button>
            </div>

            <div className='seat-layout'>
                <div
                className="seat-grid"
                style={{
                    gridTemplateColumns: `repeat(${layout.seats_per_row}, 1fr)`,
                }}
                >
                {seats.map(seat => {
                    const isActive = activeSeats.includes(seat.seat_number)
                    return(
                        <div key={seat.seat_number} 
                        className={`c-seat ${isActive ? "active" : ""} ${seat.status === 'booked' ? "booked" : seat.status === 'reserved' ? 'reserved' : ""}`}
                        onClick={() => handleSeats(seat.seat_number)}
                        ></div>
                    )
                })}
                </div>
                <div className='screen'>Screen</div>
            </div>
        </div>

        {showPopUp && (
            <ConfirmPopUp 
                adultTicket={adultTicket}
                childTicket={childTicket}
                activeSeats={activeSeats} 
                onClose={() => setShowPopUp(false)}
                showtime_id={showtime_id}/>
        )}
    </>
  )
}

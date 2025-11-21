import { useState, useEffect } from 'react'
import '../../style/customer/ticket.css'
const API_URL = import.meta.env.VITE_API_URL

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


export default function SeatsTickets({showtime_id}: SeatsTicketsProps) {

    const [activeSeats, setActiveSeats] = useState<number[]>([])
    const [layout, setLayout] = useState<Layout | null>(null)
    const [unavailable, setUnavailable] = useState<number[]>([])
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const layoutReq = await fetch(`${API_URL}/api/customer/seats/showtimes/${showtime_id}`)
                const layoutData = await layoutReq.json()

                const unavailableReq = await fetch(`${API_URL}/api/customer/seats/showtimes/${showtime_id}/status`)
                const unavailableData = await unavailableReq.json()
                

                setLayout(layoutData)
                setUnavailable(unavailableData.map((item: { seat_number: number }) => item.seat_number))
            } catch (err) {
                console.log('Error fetching data: ', err)
            }
        }
        fetchData()
    }, [])

    function handleSeats(seat:number) {
        setActiveSeats(prev => {
            if (prev.length === 0) return [seat]
            return prev.includes(seat)
            ? prev.filter(s => s !== seat) 
            : [...prev, seat]
        })
    }
    
    if (!layout) return <div>Loading...</div>;
    
    function handleSubmit() {
        if (!layout) return

        fetch(`${API_URL}/api/customer/booking`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                showtime_id: showtime_id,
                auditorium_id : layout.auditorium_id,
                seat_numbers: activeSeats,
                status: 'booked'
            })
        })

    }


    const seats = Array.from({length: layout.total_seats}, (_, i) => i + 1)

  return (
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
                    <p>Choosing</p>
                </div>
            </div>
            <button className='payment' onClick={() => handleSubmit()}>Go to payment</button>
        </div>

        <div className='seat-layout'>
            <div
            className="seat-grid"
            style={{
                gridTemplateColumns: `repeat(${layout.seats_per_row}, 1fr)`,
            }}
            >
            {seats.map(seat => {
                const isActive = activeSeats.includes(seat)
                const isUnavailable = unavailable.includes(seat)

                return(
                    <div key={seat} 
                    className={`seat ${isActive ? "active" : ""} ${isUnavailable ? "booked" : ""}`}
                    onClick={() => !isUnavailable &&  handleSeats(seat)}
                    ></div>
                )
            })}
            </div>

            <div className='screen'>Screen</div>
        </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import '../../style/customer/ticket.css'
const API_URL = import.meta.env.VITE_API_URL

interface SeatsTicketsProps {
  showtime_id: number
}

interface Layout {
  total_seats: number;
  seats_per_row: number;
};


export default function SeatsTickets({showtime_id}: SeatsTicketsProps) {

    const [activeSeats, setActiveSeats] = useState<number[]>([])
    const [layout, setLayout] = useState<Layout | null>(null)

    

    function handleSeats(seat:number) {
        setActiveSeats(prev => 
            prev.includes(seat)
                ? prev.filter(s => s !== seat) 
                : [...prev, seat]
        )
    }

    useEffect(() => {
        fetch(`${API_URL}/api/customer/seats/showtimes/${showtime_id}`)
            .then(res => res.json())
            .then(data => setLayout(data))
    }, [])

    if (!layout) return <div>Loading...</div>;

    const seats = Array.from({length: layout.total_seats}, (_, i) => i + 1)

  return (
    <div className='auditorium-container'>
        

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

        <div className='seat-layout'>
            <div
            className="seat-grid"
            style={{
                gridTemplateColumns: `repeat(${layout.seats_per_row}, 1fr)`,
            }}
            >
            {seats.map(seat => (
                <div key={seat} 
                className={`seat ${activeSeats.includes(seat) ? "active" : ""}`}
                onClick={() => handleSeats(seat)}
                ></div>
            ))}
            </div>

            <div className='screen'>Screen</div>
        </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../style/customer/popup.css'


const API_URL = import.meta.env.VITE_API_URL


interface PopUpProps {
    showtime_id: number
    adultTicket: number
    childTicket: number
    activeSeats: number[]
    onClose?: () => void
}

export default function ConfirmPopUp({showtime_id, adultTicket, childTicket, activeSeats, onClose}: PopUpProps) {

    const navigate = useNavigate()
    
    const [email, setEmail] = useState('')

    function handleSubmit() {
        fetch(`${API_URL}/api/customer/booking`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                showtime_id: showtime_id,
                seat_numbers: activeSeats,
                status: 'booked',
                email: email
            })
        })
        navigate('/checkout',  {state: {email, showtime_id, adultTicket, childTicket}})
    }

  return (
    <div className='popup-overlay'>
        <div className='popup-container'>
            <h3>Enter your email to receive ticket</h3>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <div>
                <button onClick={onClose}>Cancel</button>
                <button onClick={handleSubmit}>Go to payment</button>
            </div>
        </div>
      </div>  
    )
}

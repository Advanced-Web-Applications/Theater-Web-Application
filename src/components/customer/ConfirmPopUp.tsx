import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../style/customer/popup.css'

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

  return (
    <div className='popup-overlay'>
        <div className='popup-container'>
            <h3>Enter your email to receive ticket</h3>
            <div>Seat(s): {activeSeats.join(', ')}</div>
            <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
            <div>
                <button onClick={onClose}>Cancel</button>
                <button onClick={() => navigate('/checkout',  {state: {email, showtime_id, adultTicket, childTicket, activeSeats}})}>Go to payment</button>
            </div>
        </div>
      </div>  
    )
}

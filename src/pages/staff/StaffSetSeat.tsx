import { useState } from 'react';
import "../../style/staff/staff.css"

export default function StaffSetSeat() {
    const [seats, setSeats] = useState(Array(50).fill(true));

    const toggleSeat = (i: number) => {
        const updatedSeats = [...seats];
        updatedSeats[i] = !updatedSeats[i];
        setSeats(updatedSeats);
    };

    return (
        <div>
            <div className='symbolForSeat'>
            <div><span className='availableSeat'></span>Available</div>
            <div><span className='unavailableSeat'></span>Unavailable</div>
        </div>

        <div className='gridForAllSeat'>
            {seats.map((isAvailable, index) => (
                <div key={index} onClick={() => toggleSeat(index)} className='seatSetting' style={{ backgroundColor: isAvailable ? '#36597C' : '#FF0000' }}
                ></div>
            ))}
        </div>


    </div>
  )
}

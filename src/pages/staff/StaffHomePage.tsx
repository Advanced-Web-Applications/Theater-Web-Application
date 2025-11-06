import "../../style/staff/staff.css"
import { useNavigate } from 'react-router-dom'

const auditoriumRooms = [
  {auditoriumNumber:1 , name: '1'},
  {auditoriumNumber:2 , name: '2'},
  {auditoriumNumber:3 , name: '3'},
  {auditoriumNumber:4 , name: '4'},
]

export default function StaffHomePage() {

  const navigate = useNavigate();
  return (
    <div>
        <div className="header">
            <h1>Auditorium</h1>
        </div>
        <div className="gridContainer">
            {auditoriumRooms.map((room) => (
                <div key={room.auditoriumNumber} className="roomCard">
                    <div className="content">{room.name}</div>
                    <div className="auditoriumButton">
                        <button onClick={() => navigate('/StaffSetSeat')}>Set seat</button>
                        <button onClick={() => navigate('/StaffSetTimes')}>Set times</button>
                        <button onClick={() => navigate('/StaffSeeTable')}>See table</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

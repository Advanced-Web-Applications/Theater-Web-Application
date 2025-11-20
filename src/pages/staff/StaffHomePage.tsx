import { useParams } from "react-router-dom";
import "../../style/staff/staff.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type AuditoriumRoom = {
  auditoriumNumber: number;
  name: string;
  totalSeats?: number;
  seatsPerRow?: number;
};

type Theater = {
  id: number;
  name: string;
  rooms: AuditoriumRoom[];
};

export default function StaffHomePage() {
  const { id } = useParams();
  const theaterId = Number(id);
  const [currentTheater, setCurrentTheater] = useState<Theater | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/staff/theaters/${theaterId}`)
      .then((res) => res.json())
      .then((data) => setCurrentTheater(data))
      .catch((err) => console.error(err));
  }, [theaterId]);

  if (!currentTheater) return <div>Loading...</div>;

  const rooms = currentTheater.rooms || [];

  return (
    <div>
      <p className="theaterName">{currentTheater?.name}</p>
      <div className="header">
        <h1>Auditorium</h1>
      </div>
      <div className="gridContainer">
        {rooms.map((room) => (
          <div key={room.auditoriumNumber} className="roomCard">
            <div className="content">{room.name}</div>
            <div className="auditoriumButton">
              <button onClick={() => navigate(`/StaffSetSeat/${id}/${room.auditoriumNumber}`)}>Set Seats</button>
              <button onClick={() => navigate(`/StaffSeeTable/${id}/${room.auditoriumNumber}`)}>See Table</button>
              <button onClick={() => navigate(`/StaffSetTimes/${id}/${room.auditoriumNumber}`)}>Set Times</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

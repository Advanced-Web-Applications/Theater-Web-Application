import { useParams, useNavigate } from "react-router-dom";
import "../../style/staff/staff.css";
import { useTheater } from "../../components/staff/theaterData";

export default function StaffHomePage() {
  const { id } = useParams();
  const theaterId = Number(id);
  const navigate = useNavigate();

  const { theater: currentTheater, loading, error } = useTheater(theaterId);

  if (loading) return <div>Loading</div>;
  if (error) return <div>{error}</div>;
  if (!currentTheater) return <div>No theater found</div>;

  const rooms = currentTheater.rooms || [];

  return (
    <div>
      <p className="theaterName">{currentTheater.name}</p>
      <div className="header">
        <h1>Auditorium</h1>
      </div>
      <div className="gridContainer">
        {rooms.map((room) => (
          <div key={room.auditoriumNumber} className="roomCard">
            <div className="content">{room.name}</div>
            <div className="auditoriumButton">
              <button onClick={() => navigate(`/StaffSetSeat/${id}/${room.auditoriumNumber}`)}>Set Seats</button>
              <button onClick={() => navigate(`/StaffSetTimes/${id}/${room.auditoriumNumber}`)}>Set Times</button>
              <button onClick={() => navigate(`/StaffSeeTable/${id}/${room.auditoriumNumber}`)}>See Table</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

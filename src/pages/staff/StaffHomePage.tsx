import { useParams, useNavigate } from "react-router-dom";
import "../../style/staff/staffHomepages.css";
import { useTheater } from "../../components/staff/theaterData";
import StaffNavBar from "../../components/staff/staffNavBar";

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
    <div className="staffPageContainer">
      <StaffNavBar theater={currentTheater} title="Auditorium" />

      <div className="gridContainer">
        {rooms.map((room) => (
          <div key={room.auditoriumNumber} className="roomCard">
            <div className="roomDefault">
              <div className="roomNumber">{room.name}</div>
            </div>
            
            <div className="roomHover">
              <button 
                className="actionButton"
                onClick={() => navigate(`/StaffSetSeat/${id}/${room.auditoriumNumber}`)}
              >
                Set Seats
              </button>
              <button 
                className="actionButton"
                onClick={() => navigate(`/StaffSetTimes/${id}/${room.auditoriumNumber}`)}
              >
                Set Times
              </button>
              <button 
                className="actionButton"
                onClick={() => navigate(`/StaffSeeTable/${id}/${room.auditoriumNumber}`)}
              >
                See Table
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../style/staff/setSeat.css";
import { useShowtimeSeats } from "../../components/staff/setSeat";
import { useTheater } from "../../components/staff/theaterData";
import StaffNavBar from "../../components/staff/staffNavBar";

export default function StaffSetSeat() {
  const navigate = useNavigate();
  const { id, auditorium } = useParams();
  const theaterId = Number(id);
  const auditoriumId = Number(auditorium);

  //get theater address
  const { theater: currentTheater, loading, error } = useTheater(theaterId);

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const {
    showtimes,
    selectedShowtimeId,
    setSelectedShowtimeId,
    layout,
    unavailable,
    seatChanges,
    toggleSeatStatus,
    saveSeatStatus
  } = useShowtimeSeats(auditoriumId, selectedDate);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!currentTheater) return <div>No theater found</div>;

  function RoomGrid() {
    if (!layout) return null;

    const seats = Array.from({ length: layout.total_seats }, (_, i) => i + 1);

    const getSeatColor = (seat: number) => {
      const seatChange = seatChanges.find(s => s.seat_number === seat);
      const isBooked = unavailable.includes(seat);
      if (seatChange?.status === "maintenance") return "grey";
      if (isBooked) return "#ff4d4d";
      return "#36597C";
    };

    const getSeatClass = (seat: number) => {
      const seatChange = seatChanges.find(s => s.seat_number === seat);
      const isBooked = unavailable.includes(seat);
      if (seatChange?.status === "maintenance") return "seatForStaff maintenance";
      if (isBooked) return "seatForStaff unavailable";
      return "seatForStaff available";
    };

    return (
      <div className="seat-layout">
        <div className="seat-grid" style={{ gridTemplateColumns: `repeat(${layout.seats_per_row}, max-content)` }}>
          {seats.map(seat => (
            <div
              key={seat}
              className={getSeatClass(seat)}
              onClick={() => toggleSeatStatus(seat)}
              style={{
                backgroundColor: getSeatColor(seat),
                cursor: unavailable.includes(seat) ? "not-allowed" : "pointer"
              }}
            >
              {seat}
            </div>
          ))}
        </div>
        <div className="screen">Screen</div>
        <button className="saveButtonSetSeat" onClick={saveSeatStatus}>Save</button>
        <button
          className="saveButtonSetSeat"
          onClick={() => navigate(`/StaffHomePage/${id}`)}
        >
          ← Go back
        </button>
      </div>
    );
  }

  return (
    <div>
      <StaffNavBar theater={currentTheater} title="Set Seats" />
      <div className="auditorium-container">
        
        <div className="date-time-selection">
          <div style={{ marginBottom: 12 }}>
            <label>Select date:</label>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
          </div>
          <div className="time-grid">
            {showtimes.length === 0
              ? <div style={{ color: '#666' }}>No showtimes for this date</div>
              : showtimes.map(s => (
                <div
                  key={s.id}
                  className={`time-box ${selectedShowtimeId === s.id ? "selected" : ""}`}
                  onClick={() => setSelectedShowtimeId(s.id)}
                >
                  {s.movie_title} 
                  <br />
                  {new Date(s.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12 : false })} 
                </div>
              ))
            }
          </div>
        </div>

        {layout && <RoomGrid />}
      </div>
    </div>
  );
}
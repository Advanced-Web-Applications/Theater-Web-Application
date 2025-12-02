import { useParams } from "react-router-dom";
import { useState } from "react";
import "../../style/staff/staff.css";
import { useShowtimeSeats } from "../../components/staff/setSeat";

export default function StaffSetSeat() {
  const { auditorium } = useParams();
  const auditoriumId = Number(auditorium);
  const [selectedDate, setSelectedDate] = useState<string>("");

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
      if (seatChange?.status === "maintenance") return "seat maintenance";
      if (isBooked) return "seat booked";
      return "seat available";
    };

    return (
      <div className="seat-layout">
        <div className="seat-grid" style={{ gridTemplateColumns: `repeat(${layout.seats_per_row}, 1fr)` }}>
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
        <button className="save-button-for-seat" onClick={saveSeatStatus}>Save</button>
      </div>
    );
  }

  return (
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
                {new Date(s.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                <br />
                {s.title}
              </div>
            ))
          }
        </div>
      </div>
      {layout && <RoomGrid />}
    </div>
  );
}

import { useEffect, useState } from "react";
import "../../style/staff/staff.css";
import { useParams } from "react-router-dom";

export default function StaffSetSeat() {
  const { id, auditorium } = useParams();

  const theaterName = id === "1" ? "Nova Oulu" : id === "2" ? "Kino Baltic Turku" : id === "3" ? "Elokuvateatteri Helsinki Central" : "Unknown Theater";
    const theater = { theaterId: id, theaterName: theaterName, auditoriumId: auditorium };

  const handleSave = () => {
    const key = `seats_${id}_${auditorium}`;
    localStorage.setItem(key, JSON.stringify(seats)); 
    alert("Seat configuration saved successfully!");
  };

  const getSeatCount = (theaterId: string | undefined, auditoriumId: string | undefined,) => {
    if (theaterId === "1") {
      if (auditoriumId === "1") 
        return 145;
      if (auditoriumId === "2") 
        return 87;
      if (auditoriumId === "3") 
        return 163;
    }
    if (theaterId === "2") {
      if (auditoriumId === "1") 
        return 192;
      if (auditoriumId === "2") 
        return 76;
      if (auditoriumId === "3") 
        return 134;
      if (auditoriumId === "4") 
        return 58;
    }
    if (theaterId === "3") {
      if (auditoriumId === "1") 
        return 178;
      if (auditoriumId === "2") 
        return 121;
    }
    return 50;
  };

  const totalSeats = getSeatCount(id, auditorium);
  const [seats, setSeats] = useState(Array(totalSeats).fill(true));

  const toggleSeat = (i: number) => {
    const updatedSeats = [...seats];
    updatedSeats[i] = !updatedSeats[i];
    setSeats(updatedSeats);
  };

  return (
    <div>
      <h2 className="theaterName">
        {theater.theaterName} — Auditorium {auditorium} 
      </h2>

      <div className="staffGoBackHeader">
        <button className="goBackButton" onClick={() => { window.location.href = `/StaffHomePage/${id}`; }}>← Go back</button>
      </div>

      <div className="seatContainer">
        <div className="symbolForSeat">
          <div><span className="availableSeat"></span>Available</div>
          <div><span className="unavailableSeat"></span>Unavailable</div>
        </div>
        <div className="seatRow">
          <div className="exitStress">←Exit</div>
          <div className="gridForAllSeat">
            {seats.map((isAvailable, index) => (
              <div
                key={index}
                onClick={() => toggleSeat(index)}
                className="seatSetting"
                style={{ backgroundColor: isAvailable ? "#36597C" : "#FF0000" }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      <div className="screenView">Screen</div>
      <div>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

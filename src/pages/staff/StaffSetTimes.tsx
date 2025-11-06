import { useState } from "react"
import "../../style/staff/staff.css"

export default function StaffSetTimes() {
  const [movie, setMovie] = useState("Chainsaw man");
  const [date, setDate] = useState("2024-07-01");
  const [time, setTime] = useState("12:00 PM");

  const handleSave = () => {
    const newShow = { movie, date, time };

    const existing = JSON.parse(localStorage.getItem("showtimes") || "[]");
    existing.push(newShow);
    localStorage.setItem("showtimes", JSON.stringify(existing));
    alert("Showtime saved successfully!");
};
  return (
    <div>
        <div className="setTimeBorder">
            <label className="titleOfSelection" htmlFor="MovieName">Movie Name:</label>
            <select id="MovieName" value={movie} onChange={(e) => setMovie(e.target.value)}>
                <option value="Chainsaw man">Chainsaw man</option>
                <option value="Demon Slayer">Demon Slayer</option>
                <option value="Jujutsu Kaisen">Jujutsu Kaisen</option>
            </select>

            <label htmlFor="ShowDate">Show Date:</label>
            <select id="ShowDate" value={date} onChange={(e) => setDate(e.target.value)}>
                <option value="2024-07-01">2024-07-01</option>
                <option value="2024-07-02">2024-07-02</option>
                <option value="2024-07-03">2024-07-03</option>
            </select>

            <label htmlFor="ShowTime">Show Time:</label>
            <select id="ShowTime" value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="12:00 PM">12:00 PM</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="6:00 PM">6:00 PM</option>
            </select>
            <div className="saveBorder">
                <button className="saveButton" onClick={handleSave}>Save</button>
            </div>
        </div>

    </div>
  )
}

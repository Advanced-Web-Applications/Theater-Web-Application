import { useState } from "react";
import { useParams } from "react-router-dom";
import "../../style/staff/setTime.css";
import { useTheater } from "../../components/staff/theaterData";// navigation bar theater info
import StaffNavBar from "../../components/staff/staffNavBar";
import { useShowtimeAPI } from "../../components/staff/useShowtimeAPI";

export default function StaffSetTimes() {
  const { id, auditorium } = useParams();
  const theaterId = Number(id);

  const { theater: currentTheater, loading, error } = useTheater(theaterId);

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [movieId, setMovieId] = useState<number | "">("");

  const {
    movies,
    existShowtimes,
    loadingMovies,
    loadingShowtimes,
    saveShowtime,
  } = useShowtimeAPI(auditorium, date);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Paris"
    });
  };

  const handleSave = async () => {
    if (!movieId || !date || !hour || !minute) {
      alert("Please select movie, date, and time");
      return;
    }

    const time = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
    const startTime = `${date}T${time}`;

    try {
      await saveShowtime(Number(movieId), Number(auditorium), startTime);
      alert("Showtime saved!");
      setHour("");
      setMinute("");
    } catch (err: any) {
      alert(err.message || "Error saving showtime");
    }
  };

  if (loading || loadingMovies) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!currentTheater) return <div>No theater found</div>;

  return (
    <div className="body">
      <StaffNavBar theater={currentTheater} title="Set Times" />

      <div className="setTimeContainer">
        <div className="setTimeBorder">
          <label htmlFor="ShowDate">Show Date:</label>
          <input
            type="date"
            id="ShowDate"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label className="titleOfSelection" htmlFor="MovieName">
            Movie Name:
          </label>
          <select
            className="movieSelect"
            id="MovieName"
            value={movieId}
            onChange={(e) => setMovieId(Number(e.target.value))}
          >
            <option value="">Select Movie</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>

          <label htmlFor="ShowTime">Show Time:</label>
          <div className="timeSelector">
            <select
              className="timeSelect"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
            >
              <option value="">Hour</option>
              {Array.from({ length: 12 }, (_, i) => i + 12).map((h) => (
                <option key={h} value={h.toString()}>
                  {h.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
            <span className="timeSeparator">:</span>
            <select
              className="timeSelect"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
            >
              <option value="">Minute</option>
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i.toString()}>
                  {i.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button className="saveButton" onClick={handleSave}>
              Save
            </button>

            <button
              className="saveButton"
              onClick={() => (window.location.href = `/StaffHomePage/${id}`)}
            >
              ← Go back
            </button>
          </div>
        </div>

        {date && (
          <div className="existShowtimes">
            <h3>
              Auditorium {auditorium} - {date} showtime
            </h3>

            {loadingShowtimes ? (
              <p>Loading</p>
            ) : existShowtimes.length === 0 ? (
              <p className="noShowtimes">No showtimes for this date</p>
            ) : (
              <div className="showtimeList">
                {existShowtimes.map((showtime) => (
                  <div key={showtime.id} className="showtimeItem">
                    <div className="showtimeDetails">
                      <span className="movieTime">
                        {showtime.movie_title} :{" "}
                        {formatTime(showtime.start_time)} -{" "}
                        {formatTime(showtime.end_time)}
                      </span>
                      <span className="cleanTime">
                        Cleaning time {formatTime(showtime.end_time)} -{" "}
                        {formatTime(showtime.clean_end_time)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

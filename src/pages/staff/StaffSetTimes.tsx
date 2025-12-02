import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../style/staff/staff.css";

const API_URL = import.meta.env.VITE_API_URL;

type Movie = {
  id: number;
  title: string;
};

export default function StaffSetTimes() {
  const { id, auditorium } = useParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieId, setMovieId] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/staff/movies`)
      .then((res) => res.json())
      .then((data: Movie[]) => {
        setMovies(data);
        if (data.length > 0) setMovieId(data[0].id); 
      })
      .catch((err) => console.error("Cannot fetching movies:", err));
  }, []);

  const handleSave = async () => {
    if (!movieId || !date || !time) {
      alert("Please select movie, date, and time");
      return;
    }

    const startTime = new Date(`${date}T${time}`).toISOString();

    try {
      const res = await fetch(`${API_URL}/api/staff/showtimes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movie_id: movieId,
          auditorium_id: Number(auditorium),
          start_time: startTime,
        }),
      });

      if (!res.ok){
        if(res.status === 409) {
          const data = await res.json();
          alert(data.message);
          return;
        }
        throw new Error("Failed to save showtimes");
      }

      alert("Showtime saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving showtime");
    }
  };

  return (
    <div>
      <div className="staffGoBackHeader">
        <button
          className="goBackButton"
          onClick={() => (window.location.href = `/StaffHomePage/${id}`)}
        >
          ← Go back
        </button>
      </div>

      <div className="setTimeBorder">
        <label className="titleOfSelection" htmlFor="MovieName">
          Movie Name:
        </label>
        <select
          className="movieSelect"
          id="MovieName"
          value={movieId}
          onChange={(e) => setMovieId(Number(e.target.value))}
        >
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.title}
            </option>
          ))}
        </select>

        <label htmlFor="ShowDate">Show Date:</label>
        <input
          type="date"
          id="ShowDate"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label htmlFor="ShowTime">Show Time:</label>
        <input
          type="time"
          id="ShowTime"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <div>
          <button className="saveButton" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

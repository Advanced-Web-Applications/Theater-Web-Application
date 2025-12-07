import { useState, useEffect } from "react";
import type { Showtime } from "./setSeat";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export type Movie = {
  id: number;
  title: string;
};

export function useShowtimeAPI(auditorium?: string, date?: string) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [existShowtimes, setExistShowTimes] = useState<Showtime[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);

  //get movies list from backend
  useEffect(() => {
    fetch(`${API_URL}/api/staff/movies`)
      .then((res) => res.json())
      .then((data: Movie[]) => {
        setMovies(data);
        setLoadingMovies(false);
      })
      .catch((err) => {
        console.error("Cannot fetch movies:", err);
        setMovies([]);
        setLoadingMovies(false);
      });
  }, []);

  // get showtimes for a specific date and auditorium
  useEffect(() => {
    if (!auditorium || !date) {
      setExistShowTimes([]);
      return;
    }

    setLoadingShowtimes(true);
    fetch(`${API_URL}/api/staff/showtimes/${auditorium}/${date}`)
      .then((res) => res.json())
      .then((data: Showtime[]) => {
        setExistShowTimes(data);
        setLoadingShowtimes(false);
      })
      .catch((err) => {
        console.error("Error fetching showtimes:", err);
        setExistShowTimes([]);
        setLoadingShowtimes(false);
      });
  }, [auditorium, date]);

  // add new showtime
  const saveShowtime = async (
    movieId: number,
    auditoriumId: number,
    startTime: string
  ) => {
    const res = await fetch(`${API_URL}/api/staff/showtimes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        movie_id: movieId,
        auditorium_id: auditoriumId,
        start_time: startTime,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to save showtime");
    }

    return true;
  };

  return {
    movies,
    existShowtimes,
    loadingMovies,
    loadingShowtimes,
    saveShowtime,
  };
}

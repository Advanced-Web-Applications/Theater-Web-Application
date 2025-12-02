import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export type AuditoriumRoom = {
  auditoriumNumber: number;
  name: string;
  totalSeats?: number;
  seatsPerRow?: number;
};

export type Theater = {
  id: number;
  name: string;
  rooms: AuditoriumRoom[];
};

export function useTheater(theaterId: number) {
  const [theater, setTheater] = useState<Theater | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/staff/theaters/${theaterId}`)
      .then((res) => res.json())
      .then((data: Theater) => {
        setTheater(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch theater data");
        setLoading(false);
      });
  }, [theaterId]);

  return { theater, loading, error };
}

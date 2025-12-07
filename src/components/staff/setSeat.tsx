import { useState, useEffect } from "react";
import "../../style/staff/staff.css";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export interface Layout {
  total_seats: number;
  seats_per_row: number;
  auditorium_id: number;
}

export interface Showtime {
  id: number;
  start_time: string;
  movie_title: string;
  end_time: string;
  clean_end_time : string;
}

export interface SeatStatus {
  seat_number: number;
  status: "booked" | "available" | "maintenance";
}

export interface SeatChange {
  seat_number: number;
  status: "available" | "maintenance";
}

export function useShowtimeSeats(auditoriumId: number, selectedDate: string) {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<number | null>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [unavailable, setUnavailable] = useState<number[]>([]);
  const [seatChanges, setSeatChanges] = useState<SeatChange[]>([]);

  useEffect(() => {
    if (!selectedDate) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/staff/showtimes/${auditoriumId}`);
        const data: Showtime[] = await res.json();
        const filtered = data.filter(show => show.start_time.startsWith(selectedDate));
        setShowtimes(filtered);
        setSelectedShowtimeId(filtered[0]?.id || null);
      } catch {
        setShowtimes([]);
        setSelectedShowtimeId(null);
      }
    })();
  }, [auditoriumId, selectedDate]);

  useEffect(() => {
    if (!selectedShowtimeId) {
      setLayout(null);
      setUnavailable([]);
      setSeatChanges([]);
      return;
    }

    (async () => {
      try {
        const layoutRes = await fetch(`${API_URL}/api/staff/seats/showtimes/${selectedShowtimeId}`);
        if (!layoutRes.ok) return;
        const layoutData: Layout = await layoutRes.json();
        setLayout(layoutData);

        const statusRes = await fetch(`${API_URL}/api/staff/seats/showtimes/${selectedShowtimeId}/status`);
        if (!statusRes.ok) return;
        const statusData: SeatStatus[] = await statusRes.json();

        const bookedSeats = statusData.filter(s => s.status === "booked").map(s => s.seat_number);
        const maintenanceSeats = statusData.filter(s => s.status === "maintenance").map(s => s.seat_number);

        setUnavailable(bookedSeats);
        setSeatChanges(maintenanceSeats.map(s => ({ seat_number: s, status: "maintenance" })));
      } catch {
        setLayout(null);
        setUnavailable([]);
        setSeatChanges([]);
      }
    })();
  }, [selectedShowtimeId]);

  const toggleSeatStatus = (seat_number: number) => {
    if (unavailable.includes(seat_number)) return;
    setSeatChanges(prev => {
      const existing = prev.find(s => s.seat_number === seat_number);
      if (existing) {
        const newStatus = existing.status === "maintenance" ? "available" : "maintenance";
        return prev.map(s => s.seat_number === seat_number ? { ...s, status: newStatus } : s);
      } else {
        return [...prev, { seat_number, status: "maintenance" }];
      }
    });
  };

  const saveSeatStatus = async () => {
    if (!selectedShowtimeId || seatChanges.length === 0) {
      alert("No changes to save");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/staff/seats/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showtime_id: selectedShowtimeId, seats: seatChanges })
      });
      if (!res.ok) throw new Error("Save failed");

      alert("Seat status saved successfully");

      const statusRes = await fetch(`${API_URL}/api/staff/seats/showtimes/${selectedShowtimeId}/status`);//for refresh after save
      const statusData: SeatStatus[] = await statusRes.json();
      const bookedSeats = statusData.filter(s => s.status === "booked").map(s => s.seat_number);
      const maintenanceSeats = statusData.filter(s => s.status === "maintenance").map(s => s.seat_number);

      setUnavailable(bookedSeats);
      setSeatChanges(maintenanceSeats.map(s => ({ seat_number: s, status: "maintenance" })));
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };
  return { showtimes, selectedShowtimeId, setSelectedShowtimeId, layout, unavailable, seatChanges, toggleSeatStatus, saveSeatStatus };
}

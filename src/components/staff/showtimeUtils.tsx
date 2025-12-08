import "../../style/staff/staffSeeTable.css";
import React from "react";

export type ShowTime = {
  id: number;
  movie: string;
  date: string;
  time: number;
  minute: number;
  duration: number;
};

const API_URL = import.meta.env.VITE_BACKEND_URL;

// fetch show times list
export const fetchShowTimes = async (auditorium: string | undefined): Promise<ShowTime[]> => {
  if (!auditorium) return [];

  try {
    const res = await fetch(`${API_URL}/api/staff/showtimes/${auditorium}`);
    const data = await res.json();

    return data.map((s: any) => {
      const d = new Date(s.start_time);

      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Paris',
        hour: 'numeric',
        minute: 'numeric',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour12: false
      });

      const parts = formatter.formatToParts(d);
      
      const getPart = (type: string) => parts.find(p => p.type === type)?.value;

      const parisYear = getPart('year');
      const parisMonth = getPart('month');
      const parisDay = getPart('day');
      const parisHour = parseInt(getPart('hour') || '0', 10);
      const parisMinute = parseInt(getPart('minute') || '0', 10);

      const parisDateString = `${parisYear}-${parisMonth}-${parisDay}`;

      return {
        id: s.id,
        movie: s.movie_title,
        date: parisDateString, 
        time: parisHour,
        minute: parisMinute,
        duration: s.duration || 120,
      };
    });
  } catch (err) {
    console.error("Error fetching showtimes:", err);
    return [];
  }
};

// save show time - backend will handle all validations
export const saveShowTime = async (show: ShowTime) => {
  try {
    const res = await fetch(`${API_URL}/api/staff/showtimes/${show.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: show.date,
        time: show.time,
        minute: show.minute,
      }),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      return { 
        success: false, 
        message: data.message || "Failed to update showtime" 
      };
    }
    
    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { 
      success: false, 
      message: err.message || "Network error" 
    };
  }
};

// delete show times
export const deleteShowTime = async (id: number) => {
  try {
    const res = await fetch(`${API_URL}/api/staff/showtimes/${id}`, { 
      method: "DELETE" 
    });
    const data = await res.json();
    
    if (!res.ok) {
      return { 
        success: false, 
        message: data.message || "Failed to delete showtime" 
      };
    }
    
    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { 
      success: false, 
      message: err.message || "Network error" 
    };
  }
};

// create week dates array
export const getWeekDates = (currentWeekStart: Date): Date[] => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(currentWeekStart.getDate() + i);
    return d;
  });
};

// check if the date is today
export const isToday = (date: Date) => {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

// timr from 12 to 2am
export const hours = [
  ...Array.from({ length: 12 }, (_, i) => i + 12), // 12-23
  0, 1, 2 // 00-02
];

// TimeBody modal
type TimeBodyProps = {
  showTimes: ShowTime[];
  weekDates: Date[];
  onSelectShow: (show: ShowTime) => void;
};

export const TimeBody: React.FC<TimeBodyProps> = ({ showTimes, weekDates, onSelectShow }) => {
  return (
    <>
      {hours.map((hour) => {
        const tds = [];
        tds.push(
          <td key="time" className="timeTable timeColumn">
            {hour.toString().padStart(2, "0")}:00
          </td>
        );

        weekDates.forEach((date, dayIndex) => {
          const showsInCell = showTimes.filter((show) => {
            const showDate = new Date(show.date);
            return (
              showDate.getFullYear() === date.getFullYear() &&
              showDate.getMonth() === date.getMonth() &&
              showDate.getDate() === date.getDate() &&
              show.time === hour
            );
          });

          tds.push(
            <td key={dayIndex} className="timeTable timeCellWrapper">
              {showsInCell.map((show) => {
                const topOffset = show.minute;
                const movieDurationInHours = show.duration / 60;
                const movieBlockHeight = movieDurationInHours * 60 - 4;
                const cleaningBlockHeight = 0.5 * 60 - 4;
                const totalHeight = (movieDurationInHours + 0.5) * 60 - 4;

                const totalMinutes = show.time * 60 + show.minute + show.duration;
                const endHour = Math.floor(totalMinutes / 60) % 24;  // 24-hour format
                const endMinute = totalMinutes % 60;
                const cleanEndMinutes = totalMinutes + 30;
                const cleanEndHour = Math.floor(cleanEndMinutes / 60) % 24;
                const cleanEndMinute = cleanEndMinutes % 60;

                return (
                  <div
                    key={show.id}
                    className="showContainer"
                    style={{ height: `${totalHeight}px`, top: `${topOffset}px` }}
                  >
                    <div
                      className="movieBlock"
                      style={{ height: `${movieBlockHeight}px` }}
                      onClick={() => onSelectShow(show)}
                    >
                      <div className="movieTitleInfo">{show.movie}</div>
                      <div className="movieTimeInfo">
                        {show.time.toString().padStart(2, "0")}:
                        {show.minute.toString().padStart(2, "0")} -{" "}
                        {endHour.toString().padStart(2, "0")}:
                        {endMinute.toString().padStart(2, "0")}
                      </div>
                      <div className="movieDuration">{show.duration} min</div>
                    </div>

                    <div className="cleaningBlock" style={{ height: `${cleaningBlockHeight}px` }}>
                      <span>
                        Cleaning Time: {endHour.toString().padStart(2, "0")}:
                        {endMinute.toString().padStart(2, "0")} -{" "}
                        {cleanEndHour.toString().padStart(2, "0")}:
                        {cleanEndMinute.toString().padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </td>
          );
        });

        return <tr key={hour}>{tds}</tr>;
      })}
    </>
  );
};

// Header modal
type HeaderProps = { weekDates: Date[] };
export const Header: React.FC<HeaderProps> = ({ weekDates }) => (
  <tr>
    <th className="timeTable">Time</th>
    {weekDates.map((d, i) => (
      <th key={i} className={`timeTable ${isToday(d) ? "todayColumn" : ""}`}>
        {d.toLocaleDateString("en-GB", {
          weekday: "short",
          month: "numeric",
          day: "numeric",
        })}
      </th>
    ))}
  </tr>
);
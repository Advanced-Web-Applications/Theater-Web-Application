import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function StaffSeeTable() {
  const { auditorium } = useParams();

  const [modalOpen, setModalOpen] = useState(false);

  const [editableDate, setEditableDate] = useState("");
  const [editableTime, setEditableTime] = useState<number | "">("");

  const [selectedShow, setSelectedShow] = useState<{
    id: number;
    movie: string;
    date: string;
    time: number;
  } | null>(null);

  const hours = Array.from({ length: 12 }, (_, i) => i + 12);

  const [showTimes, setShowTimes] = useState<
    { id: number; movie: string; date: string; time: number }[]
  >([]);

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = new Date();
    const day = now.getDay() || 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day - 1));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  useEffect(() => {
    fetch(`${API_URL}/api/staff/showtimes/${auditorium}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched showtimes:", data);

        setShowTimes(
          data.map((s: any) => {
            const d = new Date(s.start_time);
            return {
              id: s.id,
              movie: s.title,
              date: s.start_time.split("T")[0],
              time: d.getHours(),
            };
          })
        );
      })
      .catch((err) => console.error("Error fetching showtimes:", err));
  }, [auditorium]);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(currentWeekStart.getDate() + i);
    return d;
  });


  const handleSave = async () => {
    if (!selectedShow) return;

    await fetch(
      `${API_URL}/api/staff/showtimes/${selectedShow.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: editableDate,
          time: editableTime,
        }),
      }
    );

    setShowTimes((prev) =>
      prev.map((s) =>
        s.id === selectedShow.id
          ? { ...s, date: editableDate, time: editableTime as number }
          : s
      )
    );

    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedShow) return;

    await fetch(
      `${API_URL}/api/staff/showtimes/${selectedShow.id}`,
      {
        method: "DELETE",
      }
    );

    setShowTimes((prev) =>
      prev.filter((s) => s.id !== selectedShow.id)
    );

    setModalOpen(false);
  };


  const changeWeek = (offset: number) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + offset * 7);
    setCurrentWeekStart(newStart);
  };

  const isToday = (date: Date) => {
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  };

  const Header = () => (
    <tr>
      <th className="timeTable">Time</th>
      {weekDates.map((d, i) => (
        <th
          key={i}
          className="timeTable"
          style={{
            backgroundColor: isToday(d) ? "#eeecc9ff" : "transparent",
          }}
        >
          {d.toLocaleDateString("en-GB", {
            weekday: "short",
            month: "numeric",
            day: "numeric",
          })}
        </th>
      ))}
    </tr>
  );

  const TimeBody = () =>
    hours.map((hour) => {
      const tds = [];

      tds.push(
        <td key="time" className="timeTable">
          {hour}:00
        </td>
      );

      weekDates.forEach((date, j) => {
        let showHere = "";
        let showData: {
          id: number;
          movie: string;
          date: string;
          time: number;
        } | null = null;

        for (const show of showTimes) {
          const showDate = new Date(show.date);

          if (
            showDate.getFullYear() === date.getFullYear() &&
            showDate.getMonth() === date.getMonth() &&
            showDate.getDate() === date.getDate() &&
            show.time === hour
          ) {
            showHere = show.movie;
            showData = show;
            break;
          }
        }

        tds.push(
          <td
            key={j}
            className={`timeTable ${
              selectedShow &&
              selectedShow.id === showData?.id
                ? "selectedCell"
                : ""
            }`}
            onClick={() => {
              if (showData) {
                setSelectedShow(showData);
                setEditableDate(showData.date);
                setEditableTime(showData.time);
                setModalOpen(true);
              }
            }}
          >
            {showHere}
          </td>
        );
      });

      return <tr key={hour}>{tds}</tr>;
    });

  return (
    <div className="scheduleContainer">
      <div className="staffGoBackHeader">
        <button
          className="goBackButton"
          onClick={() => (window.location.href = `/StaffHomePage/${auditorium}`)}
        >
          ← Go back
        </button>
      </div>
      <div className="weekControls">
        <button className="weekButton" onClick={() => changeWeek(-1)}>
          《
        </button>
        <span className="yearLabel">{currentWeekStart.getFullYear()}</span>
        <button className="weekButton" onClick={() => changeWeek(1)}>
          》
        </button>
      </div>

      <div className="tableWrapper">
        <table className="scheduleTable">
          <thead>{Header()}</thead>
          <tbody>{TimeBody()}</tbody>
        </table>
      </div>

      {modalOpen && selectedShow && (
        <div className="modal">
          <div
            className="modalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{selectedShow.movie}</h3>

            <label>
              Date:
              <input
                type="date"
                value={editableDate}
                onChange={(e) => setEditableDate(e.target.value)}
              />
            </label>

            <label>
              Time:
              <input
                type="time"
                value={
                  editableTime !== ""
                    ? `${editableTime.toString().padStart(2, "0")}:00`
                    : ""
                }
                onChange={(e) => {
                  const hour = e.target.value.split(":")[0];
                  setEditableTime(Number(hour));
                }}
              />
            </label>

            <button onClick={handleSave}>Save</button>
            <button onClick={handleDelete}>Delete</button>


            <button onClick={() => setModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

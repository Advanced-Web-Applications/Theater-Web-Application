import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StaffNavBar from "../../components/staff/staffNavBar";
import { useTheater } from "../../components/staff/theaterData";
import type { ShowTime } from "../../components/staff/showtimeUtils";
import "../../style/staff/staffSeeTable.css";

import { 
  fetchShowTimes, 
  saveShowTime, 
  deleteShowTime, 
  getWeekDates,
} from "../../components/staff/showtimeUtils";
import { Header, TimeBody } from "../../components/staff/showtimeUtils";

export default function StaffSeeTable() {
  const { id, auditorium } = useParams();
  const { theater: currentTheater } = useTheater(Number(id));

  const [showTimes, setShowTimes] = useState<ShowTime[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState<ShowTime | null>(null);

  const [editableDate, setEditableDate] = useState("");
  const [editableTime, setEditableTime] = useState<number | "">("");
  const [editableMinute, setEditableMinute] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = new Date();
    const day = now.getDay() || 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day - 1));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const weekDates = getWeekDates(currentWeekStart);

  useEffect(() => {
    fetchShowTimes(auditorium).then(setShowTimes);
  }, [auditorium]);

  const handleSave = async () => {
    if (!selectedShow) return;

    setErrorMessage("");
    setIsLoading(true);

    if (editableTime === "" || editableTime < 0) {
      setErrorMessage("Please select a valid time");
      setIsLoading(false);
      return;
    }

    const updatedShow: ShowTime = {
      ...selectedShow,
      date: editableDate,
      time: editableTime as number,
      minute: editableMinute,
    };

    const result = await saveShowTime(updatedShow);
    
    setIsLoading(false);
    
    if (result.success) {
      setShowTimes((prev) =>
        prev.map((s) => (s.id === updatedShow.id ? updatedShow : s))
      );
      setModalOpen(false);
      setErrorMessage("");
    } else {
      setErrorMessage(result.message || "Failed to save showtime");
    }
  };

  const handleDelete = async () => {
    if (!selectedShow) return;

    setErrorMessage("");
    setIsLoading(true);

    const result = await deleteShowTime(selectedShow.id);
    
    setIsLoading(false);
    
    if (result.success) {
      setShowTimes((prev) => prev.filter((s) => s.id !== selectedShow.id));
      setModalOpen(false);
      setErrorMessage("");
    } else {
      setErrorMessage(result.message || "Failed to delete showtime");
    }
  };

  const changeWeek = (offset: number) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + offset * 7);
    setCurrentWeekStart(newStart);
  };

  const handleSelectShow = (show: ShowTime) => {
    setSelectedShow(show);
    setEditableDate(show.date);
    setEditableTime(show.time);
    setEditableMinute(show.minute);
    setErrorMessage("");
    setModalOpen(true);
  };

  return (
    <div>
      <StaffNavBar theater={currentTheater} title="See Table" />

      <div className="scheduleContainer">
        <div className="staffGoBackHeader">
          <button
            className="goBackButton"
            onClick={() => (window.location.href = `/StaffHomePage/${id}`)}
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
            <thead>
              <Header weekDates={weekDates} />
            </thead>
            <tbody>
              <TimeBody
                showTimes={showTimes}
                weekDates={weekDates}
                onSelectShow={handleSelectShow}
              />
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && selectedShow && (
        <div className="modal" onClick={() => setModalOpen(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedShow.movie}</h3>

            {errorMessage && (
              <div className="errorMessage" style={{
                backgroundColor: "#fee",
                color: "#c33",
                padding: "10px",
                borderRadius: "4px",
                marginBottom: "15px",
                border: "1px solid #fcc"
              }}>
                {errorMessage}
              </div>
            )}

            <label>
              Date:
              <input
                type="date"
                value={editableDate}
                onChange={(e) => setEditableDate(e.target.value)}
                disabled={isLoading}
              />
            </label>

            <label>
              Time:
              <div className="timeSelector">
                <select
                  className="timeSelect"
                  value={editableTime}
                  onChange={(e) => setEditableTime(Number(e.target.value))}
                  disabled={isLoading}
                >
                  <option value="">Hour</option>
                  {Array.from({ length: 12 }, (_, i) => i + 12).map((h) => (
                    <option key={h} value={h}>
                      {h.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>

                <span className="timeSeparator">:</span>

                <select
                  className="timeSelect"
                  value={editableMinute}
                  onChange={(e) => setEditableMinute(Number(e.target.value))}
                  disabled={isLoading}
                >
                  <option value="">Minute</option>
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <button 
              className="modalSaveButton" 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button 
              className="modalDeleteButton" 
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
            <button 
              className="modalCloseButton" 
              onClick={() => setModalOpen(false)}
              disabled={isLoading}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
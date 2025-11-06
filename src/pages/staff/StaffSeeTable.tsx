import { useEffect } from "react";

export default function StaffSeeTable() {
  const [showTimes, setShowTimes] = useEffect<{movie: string; date: string; time: string}[]>([]);
  const days = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const hours = [];
  for (let i = 0;i <= 23; i++) {
    hours.push(i);
  }

  useEffect(() => {
    const storedShowtimes = JSON.parse(localStorage.getItem("showtimes") || "[]");
    console.log("Stored Showtimes:", storedShowtimes);
  }, []);

  const Header = () => {
    const weeks = [];
    weeks.push(<th key="time" className="timeTable">Time</th>);
    for (let i = 1; i < days.length; i++) {
      weeks.push(
        <th key={i} className="timeTable">
          {days[i]}
        </th>
      );
    }
    return <tr>{weeks}</tr>;
  };

  const TimeBody = () => {
    const timeRows = [];
    for (let i = 0; i < hours.length; i++) {
      const hour = hours[i];
      const tds = [];
      tds.push(
        <td key="time" className="timeTable">
          {hour}:00
        </td>
      );
      for (let j = 1; j < days.length; j++) {
        tds.push(<td key={j} className="timeTable"></td>);
      }
      timeRows.push(<tr key={i}>{tds}</tr>);
    }
    return timeRows;
  };

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>{Header()}</thead>
      <tbody>{TimeBody()}</tbody>
    </table>
  );
}

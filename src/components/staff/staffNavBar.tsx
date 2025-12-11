import "../../style/staff/staffNavBar.css";
import type { Theater } from "../../components/staff/theaterData";
import { useNavigate } from "react-router-dom";

type StaffNavBarProps = {
  theater: Theater | null;
  title: string;
};

export default function StaffNavBar({ theater, title }: StaffNavBarProps) {
  if (!theater) return null;

  const navigate = useNavigate();

  return (
    <div className="staffNavBar">
      <img className="staffNavLogo" src="/logo.jpg" alt="Logo"/> 
      <div className="staffNavTextBlock">
        <h1 className="staffNavTheaterName">{theater.name}</h1>
        <p className="staffNavPageTitle">{title}</p>
      </div>

      <button className="staffNavLogout" onClick={() => navigate("/login")}>
        Log out
      </button>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../style/owner/ownerNav.css';

export default function OwnerNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/OwnerDashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/MovieManagement', label: 'Manage Movies', icon: 'bi-collection-play' },
    { path: '/AddTheater', label: 'Add Theater', icon: 'bi-building' },
    { path: '/AddAuditorium', label: 'Add Auditorium', icon: 'bi-camera-reels' },
    { path: '/AddMovie', label: 'Add Movie', icon: 'bi-film' },
    { path: '/AddStaff', label: 'Add Staff', icon: 'bi-person-plus' },
    { path: '/StaffList', label: 'Staff List', icon: 'bi-people' },
    { path: '/PriceSetting', label: 'Ticket Prices', icon: 'bi-currency-euro' }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Header with Navigation */}
      <div className="owner-nav-header">
        <div className="owner-nav-logo" onClick={() => handleNavigate('/OwnerDashboard')}>
          <img src="/north-star-logo.jpg" alt="North Star" />
        </div>

        {/* Desktop Navigation */}
        <nav className="owner-desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`owner-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNavigate(item.path)}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="owner-nav-actions">
          <button className="owner-icon-btn">
            <i className="bi bi-person-circle"></i>
          </button>
          <button
            className="owner-icon-btn owner-mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className={`bi ${isMobileMenuOpen ? 'bi-x' : 'bi-list'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="owner-mobile-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`owner-mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNavigate(item.path)}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

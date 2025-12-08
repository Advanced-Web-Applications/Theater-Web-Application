import { useState, useEffect } from 'react';
import '../../style/owner/staffList.css';

interface Staff {
  id: number;
  username: string;
  email: string;
  phone: string;
  theater_name: string;
  theater_id: number;
}

interface Theater {
  id: number;
  name: string;
}

export default function StaffList() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheater, setSelectedTheater] = useState<number | ''>('');
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

        // Fetch theaters
        const theatersResponse = await fetch(`${apiUrl}/api/owner/theaters`);
        const theatersData = await theatersResponse.json();

        // Fetch staff
        const staffResponse = await fetch(`${apiUrl}/api/owner/staff`);
        const staffData = await staffResponse.json();

        if (theatersData.success && staffData.success) {
          setTheaters(theatersData.data);
          setStaffList(staffData.data);
          setFilteredStaff(staffData.data);
        } else {
          console.error('Failed to fetch data from API');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter staff based on search term and selected theater
  useEffect(() => {
    let filtered = staffList;

    // Filter by search term (search in name, email, phone)
    if (searchTerm) {
      filtered = filtered.filter(staff =>
        staff.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.phone.includes(searchTerm)
      );
    }

    // Filter by selected theater
    if (selectedTheater !== '') {
      filtered = filtered.filter(staff => staff.theater_id === selectedTheater);
    }

    setFilteredStaff(filtered);
  }, [searchTerm, selectedTheater, staffList]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTheaterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTheater(e.target.value === '' ? '' : parseInt(e.target.value));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedTheater('');
  };

  if (loading) {
    return (
      <div className="staff-list-page">
        <div className="page-header">
          <div className="header-logo">
            <i className="bi bi-star-fill"></i>
            <span>NORTH STAR</span>
          </div>
        </div>
        <div className="loading">Loading staff list...</div>
      </div>
    );
  }

  return (
    <div className="staff-list-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-logo">
          <i className="bi bi-star-fill"></i>
          <span>NORTH STAR</span>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i>
          </button>
          <button className="icon-btn">
            <i className="bi bi-person-circle"></i>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-content">
        <div className="content-header">
          <div className="title-section">
            <h1>Staff Management</h1>
            <p>View and manage all staff members across theaters</p>
          </div>
          <button className="btn-add" onClick={() => window.location.href = '/AddStaff'}>
            <i className="bi bi-person-plus"></i>
            Add New Staff
          </button>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="filter-group">
            <select
              value={selectedTheater}
              onChange={handleTheaterChange}
              className="theater-filter"
            >
              <option value="">All Theaters</option>
              {theaters.map((theater) => (
                <option key={theater.id} value={theater.id}>
                  {theater.name}
                </option>
              ))}
            </select>

            {(searchTerm || selectedTheater !== '') && (
              <button className="btn-clear" onClick={handleClearFilters}>
                <i className="bi bi-x-circle"></i>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <span className="result-count">
            <i className="bi bi-people"></i>
            {filteredStaff.length} staff member{filteredStaff.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Staff Grid */}
        {filteredStaff.length > 0 ? (
          <div className="staff-grid">
            {filteredStaff.map((staff) => (
              <div key={staff.id} className="staff-card">
                <div className="staff-avatar">
                  <i className="bi bi-person-circle"></i>
                </div>
                <div className="staff-info">
                  <h3 className="staff-name">{staff.username}</h3>
                  <div className="staff-details">
                    <div className="detail-item">
                      <i className="bi bi-envelope"></i>
                      <span>{staff.email}</span>
                    </div>
                    <div className="detail-item">
                      <i className="bi bi-telephone"></i>
                      <span>{staff.phone}</span>
                    </div>
                    <div className="detail-item">
                      <i className="bi bi-building"></i>
                      <span>{staff.theater_name}</span>
                    </div>
                  </div>
                </div>
                <div className="staff-actions">
                  <button className="btn-action edit" title="Edit staff">
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn-action delete" title="Delete staff">
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <i className="bi bi-inbox"></i>
            <h3>No staff found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

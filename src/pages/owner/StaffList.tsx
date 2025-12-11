import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OwnerNav from '../../components/navbars/OwnerNav';
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
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheater, setSelectedTheater] = useState<number | ''>('');
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

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

  const handleDeleteClick = (staff: Staff) => {
    setStaffToDelete(staff);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setStaffToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!staffToDelete) return;

    setIsDeleting(true);

    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/owner/staff/${staffToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Remove staff from list
        setStaffList(prev => prev.filter(s => s.id !== staffToDelete.id));
        handleCloseDeleteModal();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      alert('Error deleting staff. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="staff-list-page">
        <OwnerNav />
        <div className="loading">Loading staff list...</div>
      </div>
    );
  }

  return (
    <div className="staff-list-page">
      <OwnerNav />

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
                  <button
                    className="btn-action edit"
                    title="Edit staff"
                    onClick={() => navigate(`/EditStaff/${staff.id}`)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn-action delete"
                    title="Delete staff"
                    onClick={() => handleDeleteClick(staff)}
                  >
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && staffToDelete && (
        <div className="modal-overlay" onClick={handleCloseDeleteModal}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon delete-icon">
                <i className="bi bi-exclamation-triangle-fill"></i>
              </div>
              <h2>Delete Staff Member?</h2>
              <p>Are you sure you want to delete this staff member? This action cannot be undone.</p>
            </div>

            <div className="modal-body">
              <div className="staff-info-card">
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{staffToDelete.username}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{staffToDelete.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Theater:</span>
                  <span className="info-value">{staffToDelete.theater_name}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
              >
                <i className="bi bi-x-lg"></i>
                Cancel
              </button>
              <button
                type="button"
                className="btn-delete-confirm"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <i className="bi bi-hourglass-split"></i>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash"></i>
                    Delete Staff
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OwnerNav from '../../components/navbars/OwnerNav';
import '../../style/owner/editStaff.css';

interface StaffFormData {
  username: string;
  email: string;
  phone: string;
  theater_id: number | '';
}

interface Theater {
  id: number;
  name: string;
  city: string;
}

export default function EditStaff() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<StaffFormData>({
    username: '',
    email: '',
    phone: '',
    theater_id: ''
  });

  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch staff data and theaters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

        // Fetch theaters
        const theatersResponse = await fetch(`${apiUrl}/api/owner/theaters`);
        const theatersData = await theatersResponse.json();

        // Fetch all staff to find the one we're editing
        const staffResponse = await fetch(`${apiUrl}/api/owner/staff`);
        const staffData = await staffResponse.json();

        if (theatersData.success && staffData.success) {
          setTheaters(theatersData.data);

          // Find the staff member by ID
          const staff = staffData.data.find((s: any) => s.id === parseInt(id || '0'));

          if (staff) {
            setFormData({
              username: staff.username,
              email: staff.email,
              phone: staff.phone,
              theater_id: staff.theater_id
            });
          } else {
            alert('Staff not found');
            navigate('/StaffList');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error loading staff data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/owner/staff/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Staff information updated successfully!');
        navigate('/StaffList');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating staff:', error);
      alert('Error updating staff information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/StaffList');
  };

  if (loading) {
    return (
      <div className="edit-staff-page">
        <OwnerNav />
        <div className="loading">Loading staff information...</div>
      </div>
    );
  }

  return (
    <div className="edit-staff-page">
      <OwnerNav />

      {/* Main Content */}
      <div className="page-content">
        <div className="form-container">
          <div className="form-header">
            <h1>Edit Staff Information</h1>
            <p>Update staff member details below</p>
          </div>

          <form onSubmit={handleSubmit} className="staff-form">
            {/* Staff Information */}
            <div className="form-section">
              <h2 className="section-title">
                <i className="bi bi-person-badge"></i>
                Staff Information
              </h2>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter staff email address"
                    maxLength={255}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="username">Full Name *</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter staff full name"
                    maxLength={100}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    maxLength={20}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="theater_id">Assigned Theater *</label>
                  <select
                    id="theater_id"
                    name="theater_id"
                    value={formData.theater_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select theater to assign</option>
                    {theaters.map((theater) => (
                      <option key={theater.id} value={theater.id}>
                        {theater.name} - {theater.city}
                      </option>
                    ))}
                  </select>
                  <span className="field-hint">Staff will manage this theater</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <i className="bi bi-x-lg"></i>
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="bi bi-hourglass-split"></i>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle"></i>
                    Update Staff
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

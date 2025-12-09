import { useState, useEffect } from 'react';
import OwnerNav from '../../components/navbars/OwnerNav';
import '../../style/owner/addStaff.css';

interface StaffFormData {
  email: string;
  username: string;
  phone: string;
  theater_id: number | '';
}

interface Theater {
  id: number;
  name: string;
  city: string;
}

export default function AddStaff() {
  const [formData, setFormData] = useState<StaffFormData>({
    email: '',
    username: '',
    phone: '',
    theater_id: ''
  });

  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  // Fetch theaters from API
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/owner/theaters`);
        const data = await response.json();

        if (data.success) {
          setTheaters(data.data);
        } else {
          console.error('Failed to fetch theaters');
        }
      } catch (error) {
        console.error('Error fetching theaters:', error);
      }
    };

    fetchTheaters();
  }, []);

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
      const response = await fetch(`${apiUrl}/api/owner/staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setCredentials({
          email: formData.email,
          password: data.data.temporaryPassword
        });
        setShowModal(true);
        handleReset();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error creating staff:', error);
      alert('Error creating staff account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      email: '',
      username: '',
      phone: '',
      theater_id: ''
    });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(credentials.email);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(credentials.password);
  };

  const handleCopyBoth = () => {
    const text = `Email: ${credentials.email}\nPassword: ${credentials.password}`;
    navigator.clipboard.writeText(text);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCredentials({ email: '', password: '' });
  };

  return (
    <div className="add-staff-page">
      <OwnerNav />

      {/* Main Content */}
      <div className="page-content">
        <div className="form-container">
          <div className="form-header">
            <h1>Add New Staff</h1>
            <p>Fill in the staff information below. System will automatically create account.</p>
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
                    placeholder="Enter staff email address (max 255 characters)"
                    maxLength={255}
                    required
                  />
                  <span className="field-hint">Credentials will be sent to this email</span>
                </div>

                <div className="form-group">
                  <label htmlFor="username">Full Name *</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter staff full name (max 100 characters)"
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
                    placeholder="Enter phone number (max 20 characters)"
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
                onClick={handleReset}
                disabled={isSubmitting}
              >
                <i className="bi bi-arrow-counterclockwise"></i>
                Reset
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="bi bi-hourglass-split"></i>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus"></i>
                    Add Staff & Create Account
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">
                <i className="bi bi-check-circle-fill"></i>
              </div>
              <h2>Staff Account Created Successfully!</h2>
              <p>Login credentials have been generated. Please share these with the staff member.</p>
            </div>

            <div className="modal-body">
              <div className="credential-group">
                <label>Email Address</label>
                <div className="credential-row">
                  <input
                    type="text"
                    value={credentials.email}
                    readOnly
                    className="credential-input"
                  />
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={handleCopyEmail}
                    title="Copy email"
                  >
                    <i className="bi bi-clipboard"></i>
                  </button>
                </div>
              </div>

              <div className="credential-group">
                <label>Temporary Password</label>
                <div className="credential-row">
                  <input
                    type="text"
                    value={credentials.password}
                    readOnly
                    className="credential-input"
                  />
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={handleCopyPassword}
                    title="Copy password"
                  >
                    <i className="bi bi-clipboard"></i>
                  </button>
                </div>
              </div>

              <div className="modal-warning">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>Please save these credentials securely. The password will not be shown again.</span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-copy-all"
                onClick={handleCopyBoth}
              >
                <i className="bi bi-files"></i>
                Copy Both
              </button>
              <button
                type="button"
                className="btn-close-modal"
                onClick={handleCloseModal}
              >
                <i className="bi bi-check-lg"></i>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

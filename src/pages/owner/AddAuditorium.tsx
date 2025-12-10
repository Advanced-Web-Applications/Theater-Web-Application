import { useState, useEffect } from 'react';
import OwnerNav from '../../components/navbars/OwnerNav';
import '../../style/owner/addAuditorium.css';

interface AuditoriumFormData {
  theater_id: number | '';
  name: string;
  total_seats: number | '';
  seats_per_row: number | '';
}

interface Theater {
  id: number;
  name: string;
  city: string;
}

interface ExistingAuditorium {
  id: number;
  name: string;
  total_seats: number;
  seats_per_row: number;
}

export default function AddAuditorium() {
  const [formData, setFormData] = useState<AuditoriumFormData>({
    theater_id: '',
    name: '',
    total_seats: '',
    seats_per_row: ''
  });

  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [existingAuditoriums, setExistingAuditoriums] = useState<ExistingAuditorium[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Fetch existing auditoriums when theater is selected
    if (name === 'theater_id') {
      if (value) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          const response = await fetch(`${apiUrl}/api/owner/auditoriums/${value}`);
          const data = await response.json();

          console.log('Fetched auditoriums:', data);

          if (data.success) {
            setExistingAuditoriums(data.data);
          } else {
            setExistingAuditoriums([]);
          }
        } catch (error) {
          console.error('Error fetching auditoriums:', error);
          setExistingAuditoriums([]);
        }
      } else {
        setExistingAuditoriums([]);
      }
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : parseInt(value) || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/owner/auditoriums`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Auditorium added successfully!');
        handleReset();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding auditorium:', error);
      alert('Error adding auditorium. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      theater_id: '',
      name: '',
      total_seats: '',
      seats_per_row: ''
    });
  };

  return (
    <div className="add-auditorium-page">
      <OwnerNav />

      {/* Main Content */}
      <div className="page-content">
        <div className="form-container">
          <div className="form-header">
            <h1>Add New Auditorium</h1>
            <p>Fill in the information below to add a new auditorium to a theater</p>
          </div>

          <form onSubmit={handleSubmit} className="auditorium-form">
            {/* Auditorium Information */}
            <div className="form-section">
              <h2 className="section-title">
                <i className="bi bi-camera-reels"></i>
                Auditorium Information
              </h2>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="theater_id">Theater *</label>
                  <select
                    id="theater_id"
                    name="theater_id"
                    value={formData.theater_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a theater</option>
                    {theaters.map((theater) => (
                      <option key={theater.id} value={theater.id}>
                        {theater.name} - {theater.city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Existing Auditoriums - Inline Display */}
                {formData.theater_id && existingAuditoriums.length > 0 && (
                  <div className="form-group full-width">
                    <div className="existing-auditoriums-inline">
                      <h3>
                        <i className="bi bi-camera-reels"></i>
                        Existing Auditoriums in this Theater
                      </h3>
                      <div className="auditoriums-inline-grid">
                        {existingAuditoriums.map((auditorium) => (
                          <div key={auditorium.id} className="auditorium-inline-card">
                            <div className="auditorium-inline-name">{auditorium.name}</div>
                            <div className="auditorium-inline-seats">
                              <i className="bi bi-people"></i>
                              {auditorium.total_seats} seats
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-group full-width">
                  <label htmlFor="name">Auditorium Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter auditorium name (e.g., Theater 1, Hall A) - max 50 characters"
                    maxLength={50}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="total_seats">Total Seats *</label>
                  <input
                    type="number"
                    id="total_seats"
                    name="total_seats"
                    value={formData.total_seats}
                    onChange={handleNumberChange}
                    placeholder="Enter total number of seats"
                    min="1"
                    required
                  />
                  <span className="field-hint">Total capacity of the auditorium</span>
                </div>

                <div className="form-group">
                  <label htmlFor="seats_per_row">Seats Per Row *</label>
                  <input
                    type="number"
                    id="seats_per_row"
                    name="seats_per_row"
                    value={formData.seats_per_row}
                    onChange={handleNumberChange}
                    placeholder="Enter seats per row"
                    min="1"
                    required
                  />
                  <span className="field-hint">Number of seats in each row</span>
                </div>
              </div>

              {/* Calculation Info */}
              {formData.total_seats && formData.seats_per_row && (
                <div className="calculation-info">
                  <i className="bi bi-info-circle"></i>
                  <span>
                    This auditorium will have approximately{' '}
                    <strong>{Math.ceil(Number(formData.total_seats) / Number(formData.seats_per_row))}</strong> rows
                  </span>
                </div>
              )}
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
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle"></i>
                    Add Auditorium
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

import { useState, useEffect } from 'react';
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

export default function AddAuditorium() {
  const [formData, setFormData] = useState<AuditoriumFormData>({
    theater_id: '',
    name: '',
    total_seats: '',
    seats_per_row: ''
  });

  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock theaters data - will be replaced with real API call later
  useEffect(() => {
    // TODO: Fetch theaters from API when database is available
    const mockTheaters: Theater[] = [
      { id: 1, name: 'North Star Cinema Helsinki', city: 'Helsinki' },
      { id: 2, name: 'North Star Cinema Espoo', city: 'Espoo' },
      { id: 3, name: 'North Star Cinema Tampere', city: 'Tampere' },
      { id: 4, name: 'North Star Cinema Turku', city: 'Turku' }
    ];
    setTheaters(mockTheaters);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

    // TODO: API call will be implemented later when database is available
    console.log('Form submitted:', formData);

    // Simulate API call
    setTimeout(() => {
      alert('Auditorium data prepared (API integration pending)');
      setIsSubmitting(false);
    }, 1000);
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

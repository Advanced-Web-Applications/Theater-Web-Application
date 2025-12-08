import { useState } from 'react';
import '../../style/owner/addTheater.css';

interface TheaterFormData {
  name: string;
  city: string;
  address: string;
  phone: string;
}

export default function AddTheater() {
  const [formData, setFormData] = useState<TheaterFormData>({
    name: '',
    city: '',
    address: '',
    phone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const response = await fetch(`${apiUrl}/api/owner/theaters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Theater added successfully!');
        handleReset();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding theater:', error);
      alert('Error adding theater. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      city: '',
      address: '',
      phone: ''
    });
  };

  return (
    <div className="add-theater-page">
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
            <h1>Add New Theater</h1>
            <p>Fill in the information below to add a new theater to the system</p>
          </div>

          <form onSubmit={handleSubmit} className="theater-form">
            {/* Theater Information */}
            <div className="form-section">
              <h2 className="section-title">
                <i className="bi bi-building"></i>
                Theater Information
              </h2>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="name">Theater Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter theater name (max 100 characters)"
                    maxLength={100}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city (max 50 characters)"
                    maxLength={50}
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
                  <label htmlFor="address">Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter full address"
                    rows={3}
                    required
                  />
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
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle"></i>
                    Add Theater
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

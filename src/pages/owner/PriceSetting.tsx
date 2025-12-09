import { useState, useEffect } from 'react';
import OwnerNav from '../../components/navbars/OwnerNav';
import '../../style/owner/priceSetting.css';

interface PriceData {
  adult_price: number;
  child_price: number;
}

export default function PriceSetting() {
  const [prices, setPrices] = useState<PriceData>({ adult_price: 0, child_price: 0 });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentPrices();
  }, []);

  const fetchCurrentPrices = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/owner/prices`);

      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }

      const result = await response.json();

      if (result.success) {
        setPrices(result.data);
        setError(null);
      } else {
        throw new Error(result.message || 'Failed to load prices');
      }
    } catch (err) {
      console.error('Error fetching prices:', err);
      setError(err instanceof Error ? err.message : 'Failed to load prices');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPrices(prev => ({
      ...prev,
      [name]: value === '' ? 0 : Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (prices.adult_price <= 0 || prices.child_price <= 0) {
      alert('Prices must be greater than 0');
      return;
    }

    if (prices.child_price >= prices.adult_price) {
      alert('Child ticket price must be less than adult ticket price');
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/owner/prices`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prices),
      });

      const data = await response.json();

      if (data.success) {
        alert('Prices updated successfully!');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating prices:', error);
      alert(`Failed to update prices. Error: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="price-setting-page">
        <OwnerNav />
        <div className="page-content">
          <div className="loading">Loading prices...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="price-setting-page">
        <OwnerNav />
        <div className="page-content">
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="price-setting-page">
      <OwnerNav />

      <div className="page-content">
        <div className="form-container">
          <div className="form-header">
            <h1>Ticket Price Settings</h1>
            <p>Manage ticket prices for adult and child tickets</p>
          </div>

          <form onSubmit={handleSubmit} className="price-form">
            <div className="price-cards">
              {/* Adult Price Card */}
              <div className="price-card">
                <div className="price-card-icon">
                  <i className="bi bi-person-fill"></i>
                </div>
                <h3>Adult Ticket</h3>
                <div className="price-input-group">
                  <span className="currency">€</span>
                  <input
                    type="number"
                    name="adult_price"
                    value={prices.adult_price}
                    onChange={handleInputChange}
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
                <p className="price-label">Price per ticket</p>
              </div>

              {/* Child Price Card */}
              <div className="price-card">
                <div className="price-card-icon child">
                  <i className="bi bi-person"></i>
                </div>
                <h3>Child Ticket</h3>
                <div className="price-input-group">
                  <span className="currency">€</span>
                  <input
                    type="number"
                    name="child_price"
                    value={prices.child_price}
                    onChange={handleInputChange}
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
                <p className="price-label">Price per ticket</p>
              </div>
            </div>

            {/* Info Banner */}
            <div className="info-banner">
              <i className="bi bi-info-circle"></i>
              <span>Price changes will affect all future bookings immediately. Child ticket price must be less than adult ticket price.</span>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={fetchCurrentPrices}
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
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle"></i>
                    Update Prices
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

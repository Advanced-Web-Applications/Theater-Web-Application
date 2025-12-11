import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/customer/change-password.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ChangePassword() {

    const navigate = useNavigate()
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!oldPassword || !newPassword) {
      alert('Both old and new passwords are required');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token'); 

      const res = await fetch(`${BACKEND_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Failed to change password');
        return;
      }

      alert('Password changed successfully');
      setOldPassword('');
      setNewPassword('');

      navigate('/home')
    } catch (err) {
      console.error(err);
      alert('Error changing password');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="change-password-container">
      <div className="change-password-box">
        <h2 className="change-password-title">Change Password</h2>
        <form className="change-password-form" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input-field"
          />
          <button type="submit" className="update-button" disabled={submitting}>
            {submitting ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

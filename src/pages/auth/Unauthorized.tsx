import { useNavigate } from 'react-router-dom';
import '../../style/customer/login.css';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title" style={{ color: '#ff4444' }}>Access Denied</h1>

        <div style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#fff'
        }}>
          <i className="bi bi-shield-x" style={{ fontSize: '4rem', color: '#ff4444' }}></i>
          <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>
            You don't have permission to access this page.
          </p>
          <p style={{ marginTop: '0.5rem', color: '#aaa' }}>
            This page is only accessible to authorized users.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            className="login-button"
            onClick={() => navigate('/login')}
            style={{ width: 'auto', padding: '0.75rem 2rem' }}
          >
            Go to Login
          </button>
          <button
            className="login-button"
            onClick={() => navigate('/')}
            style={{
              width: 'auto',
              padding: '0.75rem 2rem',
              background: '#555'
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

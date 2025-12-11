import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import '../../style/customer/login.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: any) {
    e.preventDefault()

    if (!email || !password) {
      alert('Please enter both email and password.');
      setSubmitting(false);
      return;
    }

    if (submitting) return;
    setSubmitting(true)

    const user = { email, password }

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(user)
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Login failed')
        return;
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('selectedCity', data.city)

      if (data.role === 'owner') {
        navigate('/OwnerDashBoard')
      } else if (data.role === 'staff') {
        navigate(`/StaffHomePage/${data.theater_id}`)
      } else {
        navigate('/home')
      }

      setEmail('')
      setPassword('')


    } catch (err) {
      console.error('Error login: ', err)
    } finally {
      setSubmitting(false)
    }
  }

return (
<div className="login-container">
<div className="login-box">
<h1 className="login-title">Log In</h1>


<form className="login-form" onSubmit={handleSubmit}>
  <input type="email" placeholder="Email" className="input-field" value={email} onChange={e => setEmail(e.target.value)}/>


  <input type="password" placeholder="Password" className="input-field" value={password} onChange={e => setPassword(e.target.value)}/>


  <button type="submit" className="login-button" disabled={submitting}>{submitting ? 'Wait a second...' : 'Log In'}</button>
</form>


<p className="register-text">
  Don't have an account?
  <span className="register-link" onClick={() => navigate('/register')}>Register</span>
</p>
</div>
</div>
);
}
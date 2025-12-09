import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import '../../style/customer/login.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function LoginPage() {
  const navigate = useNavigate()

  const [role, setRole] = useState('Staff')
  const [theaters, setTheaters] = useState([])
  const [placeOfWork, setPlaceOfWork] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/staff/theaters`, { headers: {'Content-Type': 'application/json'} })
        .then(res => res.json())
        .then(data => {
                setTheaters(data)
                setPlaceOfWork(data[0])})
        .catch(err => console.log('Error fetching theaters: ', err))
  }, [])

  async function handleSubmit(e: any) {
    e.preventDefault()

    if (submitting) return
    setSubmitting(true)

    const newUser = { email, username, password, role, placeOfWork }

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Register failed')
        return;
      }

      localStorage.setItem('token', data.token)

      navigate('/staffDashboard')

      setRole('')
      setPlaceOfWork('')
      setEmail('')
      setUsername('')
      setPassword('')

    } catch (err) {
      console.error('Error register: ', err)
    } finally {
      setSubmitting(false)
    }
  }

return (
  <div className="login-container">
  <div className="login-box">
  <h1 className="login-title">Register</h1>


  <form className="login-form">
    <label htmlFor='role'>Role:</label>
    <select value={role} onChange={e => setRole(e.target.value)}>
        <option value='Staff'></option>
    </select>

    <label htmlFor='placeOfWork'>Place of work:</label>
    <select value={placeOfWork} onChange={e => setPlaceOfWork(e.target.value)}>
        {theaters.map((theater, index) => (
            <option key={index} value={theater}>{theater}</option>
        ))}
    </select>

    <input type="email" placeholder="Email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />


    <input type="text" placeholder="Username" className="input-field" value={username} onChange={e => setUsername(e.target.value)} required />


    <input type="password" placeholder="Password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />


    <button type="submit" className="login-button" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Creating account...' : 'Register'}</button>
  </form>


  <p className="register-text">
    Already have an account?
    <span className="register-link" onClick={() => navigate('/login')}>Login</span>
  </p>
  </div>
  </div>
  )
}
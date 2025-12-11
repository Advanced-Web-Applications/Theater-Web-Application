import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import '../../style/customer/login.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

interface City {
  id: number
  city: string
}

export default function LoginPage() {
  const navigate = useNavigate()

  const [cities, setCities] = useState<City[]>([])
  const [city, setCity] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/customer/locations`, {
          headers: { 'Content-Type': 'application/json' }
        })
        const data: City[] = await res.json()
        setCities(data)
        if (data.length > 0) setCity(data[0].city) 
      } catch (err) {
        console.error('Error fetching cities: ', err)
      }
    }

    fetchCities()
  }, [])

  async function handleSubmit(e: any) {
    e.preventDefault()

    if (submitting) return
    setSubmitting(true)

    const newUser = { email, username, password, city }

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
      localStorage.setItem('selectedCity', city)

      if (data.role === 'customer') {
        navigate('/home', { state: { location: city } })
      } else if (data.role === 'staff') {
        navigate(`/StaffHomePage/${data.theater_id}`)
      }

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


  <form className="login-form" onSubmit={handleSubmit}>
    <label htmlFor='city'>City you prefer:</label>
    <select className='form-select' value={city} onChange={e => setCity(e.target.value)}>
        {cities.map(c => (
          <option key={c.id} value={c.city}>{c.city}</option>
        ))}
    </select>


    <input type="email" placeholder="Email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />


    <input type="text" placeholder="Username" className="input-field" value={username} onChange={e => setUsername(e.target.value)} required />


    <input type="password" placeholder="Password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />


    <button type="submit" className="login-button" disabled={submitting}>{submitting ? 'Creating account...' : 'Register'}</button>
  </form>


  <p className="register-text">
    Already have an account?
    <span className="register-link" onClick={() => navigate('/login')}>Login</span>
  </p>
  </div>
  </div>
  )
}
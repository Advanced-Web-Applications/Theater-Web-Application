import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SearchBar from '../../components/customer/SearchBar'

interface MoviePostersProps {
    id: number
    image: string
}

export default function HomePage() {

  const { state } = useLocation()
  const location = state?.location || 'Unknown'

  const navigate = useNavigate()


  return (
    <>
      <SearchBar/>
      <div className='poster-grid'>
          {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="poster-placeholder" onClick={() => navigate('/home/MovieDetails')}></div>
          ))}
      </div>

      <footer className="footer">
        <p><strong>Cinema Nova Oulu</strong></p>
        <p>Kauppurienkatu 45, 90100 Oulu, Finland</p>
        <p>Phone: +358 8 5542 3890</p>
      </footer>
    </>
  )
}

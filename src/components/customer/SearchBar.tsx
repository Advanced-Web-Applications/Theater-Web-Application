import { useState, useEffect } from "react";
import '../../style/customer/homepage.css'; 

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

interface SearchBarProps {
  city: string
  searchResult: (movies: any[]) => void
}

export default function SearchBar({city, searchResult}: SearchBarProps) {

  const [search, setSearch] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState(search)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(search), 500)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    if (!debouncedTerm) return
    searchResult([])

    const fetchMovies = async() => {
      if (!search) return
  
      try {
        const res = await fetch(`${BACKEND_URL}/api/customer/movies/search?query=${search}&city=${city}`, { headers: { 'Content-Type': 'application/json' }})
        const data = await res.json()
        searchResult(data)
      } catch (err) {
        console.error('Search error: ', err)
      }
    }
    fetchMovies()
  }, [debouncedTerm, city])


  return (
    <div className='search-bar'>
      <input
        type='text'
        placeholder='Movie name'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='search-input'
      />
      <button type='submit' className='search-button'>
        Search
      </button>
    </div>
  );
};


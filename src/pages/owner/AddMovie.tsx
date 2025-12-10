import { useState } from 'react';
import OwnerNav from '../../components/navbars/OwnerNav';
import '../../style/owner/addMovie.css';

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  genre_ids: number[];
  runtime?: number;
  vote_average: number;
  poster_path: string | null;
  release_date: string;
  adult: boolean;
}

interface MovieFormData {
  title: string;
  description: string;
  genre: string;
  duration: number | '';
  age_rating: '13+' | '16+' | '18+' | '';
  rating: number | '';
  poster_url: string;
  trailer_url: string;
  release_date: string;
}

const TMDB_API_KEY = '5ca43beccf8c7aa6662b3b1a8ecd1baa';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const GENRE_MAP: { [key: number]: string } = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

export default function AddMovie() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState<MovieFormData>({
    title: '',
    description: '',
    genre: '',
    duration: '',
    age_rating: '',
    rating: '',
    poster_url: '',
    trailer_url: '',
    release_date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchTMDB = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&language=en-US&page=1`
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error searching TMDB:', error);
      alert('Failed to search movies. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const fetchMovieDetails = async (tmdbId: number) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  };

  const fetchMovieTrailer = async (tmdbId: number) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const data = await response.json();

      // Find YouTube trailer
      const trailer = data.results?.find(
        (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
      );

      return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '';
    } catch (error) {
      console.error('Error fetching trailer:', error);
      return '';
    }
  };

  const selectMovie = async (movie: TMDBMovie) => {
    // Fetch full movie details to get runtime and trailer
    const [details, trailerUrl] = await Promise.all([
      fetchMovieDetails(movie.id),
      fetchMovieTrailer(movie.id)
    ]);

    const genres = movie.genre_ids.map(id => GENRE_MAP[id]).filter(Boolean).join(', ');
    const ageRating = movie.adult ? '18+' : '13+';

    setFormData({
      title: movie.title,
      description: movie.overview || '',
      genre: genres || '',
      duration: details?.runtime || '',
      age_rating: ageRating as '13+' | '16+' | '18+',
      rating: movie.vote_average ? Number(movie.vote_average.toFixed(1)) : '',
      poster_url: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : '',
      trailer_url: trailerUrl,
      release_date: movie.release_date || ''
    });

    // Clear search results
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'rating' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('Submitting movie data:', formData);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      console.log('API URL:', `${apiUrl}/api/owner/movies`);

      const response = await fetch(`${apiUrl}/api/owner/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        alert('Movie added successfully!');
        handleReset();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding movie:', error);
      alert(`Failed to add movie. Error: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      genre: '',
      duration: '',
      age_rating: '',
      rating: '',
      poster_url: '',
      trailer_url: '',
      release_date: ''
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="add-movie-page">
      <OwnerNav />

      <div className="page-content">
        <div className="form-container">
          <div className="form-header">
            <h1>Add New Movie</h1>
            <p>Search from TMDB or enter movie details manually</p>
          </div>

          {/* TMDB Search Section */}
          <div className="search-section">
            <h2 className="section-title">
              <i className="bi bi-search"></i>
              Search TMDB Database
            </h2>
            <div className="search-box-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search for a movie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchTMDB()}
              />
              <button
                className="btn-search"
                onClick={searchTMDB}
                disabled={isSearching || !searchQuery.trim()}
              >
                {isSearching ? (
                  <>
                    <i className="bi bi-hourglass-split"></i>
                    Searching...
                  </>
                ) : (
                  <>
                    <i className="bi bi-search"></i>
                    Search
                  </>
                )}
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="search-results">
                <h3>{searchResults.length} results found</h3>
                <div className="results-grid">
                  {searchResults.slice(0, 6).map((movie) => (
                    <div
                      key={movie.id}
                      className="result-card"
                      onClick={() => selectMovie(movie)}
                    >
                      {movie.poster_path ? (
                        <img
                          src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                          alt={movie.title}
                          className="result-poster"
                        />
                      ) : (
                        <div className="result-poster-placeholder">
                          <i className="bi bi-film"></i>
                        </div>
                      )}
                      <div className="result-info">
                        <h4>{movie.title}</h4>
                        <p className="result-year">{movie.release_date?.split('-')[0] || 'N/A'}</p>
                        <div className="result-rating">
                          <i className="bi bi-star-fill"></i>
                          {movie.vote_average.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Movie Form */}
          <form onSubmit={handleSubmit} className="movie-form">
            <div className="form-section">
              <h2 className="section-title">
                <i className="bi bi-film"></i>
                Movie Information
              </h2>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="title">Movie Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter movie title"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter movie description"
                    rows={4}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="genre">Genre *</label>
                  <input
                    type="text"
                    id="genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    placeholder="e.g., Action, Drama, Comedy"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="duration">Duration (minutes) *</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="120"
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="age_rating">Age Rating *</label>
                  <select
                    id="age_rating"
                    name="age_rating"
                    value={formData.age_rating}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select age rating</option>
                    <option value="13+">13+</option>
                    <option value="16+">16+</option>
                    <option value="18+">18+</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="rating">Rating (0-10) *</label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    placeholder="7.5"
                    min="0"
                    max="10"
                    step="0.1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="release_date">Release Date *</label>
                  <input
                    type="date"
                    id="release_date"
                    name="release_date"
                    value={formData.release_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="poster_url">Poster URL</label>
                  <input
                    type="url"
                    id="poster_url"
                    name="poster_url"
                    value={formData.poster_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/poster.jpg"
                  />
                  {formData.poster_url && (
                    <div className="poster-preview">
                      <img src={formData.poster_url} alt="Poster preview" />
                    </div>
                  )}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="trailer_url">Trailer URL (YouTube)</label>
                  <input
                    type="url"
                    id="trailer_url"
                    name="trailer_url"
                    value={formData.trailer_url}
                    onChange={handleInputChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
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
                    Adding Movie...
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-circle"></i>
                    Add Movie
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

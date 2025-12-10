import { useEffect, useState } from 'react';
import OwnerNav from '../../components/navbars/OwnerNav';
import '../../style/owner/movieManagement.css';

interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: number;
  age_rating: string;
  description: string;
  poster_url: string;
  status: 'upcoming' | 'now_showing' | 'ended' | 'archived';
  created_at: string;
}

interface MovieStats {
  status: string;
  count: number;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export default function MovieManagement() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [stats, setStats] = useState<MovieStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modal states
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Movie | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');

  const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchMovies();
    fetchGenres();
    fetchStats();
  }, [searchTerm, statusFilter, genreFilter]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (genreFilter !== 'all') params.append('genre', genreFilter);
      params.append('sortBy', 'title');
      params.append('order', 'ASC');

      const response = await fetch(`${apiUrl}/api/owner/movies?${params}`);
      const result = await response.json();

      if (result.success) {
        setMovies(result.data);
        setFilteredMovies(result.data);
        setError(null);
      } else {
        throw new Error(result.message || 'Failed to fetch movies');
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(err instanceof Error ? err.message : 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/owner/movies/genres`);
      const result = await response.json();
      if (result.success) {
        setGenres(result.data);
      }
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/owner/movies/stats`);
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    const newToast: Toast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const updateMovieStatus = async (movieId: number, newStatus: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/owner/movies/${movieId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();

      if (result.success) {
        showToast(result.message, 'success');
        fetchMovies();
        fetchStats();
      } else {
        showToast(result.message, 'error');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('Failed to update movie status', 'error');
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setEditForm(movie);
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setEditForm(null);
    setIsEditing(false);
  };

  const handleEditChange = (field: keyof Movie, value: string | number) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  const handleSaveEdit = async () => {
    if (!editForm) return;

    try {
      const response = await fetch(`${apiUrl}/api/owner/movies/${editForm.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editForm.title,
          genre: editForm.genre,
          duration: editForm.duration,
          age_rating: editForm.age_rating,
          description: editForm.description,
          poster_url: editForm.poster_url,
          status: editForm.status
        })
      });

      const result = await response.json();

      if (result.success) {
        showToast('Movie updated successfully', 'success');
        fetchMovies();
        fetchStats();
        setSelectedMovie(editForm);
        setIsEditing(false);
      } else {
        showToast(result.message || 'Failed to update movie', 'error');
      }
    } catch (err) {
      console.error('Error updating movie:', err);
      showToast('Failed to update movie', 'error');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'now_showing':
        return 'status-badge status-showing';
      case 'upcoming':
        return 'status-badge status-upcoming';
      case 'ended':
        return 'status-badge status-ended';
      case 'archived':
        return 'status-badge status-archived';
      default:
        return 'status-badge';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'now_showing':
        return 'Now Showing';
      case 'upcoming':
        return 'Upcoming';
      case 'ended':
        return 'Ended';
      case 'archived':
        return 'Archived';
      default:
        return status;
    }
  };

  if (loading && movies.length === 0) {
    return (
      <div className="owner-movie-management">
        <OwnerNav />
        <div className="management-content">
          <div className="loading">LOADING MOVIES...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="owner-movie-management">
      <OwnerNav />

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <i className={`bi ${toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}></i>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <div className="management-content">
        <div className="management-header">
          <h1>MOVIE MANAGEMENT</h1>
          <div className="stats-cards">
            {stats.map((stat) => (
              <div key={stat.status} className="stat-card">
                <div className="stat-header">{getStatusLabel(stat.status).toUpperCase()}</div>
                <div className="stat-main">
                  <div className="stat-number">{stat.count}</div>
                </div>
              </div>
            ))}
            <div className="stat-card stat-total">
              <div className="stat-header">TOTAL MOVIES</div>
              <div className="stat-main">
                <div className="stat-number">{movies.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by movie title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <i className="bi bi-search search-icon"></i>
          </div>

          <div className="filters-row">
            <div className="filter-group">
              <label>STATUS:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All</option>
                <option value="now_showing">Now Showing</option>
                <option value="upcoming">Upcoming</option>
                <option value="ended">Ended</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="filter-group">
              <label>GENRE:</label>
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="movies-grid">
          {filteredMovies.length === 0 ? (
            <div className="no-results">
              <i className="bi bi-film"></i>
              <p>NO MOVIES FOUND</p>
            </div>
          ) : (
            filteredMovies.map((movie) => (
              <div key={movie.id} className="movie-card" onClick={() => handleMovieClick(movie)}>
                <div className="movie-poster">
                  <img
                    src={movie.poster_url || '/placeholder-movie.jpg'}
                    alt={movie.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-movie.jpg';
                    }}
                  />
                  <span className={getStatusBadgeClass(movie.status)}>
                    {getStatusLabel(movie.status)}
                  </span>
                </div>

                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <div className="movie-meta">
                    <span>
                      <i className="bi bi-tag"></i> {movie.genre}
                    </span>
                    <span>
                      <i className="bi bi-clock"></i> {movie.duration} min
                    </span>
                    <span>
                      <i className="bi bi-person-badge"></i> {movie.age_rating}
                    </span>
                  </div>

                  <p className="movie-description">
                    {movie.description?.substring(0, 100)}
                    {movie.description?.length > 100 ? '...' : ''}
                  </p>

                  <div className="movie-quick-status">
                    <span className={getStatusBadgeClass(movie.status)}>
                      {getStatusLabel(movie.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Movie Detail Modal */}
        {selectedMovie && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={handleCloseModal}>
                <i className="bi bi-x-lg"></i>
              </button>

              <div className="modal-body">
                <div className="modal-poster">
                  <img
                    src={selectedMovie.poster_url || '/placeholder-movie.jpg'}
                    alt={selectedMovie.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-movie.jpg';
                    }}
                  />
                </div>

                <div className="modal-details">
                  {!isEditing ? (
                    <>
                      <div className="modal-header">
                        <h2>{selectedMovie.title}</h2>
                        <button className="btn-edit" onClick={() => setIsEditing(true)}>
                          <i className="bi bi-pencil-fill"></i> EDIT
                        </button>
                      </div>

                      <div className="detail-row">
                        <label>GENRE:</label>
                        <span>{selectedMovie.genre}</span>
                      </div>

                      <div className="detail-row">
                        <label>DURATION:</label>
                        <span>{selectedMovie.duration} minutes</span>
                      </div>

                      <div className="detail-row">
                        <label>AGE RATING:</label>
                        <span>{selectedMovie.age_rating}</span>
                      </div>

                      <div className="detail-row">
                        <label>STATUS:</label>
                        <select
                          value={selectedMovie.status}
                          onChange={(e) => {
                            updateMovieStatus(selectedMovie.id, e.target.value);
                            setSelectedMovie({ ...selectedMovie, status: e.target.value as any });
                          }}
                          className="status-select-modal"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="now_showing">Now Showing</option>
                          <option value="ended">Ended</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>

                      <div className="detail-row">
                        <label>DESCRIPTION:</label>
                        <p>{selectedMovie.description}</p>
                      </div>

                      <div className="detail-row">
                        <label>POSTER URL:</label>
                        <span className="url-text">{selectedMovie.poster_url}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="modal-header">
                        <h2>EDIT MOVIE</h2>
                      </div>

                      <div className="edit-form">
                        <div className="form-group">
                          <label>TITLE:</label>
                          <input
                            type="text"
                            value={editForm?.title || ''}
                            onChange={(e) => handleEditChange('title', e.target.value)}
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>GENRE:</label>
                          <input
                            type="text"
                            value={editForm?.genre || ''}
                            onChange={(e) => handleEditChange('genre', e.target.value)}
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>DURATION (minutes):</label>
                          <input
                            type="number"
                            value={editForm?.duration || 0}
                            onChange={(e) => handleEditChange('duration', parseInt(e.target.value))}
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>AGE RATING:</label>
                          <input
                            type="text"
                            value={editForm?.age_rating || ''}
                            onChange={(e) => handleEditChange('age_rating', e.target.value)}
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>STATUS:</label>
                          <select
                            value={editForm?.status || 'upcoming'}
                            onChange={(e) => handleEditChange('status', e.target.value)}
                            className="form-select"
                          >
                            <option value="upcoming">Upcoming</option>
                            <option value="now_showing">Now Showing</option>
                            <option value="ended">Ended</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>DESCRIPTION:</label>
                          <textarea
                            value={editForm?.description || ''}
                            onChange={(e) => handleEditChange('description', e.target.value)}
                            className="form-textarea"
                            rows={5}
                          />
                        </div>

                        <div className="form-group">
                          <label>POSTER URL:</label>
                          <input
                            type="text"
                            value={editForm?.poster_url || ''}
                            onChange={(e) => handleEditChange('poster_url', e.target.value)}
                            className="form-input"
                          />
                        </div>

                        <div className="form-actions">
                          <button className="btn-save" onClick={handleSaveEdit}>
                            <i className="bi bi-check-lg"></i> SAVE CHANGES
                          </button>
                          <button className="btn-cancel" onClick={() => {
                            setIsEditing(false);
                            setEditForm(selectedMovie);
                          }}>
                            <i className="bi bi-x-lg"></i> CANCEL
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { tmdbApi } from '../../services/tmdbApi';

const SimilarMovieCard = ({ movie }) => {
  if (!movie) return null;

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';

  return (
    <div className="card h-100 bg-card-custom text-white movie-card-hover border-0 overflow-hidden shadow-sm">
      <div className="position-relative aspect-ratio-poster overflow-hidden">
        <Link to={`/movie/${movie.id}`}>
          <img
            src={tmdbApi.getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="w-100 h-100 object-fit-cover"
            loading="lazy"
          />
        </Link>
        
        {/* Rating overlay */}
        <div className="position-absolute bottom-0 start-0 p-2" style={{ zIndex: 5, background: 'linear-gradient(0deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0) 100%)', width: '100%' }}>
          <span className="badge badge-rating d-inline-flex align-items-center gap-1">
            <i className="bi bi-star-fill text-warning"></i>
            {rating}
          </span>
        </div>
      </div>
      <div className="card-body p-2 text-center">
        <h6 className="card-title text-truncate fw-semibold mb-0 small" title={movie.title}>
          <Link to={`/movie/${movie.id}`} className="text-white text-decoration-none hover-primary">
            {movie.title}
          </Link>
        </h6>
      </div>
    </div>
  );
};

export default SimilarMovieCard;

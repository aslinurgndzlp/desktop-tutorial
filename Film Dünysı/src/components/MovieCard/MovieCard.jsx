import React from 'react';
import { Link } from 'react-router-dom';
import { tmdbApi } from '../../services/tmdbApi';
import FavoriteButton from '../FavoriteButton/FavoriteButton';

const MovieCard = ({ movie }) => {
  if (!movie) return null;

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Belirtilmemiş';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';

  return (
    <div className="card h-100 bg-card-custom text-white movie-card-hover border-0 overflow-hidden shadow-sm">
      {/* Poster Image Container */}
      <div className="position-relative overflow-hidden aspect-ratio-poster">
        <Link to={`/movie/${movie.id}`}>
          <img
            src={tmdbApi.getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="card-img-top w-100 h-100 object-fit-cover"
            loading="lazy"
          />
        </Link>

        {/* Favorite Button overlay */}
        <div className="position-absolute top-0 end-0 p-2" style={{ zIndex: 10 }}>
          <FavoriteButton movie={movie} />
        </div>

        {/* Rating Badge overlay */}
        <div className="position-absolute bottom-0 start-0 p-2" style={{ zIndex: 5, background: 'linear-gradient(0deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0) 100%)', width: '100%' }}>
          <span className="badge badge-rating d-inline-flex align-items-center gap-1">
            <i className="bi bi-star-fill text-warning"></i>
            {rating}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body p-3 d-flex flex-column justify-content-between">
        <div>
          <h6 className="card-title text-truncate fw-semibold mb-1" title={movie.title}>
            <Link to={`/movie/${movie.id}`} className="text-white text-decoration-none hover-primary">
              {movie.title}
            </Link>
          </h6>
          <p className="card-text text-muted-custom small mb-0 d-flex justify-content-between align-items-center">
            <span>{releaseYear}</span>
            <span className="small text-uppercase fw-semibold" style={{ fontSize: '0.65rem', color: 'var(--primary-color)' }}>Film</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

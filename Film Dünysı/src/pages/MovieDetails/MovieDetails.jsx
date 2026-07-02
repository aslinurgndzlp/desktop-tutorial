import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../../services/tmdbApi';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/EmptyState/EmptyState';
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton';
import CastCard from '../../components/CastCard/CastCard';
import SimilarMovieCard from '../../components/SimilarMovieCard/SimilarMovieCard';
import StarRating from '../../components/StarRating/StarRating';
import CommentSection from '../../components/CommentSection/CommentSection';

const MovieDetails = () => {
  const { id } = useParams();
  const [showTrailer, setShowTrailer] = useState(false);

  // Fetch movie details using React Query
  const { data: movie, isLoading, isError, error } = useQuery({
    queryKey: ['movie-details', id],
    queryFn: () => tmdbApi.getMovieDetails(id),
    enabled: !!id,
  });

  if (isLoading) {
    return <Loader message="Film detayları yükleniyor..." />;
  }

  if (isError || !movie) {
    return (
      <EmptyState
        title="Film Bulunamadı"
        message={error?.message || "Aradığınız film detaylarına ulaşılamadı. Lütfen geçerli bir film seçtiğinizden emin olun."}
        icon="bi-question-circle"
        actionText="Ana Sayfaya Dön"
        onAction={() => window.location.href = '/'}
      />
    );
  }

  // Find trailer video or use a high-quality fallback key (e.g. cinematic countdown or inception trailer)
  const trailerVideo = movie.videos?.results?.find(
    (video) => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
  );
  const trailerKey = trailerVideo?.key || 'YoHD9XEInc0'; // Default cinematic fallback trailer key

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Bilinmiyor';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';
  const runtimeHours = Math.floor(movie.runtime / 60);
  const runtimeMinutes = movie.runtime % 60;
  const runtimeText = movie.runtime 
    ? `${runtimeHours > 0 ? `${runtimeHours}s ` : ''}${runtimeMinutes}dk`
    : 'Bilinmiyor';

  const backdropUrl = tmdbApi.getBackdropUrl(movie.backdrop_path, 'original');
  const posterUrl = tmdbApi.getImageUrl(movie.poster_path, 'w500');

  // Directors & Production Companies
  const director = movie.credits?.crew?.find((person) => person.job === 'Director')?.name || 'Bilinmiyor';

  return (
    <div className="text-white">
      {/* Back Button */}
      <Link to={-1} className="btn btn-outline-light d-inline-flex align-items-center gap-2 mb-4 border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
        <i className="bi bi-arrow-left"></i>
        <span>Geri Dön</span>
      </Link>

      {/* Backdrop Header */}
      {backdropUrl && (
        <div 
          className="position-relative rounded-4 overflow-hidden mb-4 d-none d-md-block"
          style={{ 
            height: '350px',
            backgroundImage: `url(${backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          <div className="position-absolute top-0 start-0 w-100 h-100 backdrop-overlay"></div>
        </div>
      )}

      {/* Main Details Grid */}
      <div className="row g-4 mb-5">
        {/* Poster Column */}
        <div className="col-12 col-md-4 col-lg-3">
          <div className="rounded-4 overflow-hidden shadow-lg border" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
            <img src={posterUrl} alt={movie.title} className="w-100 aspect-ratio-poster" />
          </div>
        </div>

        {/* Info Column */}
        <div className="col-12 col-md-8 col-lg-9 d-flex flex-column justify-content-between text-start">
          <div>
            {/* Title & Tagline */}
            <h1 className="display-5 fw-extrabold mb-1">{movie.title}</h1>
            {movie.tagline && (
              <p className="fst-italic text-muted-custom mb-3">"{movie.tagline}"</p>
            )}

            {/* Quick Metadata */}
            <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
              <span className="badge badge-rating d-inline-flex align-items-center gap-1 px-3 py-2 rounded-2 fs-6">
                <i className="bi bi-star-fill text-warning"></i>
                {rating}
              </span>
              <span className="text-muted-custom small">
                <i className="bi bi-calendar-event me-1"></i> {releaseYear}
              </span>
              <span className="text-muted-custom small">
                <i className="bi bi-clock me-1"></i> {runtimeText}
              </span>
              <span className="text-muted-custom small">
                Yönetmen: <span className="text-white fw-medium">{director}</span>
              </span>
            </div>

            {/* User Rating */}
            <div className="d-flex align-items-center gap-2 mb-4">
              <span className="text-muted-custom small fw-semibold">Puanınız:</span>
              <StarRating movie={movie} />
            </div>

            {/* Genres */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              {movie.genres?.map((genre) => (
                <span 
                  key={genre.id} 
                  className="badge px-3 py-2 rounded-pill small" 
                  style={{ backgroundColor: 'var(--surface-color)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <h5 className="fw-semibold text-white mb-2">Özet</h5>
            <p className="text-muted-custom leading-relaxed mb-4" style={{ fontSize: '0.95rem' }}>
              {movie.overview || 'Bu film için henüz Türkçe bir özet girilmemiş.'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="d-flex align-items-center gap-3 mt-auto">
            <button 
              onClick={() => setShowTrailer(true)} 
              className="btn btn-primary-custom px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2"
              style={{ borderRadius: '8px' }}
            >
              <i className="bi bi-play-circle fs-5"></i>
              Fragmanı İzle
            </button>
            <FavoriteButton movie={movie} showText={true} />
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {movie.credits?.cast && movie.credits.cast.length > 0 && (
        <section className="mb-5 text-start">
          <h3 className="fs-4 fw-bold mb-4">
            <i className="bi bi-people-fill text-primary-custom me-2"></i>Oyuncu Kadrosu
          </h3>
          <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3">
            {movie.credits.cast.slice(0, 6).map((member) => (
              <div className="col" key={member.id}>
                <CastCard member={member} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Similar Movies Section */}
      {movie.similar?.results && movie.similar.results.length > 0 && (
        <section className="mb-5 text-start">
          <h3 className="fs-4 fw-bold mb-4">
            <i className="bi bi-film text-primary-custom me-2"></i>Benzer Filmler
          </h3>
          <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3">
            {movie.similar.results.slice(0, 6).map((similarMovie) => (
              <div className="col" key={similarMovie.id}>
                <SimilarMovieCard movie={similarMovie} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Comment Section */}
      <CommentSection movieId={movie.id} movieTitle={movie.title} />

      {/* Embedded YouTube Trailer Modal */}
      {showTrailer && (
        <>
          <div 
            className="modal-backdrop fade show" 
            style={{ zIndex: 1060, backgroundColor: 'rgba(15, 23, 42, 0.9)' }}
            onClick={() => setShowTrailer(false)}
          ></div>
          <div 
            className="modal fade show" 
            tabIndex="-1" 
            style={{ display: 'block', zIndex: 1065 }}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content modal-content-custom border-0 shadow-lg">
                <div className="modal-header modal-header-custom border-0 p-3">
                  <h5 className="modal-title fw-semibold text-white">Fragman: {movie.title}</h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    aria-label="Kapat"
                    onClick={() => setShowTrailer(false)}
                  ></button>
                </div>
                <div className="modal-body p-0" style={{ backgroundColor: '#000' }}>
                  <div className="ratio ratio-16x9">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MovieDetails;

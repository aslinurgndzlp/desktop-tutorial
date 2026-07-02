import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { tmdbApi } from '../../services/tmdbApi';
import MovieCard from '../../components/MovieCard/MovieCard';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/EmptyState/EmptyState';
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton';

const Home = () => {
  // Fetch movie categories using React Query
  const { data: trendingData, isLoading: isTrendingLoading, isError: isTrendingError } = useQuery({
    queryKey: ['movies-trending'],
    queryFn: () => tmdbApi.getTrending(1),
  });

  const { data: popularData, isLoading: isPopularLoading } = useQuery({
    queryKey: ['movies-popular'],
    queryFn: () => tmdbApi.getPopular(1),
  });

  const { data: topRatedData, isLoading: isTopRatedLoading } = useQuery({
    queryKey: ['movies-toprated'],
    queryFn: () => tmdbApi.getTopRated(1),
  });

  const { data: upcomingData, isLoading: isUpcomingLoading } = useQuery({
    queryKey: ['movies-upcoming'],
    queryFn: () => tmdbApi.getUpcoming(1),
  });

  const isLoading = isTrendingLoading || isPopularLoading || isTopRatedLoading || isUpcomingLoading;

  if (isLoading) {
    return <Loader message="Filmler yükleniyor, lütfen bekleyin..." />;
  }

  if (isTrendingError || !trendingData?.results) {
    return (
      <EmptyState
        title="Veri Yüklenemedi"
        message="TMDB API'den film verileri çekilirken bir hata oluştu. Lütfen API anahtarınızı kontrol edin."
        icon="bi-exclamation-octagon-fill"
      />
    );
  }

  // Get the featured hero movie (first trending movie)
  const heroMovie = trendingData.results[0];
  const heroBackdrop = tmdbApi.getBackdropUrl(heroMovie?.backdrop_path);
  const heroRating = heroMovie?.vote_average ? heroMovie.vote_average.toFixed(1) : '0.0';

  return (
    <div>
      {/* Featured Hero Banner */}
      {heroMovie && (
        <div 
          className="position-relative rounded-4 overflow-hidden mb-5 d-flex align-items-end"
          style={{ 
            minHeight: '450px',
            backgroundImage: `url(${heroBackdrop})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          {/* Shadow Overlay */}
          <div className="position-absolute top-0 start-0 w-100 h-100 backdrop-overlay"></div>

          {/* Hero Content */}
          <div className="position-relative p-4 p-md-5 text-white col-lg-8" style={{ zIndex: 2 }}>
            <span className="badge badge-rating mb-3 d-inline-flex align-items-center gap-1 fs-6 px-3 py-2 rounded-3">
              <i className="bi bi-star-fill text-warning"></i>
              {heroRating} TRTM Puanı
            </span>
            <h1 className="display-4 fw-extrabold mb-3 text-start" style={{ fontFamily: 'var(--heading-font)' }}>
              {heroMovie.title}
            </h1>
            <p className="lead fs-6 text-muted-custom mb-4 text-start line-clamp-3" style={{ maxHeight: '72px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {heroMovie.overview || 'Bu film için henüz bir açıklama girilmemiş.'}
            </p>
            <div className="d-flex align-items-center gap-3">
              <Link to={`/movie/${heroMovie.id}`} className="btn btn-primary-custom px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2" style={{ borderRadius: '8px' }}>
                <i className="bi bi-play-circle fs-5"></i>
                Detayları Gör
              </Link>
              <FavoriteButton movie={heroMovie} showText={true} />
            </div>
          </div>
        </div>
      )}

      {/* Movies Grid Sections */}
      <div className="d-flex flex-column gap-5">
        {/* Trending Row */}
        <section>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h2 className="fs-3 fw-bold mb-0 text-start">
              <i className="bi bi-fire text-danger me-2"></i>Haftanın Trendleri
            </h2>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
            {trendingData.results.slice(0, 10).map((movie) => (
              <div className="col" key={movie.id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </section>

        {/* Popular Row */}
        <section>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h2 className="fs-3 fw-bold mb-0 text-start">
              <i className="bi bi-star-fill text-warning me-2"></i>Popüler Filmler
            </h2>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
            {popularData?.results?.slice(0, 10).map((movie) => (
              <div className="col" key={movie.id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </section>

        {/* Top Rated Row */}
        <section>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h2 className="fs-3 fw-bold mb-0 text-start">
              <i className="bi bi-trophy-fill text-primary-custom me-2"></i>En Çok Oy Alanlar
            </h2>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
            {topRatedData?.results?.slice(0, 10).map((movie) => (
              <div className="col" key={movie.id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Row */}
        <section>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h2 className="fs-3 fw-bold mb-0 text-start">
              <i className="bi bi-calendar-event-fill text-success me-2"></i>Yakında Vizyona Girecekler
            </h2>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
            {upcomingData?.results?.slice(0, 10).map((movie) => (
              <div className="col" key={movie.id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../context/FavoriteContext';
import MovieCard from '../../components/MovieCard/MovieCard';
import EmptyState from '../../components/EmptyState/EmptyState';

const Favorites = () => {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  return (
    <div className="text-white">
      {/* Page Title */}
      <div className="text-start mb-4">
        <h2 className="fs-2 fw-bold mb-1">
          <i className="bi bi-heart-fill text-danger me-2"></i>Favori Filmlerim
        </h2>
        <p className="text-muted-custom mb-0 small">
          Kaydettiğiniz ve beğendiğiniz filmlerin listesi.
        </p>
      </div>

      {/* Favorites Grid / Empty State */}
      {favorites.length > 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4 py-2">
          {favorites.map((movie) => (
            <div className="col" key={movie.id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Henüz Favori Filminiz Yok"
          message="Görünüşe göre listenize henüz hiçbir film eklememişsiniz. Keşfetmek için hemen film aramaya başlayabilirsiniz!"
          icon="bi-heartbreak-fill"
          actionText="Film Keşfetmeye Başla"
          onAction={() => navigate('/search')}
        />
      )}
    </div>
  );
};

export default Favorites;

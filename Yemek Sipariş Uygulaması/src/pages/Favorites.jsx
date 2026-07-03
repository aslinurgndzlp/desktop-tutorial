import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchFavorites, toggleFavorite } from '../redux/features/favoriteSlice';
import { toast } from 'react-toastify';

export default function Favorites() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { favorites, loading, error } = useSelector((state) => state.favorite);

  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites(user.id));
    }
  }, [dispatch, user]);

  const handleRemoveFavorite = (fav) => {
    dispatch(
      toggleFavorite({
        userId: user.id,
        type: fav.type,
        targetId: fav.targetId,
      })
    ).then(() => {
      toast.info(`${fav.name} favorilerden kaldırıldı.`);
    });
  };

  return (
    <div className="container py-5 page-fade-in">
      <h2 className="fw-bold mb-4">Favorilerim</h2>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-orange" role="status"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center rounded-4">{error}</div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm p-4">
          <i className="bi bi-heartbreak fs-1 text-orange mb-2 d-block"></i>
          <h4 className="fw-bold mt-2">Henüz favoriniz yok</h4>
          <p className="text-secondary small">Beğendiğiniz restoranları favorilere ekleyerek burada listeleyebilirsiniz.</p>
          <Link to="/restaurants" className="btn btn-orange rounded-pill px-4 mt-2 fw-semibold">Restoranları Keşfet</Link>
        </div>
      ) : (
        <div className="row g-4">
          {favorites.map((fav) => (
            <div className="col-lg-4 col-md-6" key={fav.id}>
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white hover-lift">
                <div className="position-relative" style={{ height: '160px' }}>
                  <img 
                    src={fav.coverImage || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500'} 
                    className="w-100 h-100 object-fit-cover" 
                    alt={fav.name} 
                  />
                  <button 
                    className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center shadow"
                    style={{ width: '38px', height: '38px', zIndex: 10 }}
                    onClick={() => handleRemoveFavorite(fav)}
                  >
                    <i className="bi bi-heart-fill text-danger fs-5"></i>
                  </button>
                </div>
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title fw-bold text-dark mb-2">{fav.name}</h5>
                    <p className="text-secondary small mb-3">Favoriye Eklenme: Restoran</p>
                  </div>
                  <div className="d-flex justify-content-end">
                    <Link to={`/restaurants/${fav.targetId}`} className="btn btn-orange btn-sm px-4 rounded-pill fw-semibold">
                      Menüyü Gör
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRestaurants } from '../redux/features/restaurantSlice';
import { fetchFavorites, toggleFavorite } from '../redux/features/favoriteSlice';
import { fetchCategories } from '../redux/features/categorySlice';
import { toast } from 'react-toastify';

const getCategoryPreviewImage = (name) => {
  const nameLower = name ? name.toLowerCase() : '';
  if (nameLower.includes('burger')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=60';
  if (nameLower.includes('pizza')) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=60';
  if (nameLower.includes('tatlı') || nameLower.includes('sufle') || nameLower.includes('künefe') || nameLower.includes('baklava')) return 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&auto=format&fit=crop&q=60';
  if (nameLower.includes('içecek') || nameLower.includes('cola') || nameLower.includes('ayran') || nameLower.includes('limonata')) return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200&auto=format&fit=crop&q=60';
  if (nameLower.includes('kebap') || nameLower.includes('dürüm') || nameLower.includes('adana') || nameLower.includes('urfa')) return 'https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=200&auto=format&fit=crop&q=60';
  if (nameLower.includes('salata') || nameLower.includes('yeşillik')) return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&auto=format&fit=crop&q=60';
  if (nameLower.includes('sushi') || nameLower.includes('roll')) return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&auto=format&fit=crop&q=60';
  if (nameLower.includes('makarna') || nameLower.includes('pasta') || nameLower.includes('spagetti')) return 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=200&auto=format&fit=crop&q=60';
  return 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=200&auto=format&fit=crop&q=60';
};

export default function Home() {
  const dispatch = useDispatch();
  const { restaurants, loading, error } = useSelector((state) => state.restaurant);
  const { categories } = useSelector((state) => state.category);
  const { user, isLogin } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorite);

  useEffect(() => {
    dispatch(fetchRestaurants());
    dispatch(fetchCategories());
    if (isLogin && user) {
      dispatch(fetchFavorites(user.id));
    }
  }, [dispatch, isLogin, user]);

  const isFavorited = (restaurantId) => {
    return favorites.some(
      (f) => f.targetId === String(restaurantId) && f.type === 'restaurant'
    );
  };

  const handleFavoriteClick = (restaurant) => {
    if (!isLogin) {
      toast.info('Favoriye eklemek için lütfen giriş yapın.');
      return;
    }
    dispatch(
      toggleFavorite({
        userId: user.id,
        type: 'restaurant',
        targetId: restaurant.id,
        name: restaurant.name,
        logo: restaurant.logo,
        coverImage: restaurant.coverImage,
      })
    ).then((res) => {
      if (res.payload?.removeId) {
        toast.info(`${restaurant.name} favorilerinizden kaldırıldı.`);
      } else {
        toast.success(`${restaurant.name} favorilerinize eklendi!`);
      }
    });
  };

  // Sort restaurants newest first to guarantee newly added ones show up instantly
  const sortedRestaurants = [...restaurants].reverse();

  return (
    <div className="page-fade-in">
      {/* Hero Banner */}
      <section className="bg-orange text-white py-5 shadow-sm">
        <div className="container py-4 text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-extrabold mb-3">Lezzet Kapında!</h1>
              <p className="lead mb-4 opacity-90">
                En sevdiğin yemekler, en popüler restoranlardan sıcacık bir şekilde kapına geliyor.
              </p>
              <Link to="/restaurants" className="btn btn-light btn-lg px-5 py-3 rounded-pill text-orange fw-bold shadow hover-lift">
                Hemen Sipariş Ver
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="container py-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h4 className="fw-bold mb-0">Kategoriler</h4>
          <Link to="/restaurants" className="text-orange text-decoration-none fw-semibold">Tümünü Gör</Link>
        </div>
        <div className="row g-3 justify-content-center">
          {categories.map((cat) => (
            <div className="col-6 col-md-3" key={cat.id}>
              <Link 
                to={`/restaurants?category=${cat.name}`} 
                className="card border-0 text-center p-3 hover-lift text-decoration-none bg-white rounded-4 shadow-sm"
              >
                <img 
                  src={getCategoryPreviewImage(cat.name)} 
                  className="rounded-circle object-fit-cover mx-auto mb-2" 
                  alt={cat.name} 
                  style={{ width: '70px', height: '70px', border: '2px solid #f8f9fa' }} 
                />
                <span className="fw-bold text-dark d-block mt-1">{cat.name}</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="container py-4 mb-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h4 className="fw-bold mb-0">Popüler Restoranlar</h4>
          <Link to="/restaurants" className="text-orange text-decoration-none fw-semibold">Tümünü Gör</Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-orange" role="status"></div>
            <p className="mt-2 text-secondary">Restoranlar yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger rounded-4 py-4 text-center">
            {error}
          </div>
        ) : (
          <div className="row g-4">
            {sortedRestaurants.slice(0, 8).map((res) => (
              <div className="col-lg-3 col-md-6" key={res.id}>
                <div className="card border-0 h-100 shadow-sm rounded-4 overflow-hidden hover-lift bg-white">
                  <div className="position-relative" style={{ height: '160px' }}>
                    <img 
                      src={res.coverImage} 
                      className="w-100 h-100 object-fit-cover" 
                      alt={res.name} 
                    />
                    <button 
                      className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center shadow"
                      style={{ width: '38px', height: '38px', zIndex: 10 }}
                      onClick={() => handleFavoriteClick(res)}
                    >
                      <i className={`bi ${isFavorited(res.id) ? 'bi-heart-fill text-danger' : 'bi-heart text-secondary'} fs-5`}></i>
                    </button>
                  </div>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="card-title fw-bold text-dark mb-0">{res.name}</h5>
                      <span className="badge bg-warning-subtle text-warning fw-semibold px-2 py-1 rounded-pill">
                        ★ {res.rating}
                      </span>
                    </div>
                    <p className="text-secondary small mb-3">
                      <i className="bi bi-clock me-1"></i> {res.deliveryTime} dk • Min. sipariş {res.minOrderPrice} TL
                    </p>
                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                      <span className="text-orange fw-bold">{res.deliveryFee === 0 ? 'Ücretsiz Teslimat' : `${res.deliveryFee} TL teslimat`}</span>
                      <Link to={`/restaurants/${res.id}`} className="btn btn-orange btn-sm px-3 rounded-pill fw-semibold">
                        İncele
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

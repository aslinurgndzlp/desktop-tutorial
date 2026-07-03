import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchRestaurants } from '../redux/features/restaurantSlice';
import { fetchFavorites, toggleFavorite } from '../redux/features/favoriteSlice';
import { fetchProducts } from '../redux/features/productSlice';
import { toast } from 'react-toastify';
import { getLocalDB } from '../data/mockData';

export default function Restaurants() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { restaurants, loading, error } = useSelector((state) => state.restaurant);
  const { user, isLogin } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorite);
  const { products } = useSelector((state) => state.product);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'time' | 'minPrice'
  
  const categoryFilter = searchParams.get('category') || 'Tümü';

  useEffect(() => {
    dispatch(fetchRestaurants());
    dispatch(fetchProducts());
    if (isLogin && user) {
      dispatch(fetchFavorites(user.id));
    }
  }, [dispatch, isLogin, user]);

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

  const isFavorited = (restaurantId) => {
    return favorites.some(
      (f) => f.targetId === restaurantId && f.type === 'restaurant'
    );
  };

  // Mock checking category from list. Note: For basic mock, we map categories.
  // Real check would read menu items, but for simple mock we can assign categories.
  const filterAndSortRestaurants = () => {
    let filtered = [...restaurants];

    // Filter by Search Term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by Category
    if (categoryFilter !== 'Tümü') {
      const localDB = getLocalDB();
      const matchedCategory = localDB.categories.find(
        (c) => c.name.toLowerCase() === categoryFilter.toLowerCase()
      );
      if (matchedCategory) {
        const allowedRestIds = products
          .filter((p) => p.categoryId === matchedCategory.id)
          .map((p) => p.restaurantId);
        
        filtered = filtered.filter((r) => allowedRestIds.includes(r.id));
      } else {
        filtered = filtered.filter(r => {
          const catLower = categoryFilter.toLowerCase();
          if (catLower === 'burger') return r.name.toLowerCase().includes('burger');
          if (catLower === 'pizza') return r.name.toLowerCase().includes('pizza');
          if (catLower === 'kebap') return r.name.toLowerCase().includes('kebap');
          if (catLower === 'salata') return r.name.toLowerCase().includes('salata');
          if (catLower === 'sushi') return r.name.toLowerCase().includes('sushi');
          if (catLower === 'makarna') return r.name.toLowerCase().includes('pasta') || r.name.toLowerCase().includes('makarna');
          return true;
        });
      }
    }

    // Sort
    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'time') {
      filtered.sort((a, b) => a.deliveryTime - b.deliveryTime);
    } else if (sortBy === 'minPrice') {
      filtered.sort((a, b) => a.minOrderPrice - b.minOrderPrice);
    }

    return filtered;
  };

  const filteredRestaurants = filterAndSortRestaurants();

  const categories = ['Tümü', 'Burger', 'Pizza', 'Tatlı', 'İçecek', 'Kebap', 'Salata', 'Sushi', 'Makarna'];

  return (
    <div className="container py-5 page-fade-in">
      <div className="row mb-4 align-items-center g-3">
        <div className="col-lg-4">
          <h2 className="fw-bold mb-0">Restoranlar</h2>
          <p className="text-secondary small mb-0">En iyi restoranlar listeleniyor</p>
        </div>
        
        {/* Search Bar */}
        <div className="col-lg-5">
          <div className="input-group shadow-sm rounded-pill overflow-hidden border">
            <span className="input-group-text bg-white border-0 ps-3">
              <i className="bi bi-search text-secondary"></i>
            </span>
            <input 
              type="text" 
              className="form-control border-0 py-2.5 shadow-none" 
              placeholder="Restoran veya lezzet ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Sort select */}
        <div className="col-lg-3">
          <select 
            className="form-select border shadow-sm py-2.5 rounded-pill"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">En Yüksek Puan</option>
            <option value="time">En Hızlı Teslimat</option>
            <option value="minPrice">En Düşük Minimum Sipariş</option>
          </select>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => {
          const isActive = categoryFilter === cat;
          return (
            <Link 
              key={cat}
              to={cat === 'Tümü' ? '/restaurants' : `/restaurants?category=${cat}`}
              className={`btn btn-sm px-4 py-2 rounded-pill fw-semibold border shadow-sm ${isActive ? 'active-category' : 'btn-outline-orange'}`}
            >
              {cat}
            </Link>
          );
        })}
      </div>

      {/* Restoran List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-orange" role="status"></div>
          <p className="mt-2 text-secondary">Yükleniyor...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center rounded-4 py-4">{error}</div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm p-4">
          <i className="bi bi-search fs-1 text-orange mb-2 d-block"></i>
          <h4 className="fw-bold mt-2">Sonuç Bulunamadı</h4>
          <p className="text-secondary small">Kriterlere uygun restoran bulamadık. Lütfen aramayı değiştirin.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredRestaurants.map((res) => (
            <div className="col-lg-4 col-md-6" key={res.id}>
              <div className="card border-0 h-100 shadow-sm rounded-4 overflow-hidden hover-lift bg-white">
                <div className="position-relative" style={{ height: '180px' }}>
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
                  <p className="text-secondary small mb-3">{res.address}</p>
                  <p className="text-secondary small mb-3">
                    <i className="bi bi-clock me-1"></i> {res.deliveryTime} dk • Min. sipariş {res.minOrderPrice} TL
                  </p>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className="text-orange fw-bold">{res.deliveryFee === 0 ? 'Ücretsiz Teslimat' : `${res.deliveryFee} TL teslimat`}</span>
                    <Link to={`/restaurants/${res.id}`} className="btn btn-orange btn-sm px-4 rounded-pill fw-semibold">
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

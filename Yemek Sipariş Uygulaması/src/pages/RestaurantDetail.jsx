import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantDetail } from '../redux/features/restaurantSlice';
import { fetchProductsByRestaurant } from '../redux/features/productSlice';
import { fetchCategories } from '../redux/features/categorySlice';
import { addToBasket } from '../redux/features/basketSlice';
import { toggleFavorite, fetchFavorites } from '../redux/features/favoriteSlice';
import { toast } from 'react-toastify';

const getFoodImage = (categoryId, name) => {
  const nameLower = name ? name.toLowerCase() : '';
  if (nameLower.includes('burger')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=60';
  if (nameLower.includes('patates') || nameLower.includes('frites')) return 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&auto=format&fit=crop&q=60';
  if (nameLower.includes('pizza') || nameLower.includes('margarita')) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=60';
  if (nameLower.includes('sufle') || nameLower.includes('tiramisu') || nameLower.includes('tatlı') || nameLower.includes('mochi') || nameLower.includes('künefe') || nameLower.includes('baklava')) return 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&auto=format&fit=crop&q=60';
  if (nameLower.includes('cola') || nameLower.includes('kola') || nameLower.includes('içecek') || nameLower.includes('ayran') || nameLower.includes('fanta') || nameLower.includes('meyve') || nameLower.includes('su') || nameLower.includes('şalgam') || nameLower.includes('limonata')) return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200&auto=format&fit=crop&q=60';
  if (nameLower.includes('kebap') || nameLower.includes('dürüm') || nameLower.includes('adana') || nameLower.includes('urfa') || nameLower.includes('lahmacun')) return 'https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=200&auto=format&fit=crop&q=60';
  if (nameLower.includes('salata') || nameLower.includes('yeşillik') || nameLower.includes('sezar')) return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&auto=format&fit=crop&q=60';
  if (nameLower.includes('sushi') || nameLower.includes('tempura') || nameLower.includes('roll')) return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&auto=format&fit=crop&q=60';
  if (nameLower.includes('makarna') || nameLower.includes('pasta') || nameLower.includes('spagetti') || nameLower.includes('penne')) return 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=200&auto=format&fit=crop&q=60';

  switch (String(categoryId)) {
    case '1': return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=60';
    case '2': return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=60';
    case '3': return 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&auto=format&fit=crop&q=60';
    case '4': return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200&auto=format&fit=crop&q=60';
    case '5': return 'https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=200&auto=format&fit=crop&q=60';
    case '6': return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&auto=format&fit=crop&q=60';
    case '7': return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&auto=format&fit=crop&q=60';
    case '8': return 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=200&auto=format&fit=crop&q=60';
    default: return 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=200&auto=format&fit=crop&q=60';
  }
};

export default function RestaurantDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentRestaurant, loading: resLoading, error: resError } = useSelector((state) => state.restaurant);
  const { restaurantProducts, loading: prodLoading } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);
  const { user, isLogin } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorite);

  const [activeTab, setActiveTab] = useState('all');

  // Customization States
  const [selectedCustomizeProduct, setSelectedCustomizeProduct] = useState(null);
  const [burgerPatties, setBurgerPatties] = useState('Tek Köfte');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedSauces, setSelectedSauces] = useState([]);
  const [pizzaSize, setPizzaSize] = useState('Küçük Boy');
  const [dessertPortion, setDessertPortion] = useState('Tek Porsiyon');
  const [dessertSauce, setDessertSauce] = useState('Çikolata Sosu');
  const [drinkSize, setDrinkSize] = useState('330ml Kutu');
  const [drinkIce, setDrinkIce] = useState('Buzlu');
  const [kebapPortion, setKebapPortion] = useState('1 Porsiyon');
  const [kebapSpicy, setKebapSpicy] = useState('Acısız');
  const [salataExtras, setSalataExtras] = useState([]);
  const [salataSauces, setSalataSauces] = useState([]);
  const [sushiSize, setSushiSize] = useState('4 Adet');
  const [makarnaSauce, setMakarnaSauce] = useState('Alfredo Sos');
  const [makarnaExtras, setMakarnaExtras] = useState([]);

  useEffect(() => {
    dispatch(fetchRestaurantDetail(id));
    dispatch(fetchProductsByRestaurant(id));
    dispatch(fetchCategories());
    if (isLogin && user) {
      dispatch(fetchFavorites(user.id));
    }
  }, [dispatch, id, isLogin, user]);

  const isFavorited = () => {
    return favorites.some((fav) => fav.type === 'restaurant' && fav.targetId === String(id));
  };

  const handleFavoriteClick = () => {
    if (!isLogin) {
      toast.info('Favoriye eklemek için lütfen giriş yapın.');
      return;
    }
    dispatch(
      toggleFavorite({
        userId: user.id,
        type: 'restaurant',
        targetId: currentRestaurant.id,
        name: currentRestaurant.name,
        logo: currentRestaurant.logo,
        coverImage: currentRestaurant.coverImage,
      })
    ).then((res) => {
      if (res.payload?.removeId) {
        toast.info(`${currentRestaurant.name} favorilerinizden kaldırıldı.`);
      } else {
        toast.success(`${currentRestaurant.name} favorilerinize eklendi!`);
      }
    });
  };

  const handleOpenCustomize = (product) => {
    setSelectedCustomizeProduct(product);
    setBurgerPatties('Tek Köfte');
    setSelectedIngredients([]);
    setSelectedSauces([]);
    setPizzaSize('Küçük Boy');
    setDessertPortion('Tek Porsiyon');
    setDessertSauce('Çikolata Sosu');
    setDrinkSize('330ml Kutu');
    setDrinkIce('Buzlu');
    setKebapPortion('1 Porsiyon');
    setKebapSpicy('Acısız');
    setSalataExtras([]);
    setSalataSauces([]);
    setSushiSize('4 Adet');
    setMakarnaSauce('Alfredo Sos');
    setMakarnaExtras([]);
  };

  const getCustomizationDetails = () => {
    if (!selectedCustomizeProduct) return { extraPrice: 0, customizations: [] };
    
    const categoryName = categories.find(c => c.id === selectedCustomizeProduct.categoryId)?.name || '';
    let extraPrice = 0;
    const customizations = [];

    const isBurger = categoryName.toLowerCase() === 'burger' || selectedCustomizeProduct.name.toLowerCase().includes('burger');
    const isPizza = categoryName.toLowerCase() === 'pizza' || selectedCustomizeProduct.name.toLowerCase().includes('pizza');
    const isDessert = categoryName.toLowerCase() === 'tatlı' || selectedCustomizeProduct.name.toLowerCase().includes('tatli') || selectedCustomizeProduct.name.toLowerCase().includes('tatlı');
    const isDrink = categoryName.toLowerCase() === 'içecek' || selectedCustomizeProduct.name.toLowerCase().includes('içecek') || selectedCustomizeProduct.name.toLowerCase().includes('kola') || selectedCustomizeProduct.name.toLowerCase().includes('cola') || selectedCustomizeProduct.name.toLowerCase().includes('limonata');
    const isKebap = categoryName.toLowerCase() === 'kebap' || selectedCustomizeProduct.name.toLowerCase().includes('kebap') || selectedCustomizeProduct.name.toLowerCase().includes('dürüm') || selectedCustomizeProduct.name.toLowerCase().includes('lahmacun');
    const isSalad = categoryName.toLowerCase() === 'salata' || selectedCustomizeProduct.name.toLowerCase().includes('salata');
    const isSushi = categoryName.toLowerCase() === 'sushi' || selectedCustomizeProduct.name.toLowerCase().includes('sushi') || selectedCustomizeProduct.name.toLowerCase().includes('roll');
    const isPasta = categoryName.toLowerCase() === 'makarna' || selectedCustomizeProduct.name.toLowerCase().includes('makarna') || selectedCustomizeProduct.name.toLowerCase().includes('pasta') || selectedCustomizeProduct.name.toLowerCase().includes('spagetti');

    if (isBurger) {
      if (burgerPatties === 'Çift Köfte (+50 TL)') {
        extraPrice += 50;
        customizations.push({ title: 'Köfte Sayısı', value: 'Çift Köfte' });
      } else if (burgerPatties === 'Üçlü Köfte (+90 TL)') {
        extraPrice += 90;
        customizations.push({ title: 'Köfte Sayısı', value: 'Üçlü Köfte' });
      } else {
        customizations.push({ title: 'Köfte Sayısı', value: 'Tek Köfte' });
      }
      if (selectedIngredients.length > 0) {
        customizations.push({ title: 'Malzemeler', value: selectedIngredients.join(', ') });
      }
      if (selectedSauces.length > 0) {
        customizations.push({ title: 'Soslar', value: selectedSauces.join(', ') });
      }
    } else if (isPizza) {
      if (pizzaSize === 'Orta Boy (+40 TL)') {
        extraPrice += 40;
        customizations.push({ title: 'Boyut', value: 'Orta Boy' });
      } else if (pizzaSize === 'Büyük Boy (+70 TL)') {
        extraPrice += 70;
        customizations.push({ title: 'Boyut', value: 'Büyük Boy' });
      } else {
        customizations.push({ title: 'Boyut', value: 'Küçük Boy' });
      }
      if (selectedIngredients.length > 0) {
        customizations.push({ title: 'Ek Malzemeler', value: selectedIngredients.join(', ') });
      }
    } else if (isDessert) {
      if (dessertPortion === 'Duble Porsiyon (+50 TL)') {
        extraPrice += 50;
        customizations.push({ title: 'Porsiyon', value: 'Duble Porsiyon' });
      } else {
        customizations.push({ title: 'Porsiyon', value: 'Tek Porsiyon' });
      }
      customizations.push({ title: 'Sos', value: dessertSauce });
    } else if (isDrink) {
      if (drinkSize === '1L Şişe (+25 TL)') {
        extraPrice += 25;
        customizations.push({ title: 'Boyut', value: '1L Şişe' });
      } else {
        customizations.push({ title: 'Boyut', value: '330ml Kutu' });
      }
      customizations.push({ title: 'Buz', value: drinkIce });
    } else if (isKebap) {
      if (kebapPortion === '1.5 Porsiyon (+60 TL)') {
        extraPrice += 60;
        customizations.push({ title: 'Porsiyon', value: '1.5 Porsiyon' });
      } else if (kebapPortion === 'Duble Porsiyon (+100 TL)') {
        extraPrice += 100;
        customizations.push({ title: 'Porsiyon', value: 'Duble Porsiyon' });
      } else {
        customizations.push({ title: 'Porsiyon', value: '1 Porsiyon' });
      }
      if (selectedIngredients.length > 0) {
        customizations.push({ title: 'Malzemeler', value: selectedIngredients.join(', ') });
      }
      customizations.push({ title: 'Acı', value: kebapSpicy });
    } else if (isSalad) {
      salataExtras.forEach(ext => {
        if (ext.includes('+20')) extraPrice += 20;
        if (ext.includes('+40')) extraPrice += 40;
      });
      if (salataExtras.length > 0) {
        customizations.push({ title: 'Ekstralar', value: salataExtras.map(e => e.split(' (')[0]).join(', ') });
      }
      if (salataSauces.length > 0) {
        customizations.push({ title: 'Soslar', value: salataSauces.join(', ') });
      }
    } else if (isSushi) {
      if (sushiSize === '8 Adet (+80 TL)') {
        extraPrice += 80;
        customizations.push({ title: 'Porsiyon', value: '8 Adet' });
      } else {
        customizations.push({ title: 'Porsiyon', value: '4 Adet' });
      }
      if (selectedSauces.length > 0) {
        customizations.push({ title: 'Soslar', value: selectedSauces.join(', ') });
      }
    } else if (isPasta) {
      customizations.push({ title: 'Sos', value: makarnaSauce });
      makarnaExtras.forEach(ext => {
        if (ext.includes('+20')) extraPrice += 20;
        if (ext.includes('+30')) extraPrice += 30;
      });
      if (makarnaExtras.length > 0) {
        customizations.push({ title: 'Ekstralar', value: makarnaExtras.map(e => e.split(' (')[0]).join(', ') });
      }
    }

    return { extraPrice, customizations };
  };

  const handleAddToBasket = (product) => {
    if (!isLogin) {
      toast.info('Sepete ürün eklemek için lütfen giriş yapın.');
      return;
    }
    handleOpenCustomize(product);
  };

  const handleConfirmAddToBasket = () => {
    if (!isLogin) {
      toast.info('Sepete ürün eklemek için lütfen giriş yapın.');
      return;
    }
    const { extraPrice, customizations } = getCustomizationDetails();
    const finalPrice = selectedCustomizeProduct.price + extraPrice;
    
    const customizationHash = customizations.map(c => c.value).join('-');
    const uniqueId = customizationHash ? `${selectedCustomizeProduct.id}-${customizationHash}` : selectedCustomizeProduct.id;

    dispatch(addToBasket({
      id: uniqueId,
      name: selectedCustomizeProduct.name,
      price: finalPrice,
      image: getFoodImage(selectedCustomizeProduct.categoryId, selectedCustomizeProduct.name),
      restaurantId: selectedCustomizeProduct.restaurantId,
      restaurantName: currentRestaurant.name,
      customizations: customizations
    }));

    toast.success(`${selectedCustomizeProduct.name} sepete eklendi!`);
    setSelectedCustomizeProduct(null);
  };

  if (resLoading) {
    return (
      <div className="text-center py-5 page-fade-in">
        <div className="spinner-border text-orange" role="status"></div>
        <p className="mt-2 text-secondary">Yükleniyor...</p>
      </div>
    );
  }

  if (resError || !currentRestaurant) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger rounded-4">{resError || 'Restoran bulunamadı.'}</div>
        <Link to="/restaurants" className="btn btn-orange rounded-pill mt-3">Geri Dön</Link>
      </div>
    );
  }

  // Filter products by category
  const filteredProducts = activeTab === 'all' 
    ? restaurantProducts 
    : restaurantProducts.filter(p => p.categoryId === activeTab);

  return (
    <div className="page-fade-in pb-5">
      {/* Cover Banner */}
      <div className="position-relative" style={{ height: '300px' }}>
        <img 
          src={currentRestaurant.coverImage} 
          className="w-100 h-100 object-fit-cover" 
          alt={currentRestaurant.name} 
          style={{ filter: 'brightness(0.7)' }}
        />
        <div className="position-absolute bottom-0 start-0 w-100 p-4 text-white" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
          <div className="container d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
            <div>
              <div className="d-flex align-items-center gap-3">
                <span className="fs-1 bg-white p-2 rounded-circle shadow" style={{ width: '64px', height: '64px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {currentRestaurant.logo && currentRestaurant.logo.startsWith('bi-') ? (
                    <i className={`bi ${currentRestaurant.logo} text-orange fs-2`}></i>
                  ) : (
                    <i className="bi bi-shop text-orange fs-2"></i>
                  )}
                </span>
                <div>
                  <h1 className="fw-bold mb-1">{currentRestaurant.name}</h1>
                  <p className="mb-0 small opacity-90"><i className="bi bi-geo-alt-fill me-1"></i> {currentRestaurant.address}</p>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-light rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
                onClick={handleFavoriteClick}
              >
                <i className={`bi ${isFavorited() ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                {isFavorited() ? 'Favorilerimde' : 'Favorilere Ekle'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Stats Bar */}
      <div className="bg-white py-3 border-bottom shadow-sm">
        <div className="container">
          <div className="row text-center g-3">
            <div className="col-4 border-end">
              <div className="fw-bold text-warning fs-5">★ {currentRestaurant.rating}</div>
              <div className="text-secondary small">Değerlendirme</div>
            </div>
            <div className="col-4 border-end">
              <div className="fw-bold text-dark fs-5">{currentRestaurant.deliveryTime} dk</div>
              <div className="text-secondary small">Teslimat Süresi</div>
            </div>
            <div className="col-4">
              <div className="fw-bold text-dark fs-5">{currentRestaurant.minOrderPrice} TL</div>
              <div className="text-secondary small">Min. Sipariş</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Menu Section */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Categories Sidebar */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white sticky-top" style={{ top: '90px', zIndex: 10 }}>
              <h5 className="fw-bold mb-3 border-bottom pb-2">Menü</h5>
              <div className="nav flex-column nav-pills gap-1">
                <button
                  className={`nav-link text-start rounded-3 fw-semibold py-2.5 px-3 border-0 ${activeTab === 'all' ? 'active-category shadow-sm' : 'bg-transparent text-secondary'}`}
                  onClick={() => setActiveTab('all')}
                >
                  Tüm Ürünler ({restaurantProducts.length})
                </button>
                {categories.map((cat) => {
                  const count = restaurantProducts.filter(p => p.categoryId === cat.id).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={cat.id}
                      className={`nav-link text-start rounded-3 fw-semibold py-2.5 px-3 border-0 ${activeTab === cat.id ? 'active-category shadow-sm' : 'bg-transparent text-secondary'}`}
                      onClick={() => setActiveTab(cat.id)}
                    >
                      {cat.name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="col-lg-9">
            <h4 className="fw-bold mb-4">
              {activeTab === 'all' ? 'Tüm Ürünler' : categories.find(c => c.id === activeTab)?.name}
            </h4>

            {prodLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-orange" role="status"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-5 bg-white rounded-4 shadow-sm p-4">
                <i className="bi bi-egg-fried text-orange fs-1 d-block mb-2"></i>
                <p className="text-secondary mt-2">Bu kategoride henüz ürün bulunmuyor.</p>
              </div>
            ) : (
              <div className="row g-4">
                {filteredProducts.map((prod) => (
                  <div className="col-md-6" key={prod.id}>
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white hover-lift">
                      <div className="row g-0 h-100">
                        <div className="col-4 bg-light d-flex align-items-center justify-content-center border-end" style={{ height: '120px', overflow: 'hidden' }}>
                          <img 
                            src={getFoodImage(prod.categoryId, prod.name)} 
                            alt={prod.name} 
                            className="w-100 h-100 object-fit-cover"
                          />
                        </div>
                        <div className="col-8 d-flex flex-column">
                          <div className="card-body p-3 flex-grow-1">
                            <h6 className="card-title fw-bold text-dark mb-1">{prod.name}</h6>
                            <p className="card-text text-secondary small text-xs mb-2 text-truncate-2">
                              {prod.description}
                            </p>
                            <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                              <span className="fw-bold text-orange">{prod.price} TL</span>
                              <button 
                                className="btn btn-orange btn-sm px-3 rounded-pill fw-semibold d-flex align-items-center gap-1"
                                onClick={() => handleAddToBasket(prod)}
                                disabled={!prod.isActive || prod.stock <= 0}
                              >
                                <i className="bi bi-cart-plus-fill"></i>
                                {prod.stock <= 0 ? 'Stok Yok' : 'Ekle'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Customization Modal */}
      {selectedCustomizeProduct && (() => {
        const categoryName = categories.find(c => c.id === selectedCustomizeProduct.categoryId)?.name || '';
        const isBurger = categoryName.toLowerCase() === 'burger' || selectedCustomizeProduct.name.toLowerCase().includes('burger');
        const isPizza = categoryName.toLowerCase() === 'pizza' || selectedCustomizeProduct.name.toLowerCase().includes('pizza');
        const isDessert = categoryName.toLowerCase() === 'tatlı' || selectedCustomizeProduct.name.toLowerCase().includes('tatli') || selectedCustomizeProduct.name.toLowerCase().includes('tatlı');
        const isDrink = categoryName.toLowerCase() === 'içecek' || selectedCustomizeProduct.name.toLowerCase().includes('içecek') || selectedCustomizeProduct.name.toLowerCase().includes('kola') || selectedCustomizeProduct.name.toLowerCase().includes('cola') || selectedCustomizeProduct.name.toLowerCase().includes('limonata');
        const isKebap = categoryName.toLowerCase() === 'kebap' || selectedCustomizeProduct.name.toLowerCase().includes('kebap') || selectedCustomizeProduct.name.toLowerCase().includes('dürüm') || selectedCustomizeProduct.name.toLowerCase().includes('lahmacun');
        const isSalad = categoryName.toLowerCase() === 'salata' || selectedCustomizeProduct.name.toLowerCase().includes('salata');
        const isSushi = categoryName.toLowerCase() === 'sushi' || selectedCustomizeProduct.name.toLowerCase().includes('sushi') || selectedCustomizeProduct.name.toLowerCase().includes('roll');
        const isPasta = categoryName.toLowerCase() === 'makarna' || selectedCustomizeProduct.name.toLowerCase().includes('makarna') || selectedCustomizeProduct.name.toLowerCase().includes('pasta') || selectedCustomizeProduct.name.toLowerCase().includes('spagetti');

        const { extraPrice } = getCustomizationDetails();
        const totalCustomizePrice = selectedCustomizeProduct.price + extraPrice;

        const toggleIngredient = (ing) => {
          setSelectedIngredients(prev => 
            prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]
          );
        };

        const toggleSauce = (sauce) => {
          setSelectedSauces(prev => 
            prev.includes(sauce) ? prev.filter(s => s !== sauce) : [...prev, sauce]
          );
        };

        const toggleSalataExtra = (ext) => {
          setSalataExtras(prev => 
            prev.includes(ext) ? prev.filter(e => e !== ext) : [...prev, ext]
          );
        };

        const toggleSalataSauce = (sauce) => {
          setSalataSauces(prev => 
            prev.includes(sauce) ? prev.filter(s => s !== sauce) : [...prev, sauce]
          );
        };

        const toggleMakarnaExtra = (ext) => {
          setMakarnaExtras(prev => 
            prev.includes(ext) ? prev.filter(e => e !== ext) : [...prev, ext]
          );
        };

        return (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-bottom-0 pb-0">
                  <h5 className="modal-title fw-bold">{selectedCustomizeProduct.name} Özelleştir</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedCustomizeProduct(null)} aria-label="Close"></button>
                </div>
                <div className="modal-body py-3">
                  <div className="text-center mb-3">
                    <img 
                      src={getFoodImage(selectedCustomizeProduct.categoryId, selectedCustomizeProduct.name)} 
                      alt={selectedCustomizeProduct.name} 
                      className="rounded-4 object-fit-cover shadow-sm mb-2" 
                      style={{ width: '100%', height: '180px' }} 
                    />
                    <p className="text-secondary small px-2 mb-0">{selectedCustomizeProduct.description}</p>
                  </div>

                  {/* BURGER CUSTOMIZATION OPTIONS */}
                  {isBurger && (
                    <>
                      <div className="mb-4">
                        <span className="fw-bold text-dark d-block mb-2 small text-uppercase">Köfte Sayısı</span>
                        <div className="d-flex flex-column gap-2">
                          {['Tek Köfte', 'Çift Köfte (+50 TL)', 'Üçlü Köfte (+90 TL)'].map((p) => (
                            <label className="d-flex justify-content-between align-items-center bg-light p-2.5 rounded-3 cursor-pointer" key={p}>
                              <span className="small">{p}</span>
                              <input 
                                type="radio" 
                                name="burgerPatties" 
                                checked={burgerPatties === p} 
                                onChange={() => setBurgerPatties(p)} 
                                className="form-check-input text-orange" 
                              />
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className="fw-bold text-dark d-block mb-2 small text-uppercase">Malzemeler (Çıkarılacak)</span>
                        <div className="row g-2">
                          {['Marul', 'Domates', 'Soğan', 'Turşu'].map((ing) => {
                            const isSelected = selectedIngredients.includes(ing);
                            return (
                              <div className="col-6" key={ing}>
                                <button 
                                  type="button" 
                                  className={`btn btn-sm w-100 py-2.5 rounded-3 border ${isSelected ? 'btn-danger border-danger text-white' : 'btn-outline-secondary'}`}
                                  onClick={() => toggleIngredient(ing)}
                                >
                                  {isSelected ? `${ing} (Çıkarıldı)` : ing}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="fw-bold text-dark d-block mb-2 small text-uppercase">Soslar</span>
                        <div className="row g-2">
                          {['Ketçap', 'Mayonez', 'Hardal', 'Özel Sos'].map((sauce) => {
                            const isSelected = selectedSauces.includes(sauce);
                            return (
                              <div className="col-6" key={sauce}>
                                <button 
                                  type="button" 
                                  className={`btn btn-sm w-100 py-2.5 rounded-3 border ${isSelected ? 'btn-orange text-white border-orange' : 'btn-outline-secondary'}`}
                                  onClick={() => toggleSauce(sauce)}
                                >
                                  {sauce}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {/* PIZZA CUSTOMIZATION OPTIONS */}
                  {isPizza && (
                    <>
                      <div className="mb-4">
                        <span className="fw-bold text-dark d-block mb-2 small text-uppercase">Boyut</span>
                        <div className="d-flex flex-column gap-2">
                          {['Küçük Boy', 'Orta Boy (+40 TL)', 'Büyük Boy (+70 TL)'].map((size) => (
                            <label className="d-flex justify-content-between align-items-center bg-light p-2.5 rounded-3 cursor-pointer" key={size}>
                              <span className="small">{size}</span>
                              <input 
                                type="radio" 
                                name="pizzaSize" 
                                checked={pizzaSize === size} 
                                onChange={() => setPizzaSize(size)} 
                                className="form-check-input" 
                              />
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="fw-bold text-dark d-block mb-2 small text-uppercase">Ekstra Malzemeler</span>
                        <div className="row g-2">
                          {['Mısır', 'Zeytin', 'Sucuk', 'Mantar', 'Biber'].map((ing) => {
                            const isSelected = selectedIngredients.includes(ing);
                            return (
                              <div className="col-6" key={ing}>
                                <button 
                                  type="button" 
                                  className={`btn btn-sm w-100 py-2.5 rounded-3 border ${isSelected ? 'btn-orange text-white border-orange' : 'btn-outline-secondary'}`}
                                  onClick={() => toggleIngredient(ing)}
                                >
                                  {ing}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {/* TATLI CUSTOMIZATION OPTIONS */}
                  {isDessert && (
                    <>
                      <div className="mb-4">
                        <span className="fw-bold text-dark d-block mb-2 small text-uppercase">Porsiyon</span>
                        <div className="d-flex flex-column gap-2">
                          {['Tek Porsiyon', 'Duble Porsiyon (+50 TL)'].map((p) => (
                            <label className="d-flex justify-content-between align-items-center bg-light p-2.5 rounded-3 cursor-pointer" key={p}>
                              <span className="small">{p}</span>
                              <input 
                                type="radio" 
                                name="dessertPortion" 
                                checked={dessertPortion === p} 
                                onChange={() => setDessertPortion(p)} 
                                className="form-check-input" 
                              />
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="fw-bold text-dark d-block mb-2 small text-uppercase">Sos Seçeneği</span>
                        <div className="d-flex flex-column gap-2">
                          {['Çikolata Sosu', 'Karamel Sosu', 'Çilek Sosu', 'Antep Fıstığı Tozu'].map((s) => (
                            <label className="d-flex justify-content-between align-items-center bg-light p-2.5 rounded-3 cursor-pointer" key={s}>
                              <span className="small">{s}</span>
                              <input 
                                type="radio" 
                                name="dessertSauce" 
                                checked={dessertSauce === s} 
                                onChange={() => setDessertSauce(s)} 
                                className="form-check-input" 
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* ICECEK CUSTOMIZATION OPTIONS */}
                  {isDrink && (
                    <>
                      <div className="mb-4">
                        <span className="fw-bold text-dark d-block mb-2 small text-uppercase">Boyut</span>
                        <div className="d-flex flex-column gap-2">
                          {['330ml Kutu', '1L Şişe (+25 TL)'].map((size) => (
                            <label className="d-flex justify-content-between align-items-center bg-light p-2.5 rounded-3 cursor-pointer" key={size}>
                              <span className="small">{size}</span>
                              <input 
                                type="radio" 
                                name="drinkSize" 
                                checked={drinkSize === size} 
                                onChange={() => setDrinkSize(size)} 
                                className="form-check-input" 
                              />
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="fw-bold text-dark d-block mb-2 small text-uppercase">Buz Seçeneği</span>
                        <div className="d-flex flex-column gap-2">
                          {['Buzlu', 'Buzsuz'].map((ice) => (
                            <label className="d-flex justify-content-between align-items-center bg-light p-2.5 rounded-3 cursor-pointer" key={ice}>
                              <span className="small">{ice}</span>
                              <input 
                                type="radio" 
                                name="drinkIce" 
                                checked={drinkIce === ice} 
                                onChange={() => setDrinkIce(ice)} 
                                className="form-check-input" 
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* KEBAP CUSTOMIZATION OPTIONS */}
                  {isKebap && (
                    <>
                      <div className="mb-4">
                        <span className="fw-bold text-dark d-block mb-2 small text-uppercase">Porsiyon</span>
                        <div className="d-flex flex-column gap-2">
                          {['1 Porsiyon', '1.5 Porsiyon (+60 TL)', 'Duble Porsiyon (+100 TL)'].map((p) => (
                            <label className="d-flex justify-content-between align-items-center bg-light p-2.5 rounded-3 cursor-pointer" key={p}>
                              <span className="small">{p}</span>
                              <input 
                                type="radio" 
                                name="kebapPortion" 
                                checked={kebapPortion === p} 
                                onChange={() => setKebapPortion(p)} 
                                className="form-check-input" 
                              />
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className="fw-bold text-dark d-block mb-2 small text-uppercase">Malzemeler (Çıkarılacak)</span>
                        <div className="row g-2">
                          {['Soğan', 'Domates', 'Maydanoz'].map((ing) => {
                            const isSelected = selectedIngredients.includes(ing);
                            return (
                              <div className="col-4" key={ing}>
                                <button 
                                  type="button" 
                                  className={`btn btn-sm w-100 py-2.5 rounded-3 border ${isSelected ? 'btn-danger border-danger text-white' : 'btn-outline-secondary'}`}
                                  onClick={() => toggleIngredient(ing)}
                                >
                                  {isSelected ? `${ing} (Yok)` : ing}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="fw-bold text-dark d-block mb-2 small text-uppercase">Acı Seçeneği</span>
                        <div className="d-flex gap-3">
                          {['Acılı', 'Acısız'].map((spicy) => (
                            <label className="d-flex align-items-center gap-2 cursor-pointer" key={spicy}>
                              <input 
                                type="radio" 
                                name="kebapSpicy" 
                                checked={kebapSpicy === spicy} 
                                onChange={() => setKebapSpicy(spicy)} 
                                className="form-check-input" 
                              />
                              <span className="small">{spicy}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* SALAD CUSTOMIZATION OPTIONS */}
                  {isSalad && (
                    <>
                      <div className="mb-4">
                        <span className="fw-bold text-dark d-block mb-2 small text-uppercase">Sos Tercihi</span>
                        <div className="row g-2">
                          {['Zeytinyağı', 'Limon', 'Nar Ekşisi', 'Sezar Sos'].map((sauce) => {
                            const isSelected = salataSauces.includes(sauce);
                            return (
                              <div className="col-6" key={sauce}>
                                <button 
                                  type="button" 
                                  className={`btn btn-sm w-100 py-2.5 rounded-3 border ${isSelected ? 'btn-orange text-white border-orange' : 'btn-outline-secondary'}`}
                                  onClick={() => toggleSalataSauce(sauce)}
                                >
                                  {sauce}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="fw-bold text-dark d-block mb-2 small text-uppercase">Ekstralar</span>
                        <div className="d-flex flex-column gap-2">
                          {['Peynir Dilimleri (+20 TL)', 'Tavuk Parçaları (+40 TL)'].map((ext) => {
                            const isSelected = salataExtras.includes(ext);
                            return (
                              <label className="d-flex justify-content-between align-items-center bg-light p-2.5 rounded-3 cursor-pointer" key={ext}>
                                <span className="small">{ext}</span>
                                <input 
                                  type="checkbox" 
                                  checked={isSelected} 
                                  onChange={() => toggleSalataExtra(ext)} 
                                  className="form-check-input" 
                                />
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {/* SUSHI CUSTOMIZATION OPTIONS */}
                  {isSushi && (
                    <>
                      <div className="mb-4">
                        <span className="fw-bold text-dark d-block mb-2 small text-uppercase">Porsiyon</span>
                        <div className="d-flex flex-column gap-2">
                          {['4 Adet', '8 Adet (+80 TL)'].map((size) => (
                            <label className="d-flex justify-content-between align-items-center bg-light p-2.5 rounded-3 cursor-pointer" key={size}>
                              <span className="small">{size}</span>
                              <input 
                                type="radio" 
                                name="sushiSize" 
                                checked={sushiSize === size} 
                                onChange={() => setSushiSize(size)} 
                                className="form-check-input" 
                              />
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="fw-bold text-dark d-block mb-2 small text-uppercase">Soslar</span>
                        <div className="row g-2">
                          {['Soya Sosu', 'Wasabi', 'Zencefil Turşusu'].map((sauce) => {
                            const isSelected = selectedSauces.includes(sauce);
                            return (
                              <div className="col-4" key={sauce}>
                                <button 
                                  type="button" 
                                  className={`btn btn-sm w-100 py-2.5 rounded-3 border ${isSelected ? 'btn-orange text-white border-orange' : 'btn-outline-secondary'}`}
                                  onClick={() => toggleSauce(sauce)}
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  {sauce.split(' ')[0]}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {/* MAKARNA CUSTOMIZATION OPTIONS */}
                  {isPasta && (
                    <>
                      <div className="mb-4">
                        <span className="fw-bold text-dark d-block mb-2 small text-uppercase">Sos Tercihi</span>
                        <div className="d-flex flex-column gap-2">
                          {['Alfredo Sos', 'Napoliten Sos', 'Pesto Sos'].map((s) => (
                            <label className="d-flex justify-content-between align-items-center bg-light p-2.5 rounded-3 cursor-pointer" key={s}>
                              <span className="small">{s}</span>
                              <input 
                                type="radio" 
                                name="makarnaSauce" 
                                checked={makarnaSauce === s} 
                                onChange={() => setMakarnaSauce(s)} 
                                className="form-check-input" 
                              />
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="fw-bold text-dark d-block mb-2 small text-uppercase">Ekstralar</span>
                        <div className="d-flex flex-column gap-2">
                          {['Ekstra Kaşar Peyniri (+20 TL)', 'Tavuk Parçaları (+30 TL)'].map((ext) => {
                            const isSelected = makarnaExtras.includes(ext);
                            return (
                              <label className="d-flex justify-content-between align-items-center bg-light p-2.5 rounded-3 cursor-pointer" key={ext}>
                                <span className="small">{ext}</span>
                                <input 
                                  type="checkbox" 
                                  checked={isSelected} 
                                  onChange={() => toggleMakarnaExtra(ext)} 
                                  className="form-check-input" 
                                />
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                </div>
                <div className="modal-footer border-top-0 pt-0">
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div>
                      <span className="text-secondary small d-block">Toplam Tutar</span>
                      <span className="fw-bold fs-5 text-dark">{totalCustomizePrice} TL</span>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-orange px-4 py-2.5 rounded-pill fw-bold text-white shadow"
                      onClick={handleConfirmAddToBasket}
                    >
                      <i className="bi bi-cart-plus-fill me-1"></i> Sepete Ekle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

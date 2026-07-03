import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../../redux/features/productSlice';
import { fetchRestaurants } from '../../redux/features/restaurantSlice';
import { fetchCategories } from '../../redux/features/categorySlice';
import { toast } from 'react-toastify';
import QuestionBox from '../../components/QuestionBox/QuestionBox';

export default function AdminProducts() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const { restaurants } = useSelector((state) => state.restaurant);
  const { categories } = useSelector((state) => state.category);

  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchRestaurants());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteProduct(deleteId)).then(() => {
        toast.info('Ürün sistemden silindi.');
        setDeleteId(null);
      });
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Ürün Yönetimi (Tüm Sistem)</h2>
        <p className="text-secondary small">Sistemde ekli olan tüm restoran menü ürünlerini görüntüleyin ve silin</p>
      </div>

      {/* Search */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group shadow-sm border rounded-3 overflow-hidden">
            <span className="input-group-text bg-white border-0"><i className="bi bi-search"></i></span>
            <input 
              type="text" 
              className="form-control border-0 py-2" 
              placeholder="Ürün adı ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 bg-white px-3 pb-3">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <span className="fs-1">🍔</span>
            <p className="text-secondary mt-2 small">Gösterilecek ürün bulunamadı.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-hover mt-3">
              <thead className="table-light">
                <tr>
                  <th scope="col" style={{ width: '80px' }}>Resim</th>
                  <th scope="col">Ürün Adı</th>
                  <th scope="col">Restoran</th>
                  <th scope="col">Kategori</th>
                  <th scope="col">Fiyat</th>
                  <th scope="col" className="text-end">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => {
                  const restaurantName = restaurants.find(r => r.id === prod.restaurantId)?.name || 'Bilinmeyen Restoran';
                  const categoryName = categories.find(c => c.id === prod.categoryId)?.name || 'Kategori';
                  return (
                    <tr key={prod.id}>
                      <td className="fs-2">{prod.image || '🍔'}</td>
                      <td className="fw-semibold">{prod.name}</td>
                      <td className="text-dark fw-bold">{restaurantName}</td>
                      <td><span className="badge bg-light text-secondary border px-3 py-1.5 rounded-pill">{categoryName}</span></td>
                      <td className="fw-bold text-orange">{prod.price} TL</td>
                      <td className="text-end">
                        <button 
                          className="btn btn-sm btn-outline-danger rounded-3 border-0"
                          onClick={() => setDeleteId(prod.id)}
                          title="Ürünü Sil"
                        >
                          <i className="bi bi-trash3-fill"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom confirm replace alert */}
      <QuestionBox 
        isOpen={deleteId !== null}
        title="Ürünü Sil"
        message="Bu ürünü sistemden tamamen kaldırmak istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Sil"
        cancelText="İptal"
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByRestaurant, addProduct, updateProduct, deleteProduct } from '../../redux/features/productSlice';
import { fetchCategories } from '../../redux/features/categorySlice';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import QuestionBox from '../../components/QuestionBox/QuestionBox';

const schema = yup.object().shape({
  name: yup.string().min(3, 'Ürün adı en az 3 karakter olmalıdır.').required('Ürün adı zorunludur.'),
  price: yup.number().positive('Fiyat 0\'dan büyük olmalıdır.').typeError('Geçerli bir sayı girin.').required('Fiyat zorunludur.'),
  stock: yup.number().min(0, 'Stok negatif olamaz.').typeError('Geçerli bir sayı girin.').required('Stok zorunludur.'),
  categoryId: yup.string().required('Kategori seçmek zorunludur.'),
  description: yup.string().required('Açıklama zorunludur.'),
  image: yup.string().required('Ürün ikonu/emoji zorunludur.'),
  preparationTime: yup.number().positive().required('Süre zorunludur.')
});

export default function Products() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { restaurants } = useSelector((state) => state.restaurant);
  const { restaurantProducts, loading } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);

  const myRestaurants = restaurants.filter(r => String(r.ownerId) === String(user?.id));
  const savedId = localStorage.getItem('business_selected_restaurant_id');
  const restaurantId = myRestaurants.some(r => r.id === savedId) 
    ? savedId 
    : (myRestaurants[0]?.id || '');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editProduct, setEditProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchProductsByRestaurant(restaurantId));
    }
    dispatch(fetchCategories());
  }, [dispatch, restaurantId]);

  const handleOpenAddModal = () => {
    setEditProduct(null);
    reset({
      name: '',
      price: '',
      stock: '',
      categoryId: categories[0]?.id || '',
      description: '',
      image: '🍔',
      preparationTime: 15
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditProduct(product);
    reset({
      name: product.name,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      description: product.description,
      image: product.image,
      preparationTime: product.preparationTime
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      restaurantId,
      isActive: true
    };

    if (editProduct) {
      dispatch(updateProduct({ id: editProduct.id, productData: payload })).then(() => {
        toast.success('Ürün başarıyla güncellendi!');
        setIsModalOpen(false);
      });
    } else {
      dispatch(addProduct(payload)).then(() => {
        toast.success('Yeni ürün başarıyla eklendi!');
        setIsModalOpen(false);
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteProduct(deleteId)).then(() => {
        toast.info('Ürün sistemden silindi.');
        setDeleteId(null);
      });
    }
  };

  const filteredProducts = restaurantProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-fade-in">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Ürün Yönetimi</h2>
          <p className="text-secondary small mb-0">Menünüzdeki tüm lezzetleri düzenleyin veya yenilerini ekleyin</p>
        </div>
        <button 
          className="btn btn-primary px-4 py-2.5 rounded-3 fw-bold shadow-sm d-flex align-items-center gap-2"
          onClick={handleOpenAddModal}
        >
          <i className="bi bi-plus-lg"></i> Yeni Ürün Ekle
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="row g-3 mb-4 align-items-center">
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
        <div className="col-md-4">
          <select 
            className="form-select border shadow-sm py-2 rounded-3"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List Table */}
      <div className="card border-0 shadow-sm rounded-4 bg-white px-3 pb-3">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <span className="fs-1">🍔</span>
            <p className="text-secondary mt-2 small">Menünüzde gösterilecek ürün bulunamadı.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-hover mt-3">
              <thead className="table-light">
                <tr>
                  <th scope="col" style={{ width: '80px' }}>Resim</th>
                  <th scope="col">Ürün Adı</th>
                  <th scope="col">Kategori</th>
                  <th scope="col">Fiyat</th>
                  <th scope="col">Stok</th>
                  <th scope="col" className="text-end">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => {
                  const categoryName = categories.find(c => c.id === prod.categoryId)?.name || 'Kategori';
                  return (
                    <tr key={prod.id}>
                      <td className="fs-2">{prod.image || '🍔'}</td>
                      <td className="fw-semibold">{prod.name}</td>
                      <td><span className="badge bg-light text-secondary border px-3 py-1.5 rounded-pill">{categoryName}</span></td>
                      <td className="fw-bold text-orange">{prod.price} TL</td>
                      <td className={prod.stock === 0 ? 'text-danger fw-bold' : ''}>{prod.stock} adet</td>
                      <td className="text-end">
                        <button 
                          className="btn btn-sm btn-outline-primary rounded-3 me-2 border-0"
                          onClick={() => handleOpenEditModal(prod)}
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger rounded-3 border-0"
                          onClick={() => setDeleteId(prod.id)}
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

      {/* Modal Add / Edit UI */}
      {isModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-dark">{editProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Ürün Adı</label>
                      <input 
                        type="text" 
                        className={`form-control rounded-3 ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Örn: Klasik Hamburger" 
                        {...register('name')}
                      />
                      <div className="invalid-feedback">{errors.name?.message}</div>
                    </div>

                    <div className="col-6">
                      <label className="form-label small fw-semibold">Kategori</label>
                      <select 
                        className={`form-select rounded-3 ${errors.categoryId ? 'is-invalid' : ''}`}
                        {...register('categoryId')}
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <div className="invalid-feedback">{errors.categoryId?.message}</div>
                    </div>

                    <div className="col-6">
                      <label className="form-label small fw-semibold">Emoji Görseli</label>
                      <input 
                        type="text" 
                        className={`form-control rounded-3 ${errors.image ? 'is-invalid' : ''}`}
                        placeholder="Örn: 🍔, 🍕, 🍟" 
                        {...register('image')}
                      />
                      <div className="invalid-feedback">{errors.image?.message}</div>
                    </div>

                    <div className="col-6">
                      <label className="form-label small fw-semibold">Fiyat (TL)</label>
                      <input 
                        type="text" 
                        className={`form-control rounded-3 ${errors.price ? 'is-invalid' : ''}`}
                        placeholder="Örn: 180" 
                        {...register('price')}
                      />
                      <div className="invalid-feedback">{errors.price?.message}</div>
                    </div>

                    <div className="col-6">
                      <label className="form-label small fw-semibold">Stok Adedi</label>
                      <input 
                        type="text" 
                        className={`form-control rounded-3 ${errors.stock ? 'is-invalid' : ''}`}
                        placeholder="Örn: 50" 
                        {...register('stock')}
                      />
                      <div className="invalid-feedback">{errors.stock?.message}</div>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Hazırlanma Süresi (Dakika)</label>
                      <input 
                        type="number" 
                        className={`form-control rounded-3 ${errors.preparationTime ? 'is-invalid' : ''}`}
                        placeholder="Örn: 15" 
                        {...register('preparationTime')}
                      />
                      <div className="invalid-feedback">{errors.preparationTime?.message}</div>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Ürün Açıklaması</label>
                      <textarea 
                        rows="2" 
                        className={`form-control rounded-3 ${errors.description ? 'is-invalid' : ''}`}
                        placeholder="İçindekiler, gramaj vb." 
                        {...register('description')}
                      ></textarea>
                      <div className="invalid-feedback">{errors.description?.message}</div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setIsModalOpen(false)}>İptal</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4 text-white">Kaydet</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Custom dialog replacement for delete confirm */}
      <QuestionBox 
        isOpen={deleteId !== null}
        title="Ürünü Sil"
        message="Bu ürünü menünüzden tamamen kaldırmak istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Sil"
        cancelText="İptal"
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

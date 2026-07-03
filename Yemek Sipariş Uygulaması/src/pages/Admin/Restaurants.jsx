import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants, addRestaurant, updateRestaurant, deleteRestaurant } from '../../redux/features/restaurantSlice';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import QuestionBox from '../../components/QuestionBox/QuestionBox';

const schema = yup.object().shape({
  name: yup.string().min(3, 'Restoran adı en az 3 karakter olmalıdır.').required('Restoran adı zorunludur.'),
  rating: yup.number().min(1).max(5).typeError('1-5 arası bir sayı girin.').required('Puan zorunludur.'),
  deliveryTime: yup.number().positive().required('Süre zorunludur.'),
  minOrderPrice: yup.number().positive().required('Min. Tutar zorunludur.'),
  deliveryFee: yup.number().min(0).required('Kurye Ücreti zorunludur.'),
  logo: yup.string().required('İkon sınıfı zorunludur (örn: bi-shop).'),
  coverImage: yup.string().url('Geçerli bir URL girin.').required('Kapak görseli URL\'si zorunludur.'),
  address: yup.string().required('Adres zorunludur.'),
  phone: yup.string().required('Telefon zorunludur.')
});

export default function AdminRestaurants() {
  const dispatch = useDispatch();
  const { restaurants, loading } = useSelector((state) => state.restaurant);

  const [editRes, setEditRes] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const handleOpenAddModal = () => {
    setEditRes(null);
    reset({
      name: '',
      rating: 4.5,
      deliveryTime: 30,
      minOrderPrice: 150,
      deliveryFee: 20,
      logo: 'bi-shop',
      coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
      address: '',
      phone: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (restaurant) => {
    setEditRes(restaurant);
    reset({
      name: restaurant.name,
      rating: restaurant.rating,
      deliveryTime: restaurant.deliveryTime,
      minOrderPrice: restaurant.minOrderPrice,
      deliveryFee: restaurant.deliveryFee,
      logo: restaurant.logo,
      coverImage: restaurant.coverImage,
      address: restaurant.address,
      phone: restaurant.phone
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data) => {
    if (editRes) {
      dispatch(updateRestaurant({ id: editRes.id, restaurantData: data })).then(() => {
        toast.success('Restoran güncellendi.');
        setIsModalOpen(false);
      });
    } else {
      dispatch(addRestaurant(data)).then(() => {
        toast.success('Yeni restoran sisteme eklendi.');
        setIsModalOpen(false);
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteRestaurant(deleteId)).then(() => {
        toast.info('Restoran sistemden kaldırıldı.');
        setDeleteId(null);
      });
    }
  };

  return (
    <div className="page-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Restoran Yönetimi</h2>
          <p className="text-secondary small">Sistemdeki tüm kayıtlı restoranları yönetin ve düzenleyin</p>
        </div>
        <button className="btn btn-primary px-4 py-2.5 rounded-3 fw-bold shadow-sm" onClick={handleOpenAddModal}>
          Yeni Restoran Ekle
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 bg-white px-3 pb-3">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-hover mt-3">
              <thead className="table-light">
                <tr>
                  <th scope="col" style={{ width: '80px' }}>Logo</th>
                  <th scope="col">Restoran Adı</th>
                  <th scope="col">Puan</th>
                  <th scope="col">Min. Sipariş</th>
                  <th scope="col">Teslim Süresi</th>
                  <th scope="col" className="text-end">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((res) => (
                  <tr key={res.id}>
                    <td>
                      {res.logo && res.logo.startsWith('bi-') ? (
                        <i className={`bi ${res.logo} text-orange fs-4`}></i>
                      ) : (
                        <i className="bi bi-shop text-orange fs-4"></i>
                      )}
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{res.name}</div>
                      <span className="text-muted small text-xs">{res.address}</span>
                    </td>
                    <td className="fw-bold text-warning">★ {res.rating}</td>
                    <td className="fw-semibold">{res.minOrderPrice} TL</td>
                    <td>{res.deliveryTime} dk</td>
                    <td className="text-end">
                      <button 
                        className="btn btn-sm btn-outline-primary rounded-3 me-2 border-0"
                        onClick={() => handleOpenEditModal(res)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger rounded-3 border-0"
                        onClick={() => setDeleteId(res.id)}
                      >
                        <i className="bi bi-trash3-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add / Edit UI */}
      {isModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">{editRes ? 'Restoranı Düzenle' : 'Yeni Restoran Ekle'}</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Restoran Adı</label>
                      <input 
                        type="text" 
                        className={`form-control rounded-3 ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Örn: Burger House" 
                        {...register('name')}
                      />
                      <div className="invalid-feedback">{errors.name?.message}</div>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">İkon Sınıfı (Bootstrap)</label>
                      <input 
                        type="text" 
                        className={`form-control rounded-3 ${errors.logo ? 'is-invalid' : ''}`}
                        placeholder="Örn: bi-shop" 
                        {...register('logo')}
                      />
                      <div className="invalid-feedback">{errors.logo?.message}</div>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Puan</label>
                      <input 
                        type="text" 
                        className={`form-control rounded-3 ${errors.rating ? 'is-invalid' : ''}`}
                        placeholder="4.5" 
                        {...register('rating')}
                      />
                      <div className="invalid-feedback">{errors.rating?.message}</div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Minimum Sipariş (TL)</label>
                      <input 
                        type="number" 
                        className={`form-control rounded-3 ${errors.minOrderPrice ? 'is-invalid' : ''}`}
                        placeholder="150" 
                        {...register('minOrderPrice')}
                      />
                      <div className="invalid-feedback">{errors.minOrderPrice?.message}</div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Teslim Süresi (Dakika)</label>
                      <input 
                        type="number" 
                        className={`form-control rounded-3 ${errors.deliveryTime ? 'is-invalid' : ''}`}
                        placeholder="30" 
                        {...register('deliveryTime')}
                      />
                      <div className="invalid-feedback">{errors.deliveryTime?.message}</div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Kurye Ücreti (TL)</label>
                      <input 
                        type="number" 
                        className={`form-control rounded-3 ${errors.deliveryFee ? 'is-invalid' : ''}`}
                        placeholder="20" 
                        {...register('deliveryFee')}
                      />
                      <div className="invalid-feedback">{errors.deliveryFee?.message}</div>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Kapak Görseli URL'si</label>
                      <input 
                        type="text" 
                        className={`form-control rounded-3 ${errors.coverImage ? 'is-invalid' : ''}`}
                        placeholder="https://images.unsplash.com/..." 
                        {...register('coverImage')}
                      />
                      <div className="invalid-feedback">{errors.coverImage?.message}</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Telefon</label>
                      <input 
                        type="text" 
                        className={`form-control rounded-3 ${errors.phone ? 'is-invalid' : ''}`}
                        placeholder="02122223344" 
                        {...register('phone')}
                      />
                      <div className="invalid-feedback">{errors.phone?.message}</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Adres</label>
                      <input 
                        type="text" 
                        className={`form-control rounded-3 ${errors.address ? 'is-invalid' : ''}`}
                        placeholder="Şehir, İlçe, Mahalle..." 
                        {...register('address')}
                      />
                      <div className="invalid-feedback">{errors.address?.message}</div>
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

      {/* Custom confirm replace alert */}
      <QuestionBox 
        isOpen={deleteId !== null}
        title="Restoranı Sil"
        message="Bu restoranı sistemden tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Sil"
        cancelText="İptal"
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

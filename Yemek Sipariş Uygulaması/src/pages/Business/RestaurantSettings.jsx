import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantDetail, updateRestaurant } from '../../redux/features/restaurantSlice';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  name: yup.string().min(3, 'Restoran adı en az 3 karakter olmalıdır.').required('Restoran adı zorunludur.'),
  minOrderPrice: yup.number().positive('Minimum sipariş tutarı 0\'dan büyük olmalıdır.').typeError('Geçerli bir sayı girin.').required('Minimum sipariş tutarı zorunludur.'),
  deliveryTime: yup.number().positive('Teslimat süresi 0\'dan büyük olmalıdır.').typeError('Geçerli bir sayı girin.').required('Teslimat süresi zorunludur.'),
  deliveryFee: yup.number().min(0, 'Kurye ücreti negatif olamaz.').typeError('Geçerli bir sayı girin.').required('Kurye ücreti zorunludur.'),
  logo: yup.string().required('İkon sınıfı zorunludur (örn: bi-shop).'),
  coverImage: yup.string().url('Geçerli bir kapak resmi URL\'si girin.').required('Kapak resmi zorunludur.'),
  address: yup.string().required('Adres zorunludur.'),
  phone: yup.string().required('Telefon zorunludur.'),
});

export default function RestaurantSettings() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentRestaurant, loading } = useSelector((state) => state.restaurant);

  const { restaurants } = useSelector((state) => state.restaurant);
  const myRestaurants = restaurants.filter(r => String(r.ownerId) === String(user?.id));
  const savedId = localStorage.getItem('business_selected_restaurant_id');
  const restaurantId = myRestaurants.some(r => r.id === savedId) 
    ? savedId 
    : (myRestaurants[0]?.id || '');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchRestaurantDetail(restaurantId));
    }
  }, [dispatch, restaurantId]);

  useEffect(() => {
    if (currentRestaurant) {
      reset({
        name: currentRestaurant.name,
        minOrderPrice: currentRestaurant.minOrderPrice,
        deliveryTime: currentRestaurant.deliveryTime,
        deliveryFee: currentRestaurant.deliveryFee,
        logo: currentRestaurant.logo,
        coverImage: currentRestaurant.coverImage,
        address: currentRestaurant.address,
        phone: currentRestaurant.phone,
      });
    }
  }, [currentRestaurant, reset]);

  const onSubmit = (data) => {
    dispatch(updateRestaurant({ id: restaurantId, restaurantData: data })).then((res) => {
      if (updateRestaurant.fulfilled.match(res)) {
        toast.success('Restoran bilgileri başarıyla güncellendi!');
      } else {
        toast.error('Güncelleme sırasında bir sorun oluştu.');
      }
    });
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white page-fade-in">
      <div className="mb-4">
        <h4 className="fw-bold mb-1"><i className="bi bi-shop text-primary me-2"></i>Restoran Ayarları</h4>
        <p className="text-secondary small mb-0">Müşterilerinize gösterilecek restoran detaylarını düzenleyin</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label small fw-semibold">Restoran Adı</label>
              <input 
                type="text" 
                className={`form-control rounded-3 ${errors.name ? 'is-invalid' : ''}`}
                {...register('name')}
              />
              <div className="invalid-feedback">{errors.name?.message}</div>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold">İkon Sınıfı (Bootstrap)</label>
              <input 
                type="text" 
                className={`form-control rounded-3 ${errors.logo ? 'is-invalid' : ''}`}
                placeholder="Örn: bi-shop"
                {...register('logo')}
              />
              <div className="invalid-feedback">{errors.logo?.message}</div>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold">Minimum Sipariş Tutarı (TL)</label>
              <input 
                type="number" 
                className={`form-control rounded-3 ${errors.minOrderPrice ? 'is-invalid' : ''}`}
                {...register('minOrderPrice')}
              />
              <div className="invalid-feedback">{errors.minOrderPrice?.message}</div>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold">Ortalama Teslim Süresi (Dakika)</label>
              <input 
                type="number" 
                className={`form-control rounded-3 ${errors.deliveryTime ? 'is-invalid' : ''}`}
                {...register('deliveryTime')}
              />
              <div className="invalid-feedback">{errors.deliveryTime?.message}</div>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold">Kurye/Teslimat Ücreti (TL)</label>
              <input 
                type="number" 
                className={`form-control rounded-3 ${errors.deliveryFee ? 'is-invalid' : ''}`}
                {...register('deliveryFee')}
              />
              <div className="invalid-feedback">{errors.deliveryFee?.message}</div>
            </div>

            <div className="col-12">
              <label className="form-label small fw-semibold">Kapak Resmi URL'si</label>
              <input 
                type="text" 
                className={`form-control rounded-3 ${errors.coverImage ? 'is-invalid' : ''}`}
                {...register('coverImage')}
              />
              <div className="invalid-feedback">{errors.coverImage?.message}</div>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold">İletişim Telefonu</label>
              <input 
                type="text" 
                className={`form-control rounded-3 ${errors.phone ? 'is-invalid' : ''}`}
                {...register('phone')}
              />
              <div className="invalid-feedback">{errors.phone?.message}</div>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold">Açık Adres</label>
              <input 
                type="text" 
                className={`form-control rounded-3 ${errors.address ? 'is-invalid' : ''}`}
                {...register('address')}
              />
              <div className="invalid-feedback">{errors.address?.message}</div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary px-5 py-2.5 rounded-3 fw-bold text-white mt-4 shadow-sm">
            Bilgileri Kaydet
          </button>
        </form>
      )}
    </div>
  );
}

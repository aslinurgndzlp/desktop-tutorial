import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRestaurant } from '../../redux/features/restaurantSlice';
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

export default function RestaurantSetup({ onComplete }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      logo: 'bi-shop',
      coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    }
  });

  const onSubmit = (data) => {
    const restaurantData = {
      ...data,
      ownerId: String(user.id),
      rating: 5.0,
      email: user.email,
    };
    dispatch(addRestaurant(restaurantData)).then((res) => {
      if (addRestaurant.fulfilled.match(res)) {
        toast.success('Restoranınız başarıyla kuruldu!');
        if (onComplete) {
          onComplete(res.payload.id);
        }
      } else {
        toast.error('Restoran kurulumu sırasında bir sorun oluştu.');
      }
    });
  };

  return (
    <div className="container py-5 page-fade-in">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="text-center mb-4">
              <div className="bg-primary-subtle text-primary p-4 rounded-circle d-inline-block mb-3" style={{ backgroundColor: '#e6f0ff' }}>
                <i className="bi bi-shop fs-1"></i>
              </div>
              <h3 className="fw-bold mb-2">Restoranınızı Kurun</h3>
              <p className="text-secondary small">
                Hoş geldiniz! Portalı kullanabilmek için öncelikle restoran bilgilerinizi kaydetmelisiniz.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                <div className="col-md-8">
                  <label className="form-label small fw-semibold">Restoran Adı</label>
                  <input 
                    type="text" 
                    className={`form-control rounded-3 ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Örn: Kebap Vadisi"
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
                  <label className="form-label small fw-semibold">Teslimat Süresi (Dakika)</label>
                  <input 
                    type="number" 
                    className={`form-control rounded-3 ${errors.deliveryTime ? 'is-invalid' : ''}`}
                    placeholder="30"
                    {...register('deliveryTime')}
                  />
                  <div className="invalid-feedback">{errors.deliveryTime?.message}</div>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Teslimat Ücreti (TL)</label>
                  <input 
                    type="number" 
                    className={`form-control rounded-3 ${errors.deliveryFee ? 'is-invalid' : ''}`}
                    placeholder="25"
                    {...register('deliveryFee')}
                  />
                  <div className="invalid-feedback">{errors.deliveryFee?.message}</div>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Kapak Resmi URL</label>
                  <input 
                    type="text" 
                    className={`form-control rounded-3 ${errors.coverImage ? 'is-invalid' : ''}`}
                    {...register('coverImage')}
                  />
                  <div className="invalid-feedback">{errors.coverImage?.message}</div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Telefon</label>
                  <input 
                    type="text" 
                    className={`form-control rounded-3 ${errors.phone ? 'is-invalid' : ''}`}
                    placeholder="0212 333 4455"
                    {...register('phone')}
                  />
                  <div className="invalid-feedback">{errors.phone?.message}</div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Adres</label>
                  <input 
                    type="text" 
                    className={`form-control rounded-3 ${errors.address ? 'is-invalid' : ''}`}
                    placeholder="Mahalle, Sokak, İlçe, İl"
                    {...register('address')}
                  />
                  <div className="invalid-feedback">{errors.address?.message}</div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 rounded-3 fw-bold text-white mt-4 shadow-sm">
                Restoranı Kaydet ve Portalı Aç
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

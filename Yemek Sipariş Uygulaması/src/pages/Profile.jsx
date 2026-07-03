import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../redux/features/authSlice';
import { fetchNotifications, markAsRead } from '../redux/features/notificationSlice';
import { toast } from 'react-toastify';
import MessageBox from '../components/MessageBox/MessageBox';

const schema = yup.object().shape({
  name: yup.string().min(2, 'Ad en az 2 karakter olmalıdır.').required('Ad zorunludur.'),
  surname: yup.string().min(2, 'Soyad en az 2 karakter olmalıdır.').required('Soyad zorunludur.'),
  email: yup.string().email('Geçerli bir e-posta girin.').required('E-posta zorunludur.'),
  phone: yup.string().matches(/^[0-9]{11}$/, 'Telefon numarası 11 haneli olmalıdır.').required('Telefon zorunludur.'),
  address: yup.string().min(10, 'Lütfen açık bir adres girin.').required('Adres zorunludur.'),
});

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notification);

  const [activeTab, setActiveTab] = useState('profile');

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        address: user.address,
      });
      dispatch(fetchNotifications(user.id));
    }
  }, [user, reset, dispatch]);

  const onSubmit = (data) => {
    dispatch(updateProfile({ id: user.id, updatedData: data })).then((res) => {
      if (updateProfile.fulfilled.match(res)) {
        toast.success('Profil bilgileriniz başarıyla güncellendi!');
      } else {
        toast.error('Güncelleme sırasında bir sorun oluştu.');
      }
    });
  };

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id)).then(() => {
      toast.info('Bildirim okundu olarak işaretlendi.');
    });
  };

  return (
    <div className="container py-5 page-fade-in">
      <div className="row g-4">
        {/* Navigation Sidebar */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="text-center pb-3 border-bottom mb-3">
              <div className="bg-orange text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                <i className="bi bi-person-fill"></i>
              </div>
              <h5 className="fw-bold mb-0 text-dark">{user?.name} {user?.surname}</h5>
              <span className="text-secondary small">{user?.email}</span>
            </div>
            <div className="nav flex-column nav-pills gap-1">
              <button 
                className={`nav-link text-start rounded-3 fw-semibold py-2.5 px-3 border-0 ${activeTab === 'profile' ? 'bg-orange text-white active shadow-sm' : 'bg-transparent text-secondary'}`}
                onClick={() => setActiveTab('profile')}
              >
                <i className="bi bi-person-lines-fill me-2"></i> Profil Bilgileri
              </button>
              <button 
                className={`nav-link text-start rounded-3 fw-semibold py-2.5 px-3 border-0 ${activeTab === 'notifications' ? 'bg-orange text-white active shadow-sm' : 'bg-transparent text-secondary'}`}
                onClick={() => setActiveTab('notifications')}
              >
                <i className="bi bi-bell-fill me-2"></i> Bildirimlerim{' '}
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="badge rounded-pill bg-danger ms-2">{notifications.filter(n => !n.read).length}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="col-lg-9">
          {activeTab === 'profile' ? (
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold mb-4">Profil Ayarları</h5>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-semibold">Adınız</label>
                    <input 
                      type="text" 
                      className={`form-control rounded-3 py-2 ${errors.name ? 'is-invalid' : ''}`}
                      {...register('name')}
                    />
                    <div className="invalid-feedback">{errors.name?.message}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-semibold">Soyadınız</label>
                    <input 
                      type="text" 
                      className={`form-control rounded-3 py-2 ${errors.surname ? 'is-invalid' : ''}`}
                      {...register('surname')}
                    />
                    <div className="invalid-feedback">{errors.surname?.message}</div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-semibold">E-posta</label>
                    <input 
                      type="email" 
                      className={`form-control rounded-3 py-2 ${errors.email ? 'is-invalid' : ''}`}
                      {...register('email')}
                    />
                    <div className="invalid-feedback">{errors.email?.message}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-semibold">Telefon</label>
                    <input 
                      type="text" 
                      className={`form-control rounded-3 py-2 ${errors.phone ? 'is-invalid' : ''}`}
                      {...register('phone')}
                    />
                    <div className="invalid-feedback">{errors.phone?.message}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">Adres</label>
                  <textarea 
                    rows="3" 
                    className={`form-control rounded-3 py-2 ${errors.address ? 'is-invalid' : ''}`}
                    {...register('address')}
                  ></textarea>
                  <div className="invalid-feedback">{errors.address?.message}</div>
                </div>

                <button type="submit" className="btn btn-orange px-5 py-2.5 rounded-3 fw-bold shadow-sm">
                  Bilgileri Kaydet
                </button>
              </form>
            </div>
          ) : (
            /* Notifications Tab */
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold mb-4">Bildirimler</h5>
              
              {notifications.length === 0 ? (
                <div className="text-center py-5">
                  <span className="fs-1">🔔</span>
                  <p className="text-secondary small mt-2">Herhangi bir bildiriminiz bulunmuyor.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`card border-0 p-3 rounded-4 shadow-sm ${notif.read ? 'bg-light' : 'border-start border-orange border-4 bg-white'}`}
                      style={{ borderLeft: !notif.read ? '4px solid #fd7e14' : '' }}
                    >
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                          <h6 className={`fw-bold mb-1 ${notif.read ? 'text-secondary' : 'text-dark'}`}>{notif.title}</h6>
                          <p className="text-secondary small mb-0">{notif.message}</p>
                          <span className="text-muted text-xs d-block mt-1" style={{ fontSize: '0.75rem' }}>
                            {new Date(notif.createdAt).toLocaleString('tr-TR')}
                          </span>
                        </div>
                        {!notif.read && (
                          <button 
                            className="btn btn-orange btn-sm rounded-pill px-3 py-1 text-xs"
                            onClick={() => handleMarkAsRead(notif.id)}
                            style={{ fontSize: '0.75rem' }}
                          >
                            Okundu İşaretle
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { registerUser, clearError } from '../redux/features/authSlice';
import { toast } from 'react-toastify';
import MessageBox from '../components/MessageBox/MessageBox';

const schema = yup.object().shape({
  name: yup.string().min(2, 'Ad en az 2 karakter olmalıdır.').required('Ad zorunludur.'),
  surname: yup.string().min(2, 'Soyad en az 2 karakter olmalıdır.').required('Soyad zorunludur.'),
  email: yup.string().email('Geçerli bir e-posta girin.').required('E-posta zorunludur.'),
  phone: yup.string().matches(/^[0-9]{11}$/, 'Telefon numarası 11 haneli olmalıdır.').required('Telefon zorunludur.'),
  address: yup.string().min(10, 'Lütfen açık bir adres girin.').required('Adres zorunludur.'),
  password: yup.string().min(6, 'Şifre en az 6 karakter olmalıdır.').required('Şifre zorunludur.'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Şifreler uyuşmuyor.').required('Şifre tekrarı zorunludur.'),
  role: yup.string().oneOf(['user', 'business', 'admin']).required('Hesap türü seçiniz.')
});

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, error } = useSelector((state) => state.auth);

  // Read role query param if register?role=business
  const defaultRole = searchParams.get('role') === 'business' ? 'business' : 'user';

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: defaultRole
    }
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    // Exclude confirmPassword from database save
    const { confirmPassword, ...submitData } = data;
    const resultAction = await dispatch(registerUser(submitData));
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success('Kayıt işleminiz başarıyla tamamlandı. Giriş yapabilirsiniz!');
      navigate('/login');
    }
  };

  return (
    <div className="container py-5 page-fade-in">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-9">
          <div className="card border-0 shadow-lg p-3" style={{ borderRadius: '20px' }}>
            <div className="card-body">
              <div className="text-center mb-4">
                <span className="fs-1">🍕</span>
                <h3 className="fw-bold mt-2 text-orange">Kayıt Ol</h3>
                <p className="text-secondary small">FoodHub dünyasına katılarak hemen sipariş verin veya restoranınızı yönetin</p>
              </div>

              {error && (
                <MessageBox 
                  type="danger" 
                  message={error} 
                  inline={true} 
                  onClose={() => dispatch(clearError())} 
                />
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-semibold">Adınız</label>
                    <input
                      type="text"
                      className={`form-control rounded-3 py-2 ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Ahmet"
                      {...register('name')}
                    />
                    <div className="invalid-feedback">{errors.name?.message}</div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-semibold">Soyadınız</label>
                    <input
                      type="text"
                      className={`form-control rounded-3 py-2 ${errors.surname ? 'is-invalid' : ''}`}
                      placeholder="Yılmaz"
                      {...register('surname')}
                    />
                    <div className="invalid-feedback">{errors.surname?.message}</div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-semibold">E-posta Adresi</label>
                    <input
                      type="email"
                      className={`form-control rounded-3 py-2 ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="ornek@eposta.com"
                      {...register('email')}
                    />
                    <div className="invalid-feedback">{errors.email?.message}</div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-semibold">Telefon Numarası</label>
                    <input
                      type="text"
                      className={`form-control rounded-3 py-2 ${errors.phone ? 'is-invalid' : ''}`}
                      placeholder="05551234567"
                      {...register('phone')}
                    />
                    <div className="invalid-feedback">{errors.phone?.message}</div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Açık Adres</label>
                  <textarea
                    rows="2"
                    className={`form-control rounded-3 py-2 ${errors.address ? 'is-invalid' : ''}`}
                    placeholder="Mahalle, sokak, no, daire..."
                    {...register('address')}
                  ></textarea>
                  <div className="invalid-feedback">{errors.address?.message}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Hesap Türü</label>
                  <select 
                    className={`form-select rounded-3 py-2 ${errors.role ? 'is-invalid' : ''}`}
                    {...register('role')}
                  >
                    <option value="user">Müşteri (Yemek Siparişi Vermek İstiyorum)</option>
                    <option value="business">İşletme Sahibi (Restoranımı Yönetmek İstiyorum)</option>
                    <option value="admin">Yönetici (Admin Paneli Yetkisi)</option>
                  </select>
                  <div className="invalid-feedback">{errors.role?.message}</div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-semibold">Şifre</label>
                    <input
                      type="password"
                      className={`form-control rounded-3 py-2 ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="••••••"
                      {...register('password')}
                    />
                    <div className="invalid-feedback">{errors.password?.message}</div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-semibold">Şifre Tekrarı</label>
                    <input
                      type="password"
                      className={`form-control rounded-3 py-2 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      placeholder="••••••"
                      {...register('confirmPassword')}
                    />
                    <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-orange w-100 py-2.5 rounded-3 fw-bold shadow-sm mt-3"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : 'Kayıt İşlemini Tamamla'}
                </button>
              </form>

              <hr className="my-4 text-muted" />

              <div className="text-center small text-secondary">
                Zaten hesabınız var mı?{' '}
                <Link to="/login" className="text-orange text-decoration-none fw-bold">Giriş Yap</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFavorites } from '../../context/FavoriteContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

const FavoriteButton = ({ movie, className = '', showText = false }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const favorited = isFavorite(movie?.id);

  const handleClick = (e) => {
    e.preventDefault(); // Prevent navigating if wrapped in a Link
    e.stopPropagation();

    // Check if user is logged in
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (favorited) {
      // Show confirmation dialog before removing
      setShowConfirm(true);
    } else {
      // Add immediately
      const added = addToFavorites(movie);
      if (added) {
        showToast(`"${movie.title}" favorilere eklendi!`, 'success');
      }
    }
  };

  const handleConfirmRemove = () => {
    removeFromFavorites(movie.id);
    setShowConfirm(false);
    showToast(`"${movie.title}" favorilerden kaldırıldı.`, 'info');
  };

  const handleGoToLogin = () => {
    setShowLoginModal(false);
    navigate('/login', { state: { from: location } });
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`btn d-inline-flex align-items-center justify-content-center gap-2 rounded-circle ${
          favorited 
            ? 'btn-danger text-white' 
            : 'btn-outline-light'
        } ${className}`}
        style={{
          width: showText ? 'auto' : '40px',
          height: '40px',
          padding: showText ? '0 16px' : '0',
          borderRadius: showText ? '20px !important' : '50%',
          transition: 'all 0.2s ease',
          border: favorited ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
          backgroundColor: favorited ? 'var(--danger-color)' : 'rgba(15, 23, 42, 0.6)'
        }}
        title={favorited ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
      >
        <i className={`bi ${favorited ? 'bi-heart-fill' : 'bi-heart'} fs-5`}></i>
        {showText && <span className="fw-medium">{favorited ? 'Favorilerimde' : 'Favorilere Ekle'}</span>}
      </button>

      {/* Confirmation Modal */}
      <ConfirmModal
        show={showConfirm}
        title="Favori Kaldırma Onayı"
        message={`"${movie?.title}" filmini favorilerinizden kaldırmak istediğinize emin misiniz?`}
        confirmText="Kaldır"
        cancelText="İptal"
        type="danger"
        onConfirm={handleConfirmRemove}
        onCancel={() => setShowConfirm(false)}
      />

      {/* Login Required Modal */}
      <ConfirmModal
        show={showLoginModal}
        title="Üye Girişi Gerekli"
        message="Filmleri favorilerinize eklemek için giriş yapmanız gerekmektedir. Şimdi giriş yapmak ister misiniz?"
        confirmText="Giriş Yap"
        cancelText="Kapat"
        type="warning"
        onConfirm={handleGoToLogin}
        onCancel={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default FavoriteButton;

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRatings } from '../../context/RatingContext';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

const StarRating = ({ movie, size = 'fs-5' }) => {
  const { isLoggedIn } = useAuth();
  const { getMovieRating, rateMovie } = useRatings();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [hoverRating, setHoverRating] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const currentRating = getMovieRating(movie?.id);

  const handleStarClick = (score, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    rateMovie(movie.id, score);
    showToast(`"${movie.title}" için puanınız kaydedildi: ${score} Yıldız`, 'success');
  };

  const handleGoToLogin = () => {
    setShowLoginModal(false);
    navigate('/login', { state: { from: location } });
  };

  return (
    <>
      <div className="d-inline-flex align-items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = hoverRating >= star || (!hoverRating && currentRating >= star);
          return (
            <i
              key={star}
              className={`bi ${isFilled ? 'bi-star-fill text-warning' : 'bi-star'} ${size}`}
              style={{ 
                cursor: 'pointer', 
                transition: 'transform 0.15s ease, color 0.15s ease',
              }}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={(e) => handleStarClick(star, e)}
              title={`${star} Yıldız Puanı Ver`}
            />
          );
        })}
        {currentRating > 0 && (
          <span className="ms-2 small text-muted-custom fw-semibold">
            ({currentRating}/5)
          </span>
        )}
      </div>

      {/* Login Required Modal */}
      <ConfirmModal
        show={showLoginModal}
        title="Üye Girişi Gerekli"
        message="Filmleri puanlamak için giriş yapmanız gerekmektedir. Şimdi giriş yapmak ister misiniz?"
        confirmText="Giriş Yap"
        cancelText="Kapat"
        type="warning"
        onConfirm={handleGoToLogin}
        onCancel={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default StarRating;

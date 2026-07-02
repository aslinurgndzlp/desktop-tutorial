import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComments } from '../../context/CommentContext';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

const CommentSection = ({ movieId, movieTitle }) => {
  const { isLoggedIn, user } = useAuth();
  const { getMovieComments, addMovieComment, deleteMovieComment } = useComments();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [commentText, setCommentText] = useState('');
  const [commentToDelete, setCommentToDelete] = useState(null); // stores comment object to delete
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const movieComments = getMovieComments(movieId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      showToast('Yorum içeriği boş olamaz.', 'warning');
      return;
    }

    const success = addMovieComment(movieId, user.name, user.email, commentText);
    if (success) {
      setCommentText('');
      showToast('Yorumunuz başarıyla eklendi!', 'success');
    }
  };

  const handleOpenDeleteConfirm = (comment, e) => {
    e.preventDefault();
    setCommentToDelete(comment);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (commentToDelete) {
      deleteMovieComment(movieId, commentToDelete.id);
      setShowDeleteConfirm(false);
      setCommentToDelete(null);
      showToast('Yorumunuz başarıyla silindi.', 'info');
    }
  };

  const handleGoToLogin = () => {
    navigate('/login', { state: { from: location } });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Bilinmeyen tarih';
    }
  };

  return (
    <div className="bg-card-custom rounded-4 p-4 p-md-5 text-start border my-5" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
      {/* Header */}
      <h3 className="fs-4 fw-bold text-white mb-4 d-flex align-items-center justify-content-between">
        <span>
          <i className="bi bi-chat-left-text-fill text-primary-custom me-2"></i>
          Yorumlar
        </span>
        <span className="badge bg-secondary rounded-pill small" style={{ fontSize: '0.85rem' }}>
          {movieComments.length} Yorum
        </span>
      </h3>

      {/* Comment Form Section */}
      <div className="mb-5">
        {isLoggedIn ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="commentText" className="form-label small text-muted-custom fw-semibold mb-2">
                Yorumunuzu Yazın
              </label>
              <textarea
                id="commentText"
                className="form-control border-0 text-white p-3"
                rows="3"
                style={{ 
                  backgroundColor: 'var(--surface-color)', 
                  resize: 'none', 
                  borderRadius: '12px',
                  boxShadow: 'none'
                }}
                placeholder={`${movieTitle || 'Film'} hakkında düşünceleriniz neler? Bir yorum bırakın...`}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary-custom px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
              style={{ borderRadius: '8px' }}
            >
              <i className="bi bi-send-fill"></i>
              Gönder
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-3 text-center border d-flex flex-column align-items-center gap-3" style={{ borderColor: 'rgba(255, 255, 255, 0.05)', backgroundColor: 'rgba(99, 102, 241, 0.03)' }}>
            <p className="text-muted-custom small mb-0">Yorum yazabilmek ve fikrinizi paylaşabilmek için üye girişi yapmalısınız.</p>
            <button 
              onClick={handleGoToLogin} 
              className="btn btn-primary-custom btn-sm px-4 py-2"
              style={{ borderRadius: '8px' }}
            >
              <i className="bi bi-box-arrow-in-right me-1"></i>
              Giriş Yap
            </button>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="d-flex flex-column gap-3">
        {movieComments.length > 0 ? (
          movieComments.map((comment) => (
            <div 
              key={comment.id} 
              className="p-3 rounded-3 d-flex gap-3 text-start"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.03)' }}
            >
              {/* User Avatar Circle */}
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold text-white shadow-sm"
                style={{ 
                  width: '45px', 
                  height: '45px', 
                  backgroundColor: 'var(--primary-color)',
                  fontSize: '0.9rem' 
                }}
              >
                {getInitials(comment.username)}
              </div>

              {/* Comment Content */}
              <div className="flex-grow-1">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <h6 className="text-white fw-bold mb-0 small">{comment.username}</h6>
                  <span className="text-muted-custom small" style={{ fontSize: '0.75rem' }}>
                    {formatDate(comment.timestamp)}
                  </span>
                </div>
                <p className="text-muted-custom mb-0 small leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                  {comment.content}
                </p>
                
                {/* Delete button for user's own comments */}
                {isLoggedIn && user.email === comment.email && (
                  <button 
                    onClick={(e) => handleOpenDeleteConfirm(comment, e)}
                    className="btn btn-link text-danger p-0 mt-2 text-decoration-none small d-inline-flex align-items-center gap-1 border-0"
                    style={{ fontSize: '0.75rem' }}
                  >
                    <i className="bi bi-trash-fill"></i>
                    Yorumu Sil
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-custom small">
            Henüz yorum yapılmamış. İlk yorum yazan siz olun!
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showDeleteConfirm}
        title="Yorum Silme Onayı"
        message="Bu yorumunuzu kalıcı olarak silmek istediğinize emin misiniz?"
        confirmText="Sil"
        cancelText="İptal"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setCommentToDelete(null);
        }}
      />
    </div>
  );
};

export default CommentSection;

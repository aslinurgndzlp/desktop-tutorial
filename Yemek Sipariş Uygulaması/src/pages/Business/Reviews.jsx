import React, { useState } from 'react';
import { toast } from 'react-toastify';
import QuestionBox from '../../components/QuestionBox/QuestionBox';

export default function BusinessReviews() {
  const [reviews, setReviews] = useState([
    { id: 1, customer: 'Ali Yılmaz', rating: 5, date: '01.07.2026', comment: 'Harika bir cheeseburger! Ellerinize sağlık, çok sıcak geldi.', reply: 'Afiyet olsun, her zaman bekleriz!' },
    { id: 2, customer: 'Zeynep Kaya', rating: 4, date: '28.06.2026', comment: 'Patates kızartması biraz soğuktu ama burger efsane.', reply: '' },
    { id: 3, customer: 'Ahmet Demir', rating: 2, date: '20.06.2026', comment: 'Sipariş 1 saatte geldi, kola ılık kalmıştı.', reply: '' }
  ]);

  const [deleteId, setDeleteId] = useState(null);
  const [replyId, setReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleDeleteConfirm = () => {
    if (deleteId) {
      setReviews(reviews.filter(r => r.id !== deleteId));
      toast.info('Yorum kaldırıldı.');
      setDeleteId(null);
    }
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyText.trim() === '') return;

    setReviews(reviews.map(r => {
      if (r.id === replyId) {
        return { ...r, reply: replyText };
      }
      return r;
    }));

    toast.success('Cevabınız iletildi!');
    setReplyId(null);
    setReplyText('');
  };

  const handleOpenReplyModal = (review) => {
    setReplyId(review.id);
    setReplyText(review.reply || '');
  };

  return (
    <div className="page-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Müşteri Yorumları</h2>
        <p className="text-secondary small">Müşterilerinizin restoranınız ve yemekleriniz hakkındaki değerlendirmeleri</p>
      </div>

      <div className="d-flex flex-column gap-3">
        {reviews.map((rev) => (
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white" key={rev.id}>
            <div className="d-flex justify-content-between align-items-start gap-3 border-bottom pb-3 mb-3">
              <div>
                <h6 className="fw-bold text-dark mb-1">{rev.customer}</h6>
                <span className="text-muted small">{rev.date}</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <span className="badge bg-warning text-dark px-3 py-1.5 rounded-pill fs-6 fw-bold">
                  ★ {rev.rating} / 5
                </span>
                <button 
                  className="btn btn-sm btn-outline-danger border-0 rounded-circle"
                  onClick={() => setDeleteId(rev.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>

            <p className="text-secondary small mb-3 italic">"{rev.comment}"</p>

            {rev.reply ? (
              <div className="bg-light p-3 rounded-3 border-start border-primary border-3 mb-2">
                <div className="fw-bold small text-dark mb-1">Restoran Cevabı:</div>
                <div className="text-secondary small">{rev.reply}</div>
                <button 
                  className="btn btn-link text-primary btn-sm p-0 text-decoration-none mt-2 small"
                  onClick={() => handleOpenReplyModal(rev)}
                >
                  Cevabı Düzenle
                </button>
              </div>
            ) : (
              <button 
                className="btn btn-outline-primary btn-sm px-3 rounded-pill fw-semibold mt-2 align-self-start"
                onClick={() => handleOpenReplyModal(rev)}
              >
                Cevapla
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      {replyId !== null && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Cevap Yaz</h5>
                <button type="button" className="btn-close" onClick={() => setReplyId(null)}></button>
              </div>
              <form onSubmit={handleReplySubmit}>
                <div className="modal-body">
                  <p className="small text-secondary mb-3">
                    <strong>Müşteri Yorumu:</strong> "{reviews.find(r => r.id === replyId)?.comment}"
                  </p>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Cevabınız</label>
                    <textarea 
                      rows="4" 
                      className="form-control rounded-3" 
                      placeholder="Müşterinize teşekkür edin veya sorunu nasıl çözeceğinizi açıklayın..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setReplyId(null)}>İptal</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4 text-white">Gönder</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Comment Custom Alert dialog */}
      <QuestionBox 
        isOpen={deleteId !== null}
        title="Yorumu Kaldır"
        message="Müşteri yorumunu restoran panelinizden kaldırmak istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmText="Yorumu Sil"
        cancelText="İptal"
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

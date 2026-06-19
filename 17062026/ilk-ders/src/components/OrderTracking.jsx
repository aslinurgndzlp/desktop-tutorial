import { useState } from 'react'

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [trackedOrder, setTrackedOrder] = useState(null)
  const [error, setError] = useState('')

  const handleTrackSubmit = (e) => {
    e.preventDefault()
    if (orderId === '12345') {
      setTrackedOrder({ id: '12345', status: 'Hazırlanıyor' })
      setError('')
    } else {
      setTrackedOrder(null)
      setError('Sipariş bulunamadı! (Örnek Sipariş No: 12345)')
    }
  }

  return (
    <main className="tracking-container">
      <div className="tracking-card">
        <h2 className="form-title">Sipariş Takibi</h2>
        <form onSubmit={handleTrackSubmit}>
          <div className="form-group">
            <label className="form-label">Sipariş Numarası</label>
            <input
              type="text"
              placeholder="Örn: 12345"
              className="form-input"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">E-Posta Adresi</label>
            <input
              type="email"
              placeholder="ahmet@n11.com"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="form-submit">Siparişi Sorgula</button>
        </form>

        {error && (
          <span className="form-error">⚠ {error}</span>
        )}
      </div>

      {trackedOrder && (
        <div className="tracking-card">
          <h3 className="value-title">Sipariş Durumu: {trackedOrder.status}</h3>
          <div className="timeline">
            <div className="timeline-step">
              <div className="timeline-icon timeline-icon-active">✓</div>
              <span className="timeline-label timeline-label-active">Sipariş Alındı</span>
            </div>

            <div className="timeline-step">
              <div className="timeline-icon timeline-icon-active">✓</div>
              <span className="timeline-label timeline-label-active">Hazırlanıyor</span>
            </div>

            <div className="timeline-step">
              <div className="timeline-icon">3</div>
              <span className="timeline-label">Kargoya Verildi</span>
            </div>

            <div className="timeline-step">
              <div className="timeline-icon">4</div>
              <span className="timeline-label">Teslim Edildi</span>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

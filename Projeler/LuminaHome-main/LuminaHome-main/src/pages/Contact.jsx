import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  Loader2,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Destek Talebi');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Geçerli bir e-posta adresi girin.');
      return;
    }

    if (message.trim().length < 10) {
      toast.error('Mesajınız en az 10 karakter olmalıdır.');
      return;
    }

    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      toast.success('Mesajınız başarıyla gönderildi! Ekibimiz en kısa sürede dönüş yapacaktır.', {
        icon: '📨',
        duration: 4000
      });
      // Clear form
      setName('');
      setEmail('');
      setSubject('Destek Talebi');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div>
        <h1 className="font-display font-extrabold text-3xl tracking-tight mb-1">Destek ve İletişim</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Bir sorun mu yaşıyorsunuz? Bize ulaşın, en kısa sürede yardımcı olalım.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CONTACT INFO COLUMN */}
        <div className="space-y-6 lg:col-span-1">
          <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-slate-800/40 space-y-6">
            <h3 className="font-display font-extrabold text-base border-b border-slate-100/50 dark:border-slate-800/50 pb-3">İletişim Bilgileri</h3>
            
            <div className="space-y-4">
              
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-primary-500/10 text-primary-500 rounded-xl flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider block">ADRESİMİZ</span>
                  <a 
                    href="https://maps.google.com/?q=Sarıyer,İstanbul" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-bold leading-relaxed text-[#3f2a35] dark:text-[#fff7fb] hover:text-primary-500 hover:underline transition-colors"
                  >
                    Sarıyer / İstanbul
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-primary-500/10 text-primary-500 rounded-xl flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider block">TELEFON</span>
                  <span className="text-xs font-semibold leading-relaxed">
                    +90 (212) 555 45 45
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-primary-500/10 text-primary-500 rounded-xl flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider block">E-POSTA</span>
                  <span className="text-xs font-semibold leading-relaxed">
                    destek@luminahome.com
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-primary-500/10 text-primary-500 rounded-xl flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider block">ÇALIŞMA SAATLERİ</span>
                  <span className="text-xs font-semibold leading-relaxed">
                    Hafta İçi: 09:00 - 18:00<br />
                    Cumartesi: 10:00 - 15:00 (Pazar Kapalı)
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* SIMULATED MAP */}
          <a 
            href="https://maps.google.com/?q=Sarıyer,İstanbul" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block glass-panel rounded-3xl p-5 border border-slate-200/40 dark:border-slate-800/40 space-y-3 cursor-pointer hover:border-primary-500/45 transition-all hover:scale-[1.01]"
          >
            <h3 className="font-display font-extrabold text-sm text-[#3f2a35] dark:text-[#fff7fb]">Ofis Konum Haritası</h3>
            <div className="h-44 rounded-2xl border border-[#f8d7e7] dark:border-[rgba(255,214,232,0.16)] relative overflow-hidden bg-[#fff1f7] dark:bg-[#1f1720] flex items-center justify-center">
              {/* Premium custom styled SVG map mockup */}
              <svg className="absolute inset-0 w-full h-full text-slate-350 dark:text-slate-800" fill="currentColor" viewBox="0 0 400 200">
                <path d="M 0 40 Q 200 40 400 120" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
                <path d="M 0 100 Q 150 160 400 80" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.4" />
                <path d="M 120 0 L 120 200" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
                <path d="M 280 0 L 280 200" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
                <circle cx="200" cy="110" r="10" className="text-primary-500/30 animate-ping" />
                <circle cx="200" cy="110" r="5" className="text-primary-500" />
              </svg>
              <div className="absolute bg-white/95 dark:bg-slate-900/95 shadow-md px-3 py-1.5 rounded-xl border border-[#f8d7e7] dark:border-[rgba(255,214,232,0.16)] text-[10px] font-bold text-center z-10 text-[#3f2a35] dark:text-[#fff7fb]">
                Sarıyer / İstanbul
              </div>
            </div>
          </a>
        </div>

        {/* SUPPORT REQUEST FORM */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-slate-800/40 lg:col-span-2">
          <h3 className="font-display font-extrabold text-base border-b border-slate-100/50 dark:border-slate-800/50 pb-3 mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" />
            <span>Şikayet / Destek Formu</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-450 tracking-wider uppercase mb-1.5 ml-1">Ad Soyad *</label>
              <input 
                type="text" 
                placeholder="örn. Merve Yılmaz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-100/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-2xl px-4 py-3 text-xs outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 tracking-wider uppercase mb-1.5 ml-1">E-posta Adresi *</label>
              <input 
                type="email" 
                placeholder="örn. merve@ornek.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-100/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-2xl px-4 py-3 text-xs outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 tracking-wider uppercase mb-1.5 ml-1">Konu Başlığı</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-100/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-2xl px-4 py-3 text-xs outline-none cursor-pointer"
              >
                <option value="Destek Talebi">Teknik Destek Talebi</option>
                <option value="Öneri / İstek">Cihaz / Özellik Önerisi</option>
                <option value="Şikayet">Şikayet Bildirimi</option>
                <option value="Genel Soru">Genel Soru / Bilgi Talebi</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 tracking-wider uppercase mb-1.5 ml-1">Mesajınız * (En az 10 karakter)</label>
              <textarea 
                rows="5"
                placeholder="Sorunuzu veya şikayetinizi detaylıca buraya yazın..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-100/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 rounded-2xl px-4 py-3 text-xs outline-none resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-750 text-white font-bold text-xs py-3 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 hover-scale cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gönderiliyor...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Talebi Gönder</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default Contact;

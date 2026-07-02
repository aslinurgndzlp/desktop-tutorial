import React from 'react';
import { X } from 'lucide-react';

export default function KvkkModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            KVKK Aydınlatma Metni
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto pr-2 text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed flex-1">
          <h4 className="font-semibold text-slate-800 dark:text-slate-200">
            1. Veri Sorumlusu ve Temsilcisi
          </h4>
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu (“Kanun”) uyarınca, kişisel verileriniz; veri sorumlusu olarak BiletBul A.Ş. (“Şirket”) tarafından aşağıda açıklanan kapsamda işlenebilecektir.
          </p>

          <h4 className="font-semibold text-slate-800 dark:text-slate-200">
            2. Kişisel Verilerin Hangi Amaçla İşleneceği
          </h4>
          <p>
            Toplanan kişisel verileriniz (Ad, soyad, telefon numarası, e-posta adresi), seyahat biletlerinizin düzenlenmesi, kimlik doğrulaması yapılması, rezervasyon ve ödeme süreçlerinizin yönetilmesi, müşteri ilişkilerinin yürütülmesi ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir.
          </p>

          <h4 className="font-semibold text-slate-800 dark:text-slate-200">
            3. İşlenen Kişisel Verilerin Kimlere ve Hangi Amaçla Aktarılabileceği
          </h4>
          <p>
            Kişisel verileriniz, seyahat rezervasyonunuzun tamamlanabilmesi amacıyla ilgili otobüs veya uçak firmaları (Kamil Koç, THY, Pegasus vb.) ile ve yasal zorunluluklar kapsamında yetkili kamu kurum ve kuruluşları ile paylaşılabilecektir.
          </p>

          <h4 className="font-semibold text-slate-800 dark:text-slate-200">
            4. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi
          </h4>
          <p>
            Kişisel verileriniz, web sitemiz üzerinden doldurduğunuz kayıt ve bilet rezervasyon formları vasıtasıyla elektronik ortamda toplanmaktadır. Kanun’un 5. ve 6. maddelerinde belirtilen sözleşmenin kurulması ve ifası, veri sorumlusunun hukuki yükümlülüğü hukuki sebeplerine dayanarak işlenmektedir.
          </p>

          <h4 className="font-semibold text-slate-800 dark:text-slate-200">
            5. Veri Sahibinin Kanun’un 11. Maddesinde Sayılan Hakları
          </h4>
          <p>
            Kişisel veri sahibi olarak Şirketimize başvurarak; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacına uygun kullanılıp kullanılmadığını öğrenme, eksik veya yanlış işlenmişse düzeltilmesini isteme haklarına sahipsiniz.
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            Okudum, Anladım
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Heart, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand and Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white font-bold">
                B
              </div>
              <span className="text-lg font-bold text-white">BiletBul</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Türkiye'nin en hızlı ve güvenilir bilet arama motoru. Otobüs ve uçak biletlerini karşılaştırın, en uygun fiyata anında rezerve edin.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs">
              <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-emerald-500" /> 256-Bit SSL</span>
              <span className="flex items-center gap-1"><Award className="h-4 w-4 text-indigo-400" /> Güvenli Ödeme</span>
            </div>
          </div>

          {/* Vision & Values */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Vizyonumuz & Değerlerimiz</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span><strong>Müşteri Odaklılık:</strong> Seyahat planlarınızı en dertsiz ve ekonomik şekilde gerçekleştirmenizi sağlıyoruz.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span><strong>Teknolojik Yenilik:</strong> Modern arama motoru teknolojimizle saniyeler içinde binlerce seferi tarıyoruz.</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">İletişim & Destek</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-indigo-400" />
                <span>+90 (850) 123 45 67</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-400" />
                <span>destek@biletbul.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-400" />
                <span>Maslak, Büyükdere Cd. No:123, 34398 Sarıyer/İstanbul</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 BiletBul A.Ş. Tüm hakları saklıdır.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for your safe travel.
          </p>
        </div>
      </div>
    </footer>
  );
}

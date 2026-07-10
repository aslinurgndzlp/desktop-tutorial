import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Zap, 
  AlertOctagon, 
  User, 
  Cpu, 
  Info, 
  ArrowRight,
  Download 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Reports = () => {
  const [reportType, setReportType] = useState('weekly'); // weekly, monthly
  const { devices } = useSelector((state) => state.devices);
  const { costPerKwh } = useSelector((state) => state.energy);

  // Compute mock report values
  const multiplier = reportType === 'weekly' ? 7 : 30;
  const averageDailyKwh = devices.reduce((acc, d) => acc + (d.status ? d.energyConsumption * 1.5 : d.energyConsumption * 0.12), 0);
  const totalKwh = parseFloat((averageDailyKwh * multiplier).toFixed(1));
  const totalCost = parseFloat((totalKwh * costPerKwh).toFixed(2));
  const carbonFootprint = parseFloat((totalKwh * 0.42).toFixed(1)); // 0.42 kg CO2 per kWh

  const savingsTips = [
    { text: "Tatil moduna geçtiğinizde su vanasını kapatmak ve termostatı 16°C seviyesine çekmek yıllık bazda ₺450 tasarruf sağlar.", type: "energy" },
    { text: "Salon klimasını 22°C yerine 24°C seviyesinde çalıştırmak tüketimi yaklaşık %12 azaltır.", type: "eco" },
    { text: "Bulaşık ve çamaşır makinelerini gece 22:00'den sonra çalıştırmak gece tarifesiyle fatura yükünü düşürür.", type: "cost" }
  ];

  const maintenanceTips = [
    { text: "Mutfak hava kalite sensörü filtresinin temizlenme zamanı gelmiştir.", date: "Gecikme: 3 gün" },
    { text: "Bahçe sulama borularının kaçak tespiti için check-up yapılması önerilir.", date: "Son Kontrol: 2 ay önce" }
  ];

  const topUser = "Merve Yılmaz";
  const mostUsedDevice = "Salon Kliması";
  const leastUsedDevice = "Akıllı Fırın";

  const handleDownload = () => {
    toast.success('Rapor PDF formatında indiriliyor...');
  };

  return (
    <div className="space-y-8 animate-zoom-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-[#3f2a35] dark:text-[#fff7fb] mb-2">
            Rapor Arşivi & Özetleri
          </h1>
          <p className="text-xs sm:text-sm text-[#6f5260] dark:text-[#f3d6e4] font-semibold">
            Enerji verimlilik raporları, karbon salınım analizleri ve haftalık/aylık performans özetleri.
          </p>
        </div>

        <button 
          onClick={handleDownload}
          className="px-4 py-2.5 bg-[#ec6fa7] hover:bg-[#db4f91] text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Raporu İndir</span>
        </button>
      </div>

      {/* REPORT TYPE SELECTOR */}
      <div className="flex bg-[#fff1f7] dark:bg-[#3a2533] p-1 rounded-2xl border border-[#f8d7e7] dark:border-[#6f5260] w-fit">
        <button
          onClick={() => setReportType('weekly')}
          className={`px-6 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            reportType === 'weekly'
              ? 'bg-[#ec6fa7] text-white shadow-sm'
              : 'text-[#6f5260] dark:text-[#f3d6e4] hover:text-[#3f2a35]'
          }`}
        >
          Haftalık Rapor
        </button>
        
        <button
          onClick={() => setReportType('monthly')}
          className={`px-6 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            reportType === 'monthly'
              ? 'bg-[#ec6fa7] text-white shadow-sm'
              : 'text-[#6f5260] dark:text-[#f3d6e4] hover:text-[#3f2a35]'
          }`}
        >
          Aylık Rapor
        </button>
      </div>

      {/* CORE REPORT METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ENERGY CONSUMPTION CARD */}
        <div className="glass-panel p-6 rounded-3xl border border-[#f8d7e7] dark:border-[#6f5260] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center gap-3.5 mb-5">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] uppercase tracking-wider block">TOPLAM ELEKTRİK</span>
              <h3 className="text-xl font-display font-extrabold text-[#3f2a35] dark:text-[#fff7fb] mt-0.5">{totalKwh} kWh</h3>
            </div>
          </div>
          <p className="text-[11px] text-[#6f5260] dark:text-[#f3d6e4] font-semibold leading-relaxed">
            Elektrik tüketim hedeflerinizin altında kaldınız. Gece tarifesinde yapılan çamaşır yıkamaları verimliliği yükseltti.
          </p>
        </div>

        {/* BILL ESTIMATE CARD */}
        <div className="glass-panel p-6 rounded-3xl border border-[#f8d7e7] dark:border-[#6f5260] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center gap-3.5 mb-5">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] uppercase tracking-wider block">TOPLAM MALİYET</span>
              <h3 className="text-xl font-display font-extrabold text-[#3f2a35] dark:text-[#fff7fb] mt-0.5">₺{totalCost}</h3>
            </div>
          </div>
          <p className="text-[11px] text-[#6f5260] dark:text-[#f3d6e4] font-semibold leading-relaxed">
            Tahmini birim fiyat ₺{costPerKwh} baz alınarak hesaplanmıştır. Önceki periyoda göre %6 tasarruf sağlandı.
          </p>
        </div>

        {/* CARBON SALINIMI CARD */}
        <div className="glass-panel p-6 rounded-3xl border border-[#f8d7e7] dark:border-[#6f5260] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center gap-3.5 mb-5">
            <div className="p-3 bg-rose-500/10 text-[#ec6fa7] rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#8b6f7b] dark:text-[#d7b8c7] uppercase tracking-wider block">KARBON AYAK İZİ</span>
              <h3 className="text-xl font-display font-extrabold text-[#3f2a35] dark:text-[#fff7fb] mt-0.5">{carbonFootprint} kg CO2</h3>
            </div>
          </div>
          <p className="text-[11px] text-[#6f5260] dark:text-[#f3d6e4] font-semibold leading-relaxed">
            Karbon salınımınızı dengelemek için bahçenizdeki akıllı sulama otomasyonunu eco modunda tutmanız önerilir.
          </p>
        </div>

      </div>

      {/* TOP USERS & USAGE STATISTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SUMMARY STATS TABLE */}
        <div className="glass-panel p-6 rounded-3xl border border-[#f8d7e7] dark:border-[#6f5260] space-y-5">
          <h3 className="font-display font-extrabold text-base flex items-center gap-2 text-[#3f2a35] dark:text-[#fff7fb]">
            <FileText className="w-4.5 h-4.5 text-[#ec6fa7]" />
            <span>Kullanım İstatistikleri</span>
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2.5 border-b border-[#f8d7e7]/15 dark:border-[#6f5260]/15">
              <div className="flex items-center gap-2 text-xs font-bold text-[#3f2a35] dark:text-[#fff7fb]">
                <User className="w-4 h-4 text-indigo-500" />
                <span>En Aktif Kullanıcı</span>
              </div>
              <span className="text-xs font-extrabold text-[#6f5260] dark:text-[#f3d6e4]">{topUser}</span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-[#f8d7e7]/15 dark:border-[#6f5260]/15">
              <div className="flex items-center gap-2 text-xs font-bold text-[#3f2a35] dark:text-[#fff7fb]">
                <Cpu className="w-4 h-4 text-rose-500" />
                <span>En Çok Kullanılan Cihaz</span>
              </div>
              <span className="text-xs font-extrabold text-[#6f5260] dark:text-[#f3d6e4]">{mostUsedDevice}</span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-[#f8d7e7]/15 dark:border-[#6f5260]/15">
              <div className="flex items-center gap-2 text-xs font-bold text-[#3f2a35] dark:text-[#fff7fb]">
                <Cpu className="w-4 h-4 text-slate-400" />
                <span>En Az Kullanılan Cihaz</span>
              </div>
              <span className="text-xs font-extrabold text-[#6f5260] dark:text-[#f3d6e4]">{leastUsedDevice}</span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-[#f8d7e7]/15 dark:border-[#6f5260]/15">
              <div className="flex items-center gap-2 text-xs font-bold text-[#3f2a35] dark:text-[#fff7fb]">
                <AlertOctagon className="w-4 h-4 text-amber-500" />
                <span>Güvenlik Olayı</span>
              </div>
              <span className="text-xs font-extrabold text-emerald-500">Yok (Stabil)</span>
            </div>
          </div>
        </div>

        {/* ECO SAVINGS RECOMMENDATIONS */}
        <div className="glass-panel p-6 rounded-3xl border border-[#f8d7e7] dark:border-[#6f5260] space-y-4">
          <h3 className="font-display font-extrabold text-base flex items-center gap-2 text-[#3f2a35] dark:text-[#fff7fb]">
            <Info className="w-4.5 h-4.5 text-indigo-500" />
            <span>Tasarruf & Bakım Tavsiyeleri</span>
          </h3>

          <div className="space-y-3">
            {savingsTips.map((tip, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 rounded-2xl">
                <ArrowRight className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#6f5260] dark:text-[#f3d6e4] leading-relaxed font-semibold">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* HARDWARE AUDITS */}
      <div className="glass-panel p-6 rounded-3xl border border-[#f8d7e7] dark:border-[#6f5260] space-y-4">
        <h3 className="font-display font-extrabold text-base flex items-center gap-2 text-[#3f2a35] dark:text-[#fff7fb]">
          <Calendar className="w-4.5 h-4.5 text-[#ec6fa7]" />
          <span>Planlı Bakım ve Donanım Önerileri</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {maintenanceTips.map((tip, idx) => (
            <div key={idx} className="p-4 bg-[#fff1f7] dark:bg-[#3a2533] border border-[#f8d7e7] dark:border-[#6f5260] rounded-2xl flex justify-between items-center text-xs">
              <div className="min-w-0 pr-4">
                <p className="font-bold text-[#3f2a35] dark:text-[#fff7fb] truncate">{tip.text}</p>
                <p className="text-[10px] text-[#8b6f7b] dark:text-[#d7b8c7] mt-0.5">{tip.date}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 whitespace-nowrap">Planlandı</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Reports;

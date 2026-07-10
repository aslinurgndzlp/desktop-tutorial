import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Smile, 
  Terminal, 
  HelpCircle,
  Home
} from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3.5 bg-primary-500/10 text-primary-500 rounded-3xl border border-primary-500/20 mb-2 shadow-inner">
          <Home className="w-10 h-10 animate-pulse-slow" />
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight leading-none">
          LuminaHome Hakkında
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold max-w-xl mx-auto leading-relaxed">
          Geleceğin akıllı ve çevre dostu yaşam standartlarını bugünden deneyimleyin. LuminaHome, evinizi daha konforlu, güvenli ve verimli hale getirmek için tasarlandı.
        </p>
      </div>

      {/* CORE MISSION CARD */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-200/40 dark:border-slate-800/40 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <h3 className="font-display font-extrabold text-lg flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary-500" />
          <span>Projenin Amacı</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
          LuminaHome, modern nesnelerin interneti (IoT) sistemlerini tek bir arayüzden yöneten, kullanıcı dostu bir kontrol paneli sunmaktadır. Temel hedefimiz; ev sakinlerinin elektrikli aletleri, iklimlendirme ünitelerini, kameraları ve kilitleri kolayca takip etmesini sağlarken, gereksiz enerji sarfiyatını en aza indirmek ve ev içi güvenliği maksimum seviyeye çıkarmaktır.
        </p>
      </div>

      {/* PILLARS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-slate-800/40 space-y-3.5">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-display font-extrabold text-base">Enerji Tasarrufu</h3>
          <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
            Her cihazın tüketim parametrelerini saatlik, haftalık ve aylık bazda izleyerek gereksiz yanan lambaları veya aşırı çalışan iklimlendirmeyi anında tespit edin. Akıllı zamanlayıcılar ve prizler sayesinde faturanızı kontrol altında tutun.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-slate-800/40 space-y-3.5">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl w-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-display font-extrabold text-base">Güvenlik ve Koruma</h3>
          <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
            Tek tıkla etkinleştirilen 'Dışarıdayım' veya 'Gece' modları ile tüm kilitleri güvene alın. Canlı kamera akışları, hareket algılama uyarıları ve duman dedektörleriyle olası tehlikelere karşı 7/24 tetikte kalın.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-slate-800/40 space-y-3.5">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl w-fit">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-display font-extrabold text-base">Eşsiz Konfor</h3>
          <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
            Akıllı aydınlatmanın renk sıcaklığı ve parlaklık ayarlarından klimanın fan hızlarına kadar her detayı yatağınızdan kalkmadan özelleştirin. Kahve makinenizi ve robot süpürgenizi zahmetsizce yönetin.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-slate-800/40 space-y-3.5">
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl w-fit">
            <Smile className="w-5 h-5" />
          </div>
          <h3 className="font-display font-extrabold text-base">Premium Kullanıcı Deneyimi</h3>
          <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
            Apple HomeKit tarzı, yuvarlatılmış köşeli kart tasarımları, soft degradeler ve saate duyarlı otomatik gece/gündüz teması ile göz yormayan, son derece akıcı ve lüks bir kullanıcı deneyimi sunuyoruz.
          </p>
        </div>

      </div>

      {/* TECH STACK LOGOS */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-200/40 dark:border-slate-800/40 space-y-6">
        <h3 className="font-display font-extrabold text-base flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-500" />
          <span>Teknolojik Altyapı</span>
        </h3>
        
        <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
          LuminaHome kontrol paneli, en yüksek performans ve sürdürülebilirlik ilkelerine uygun olarak en güncel modern web teknolojileri kullanılarak geliştirilmiştir:
        </p>

        <div className="flex flex-wrap gap-2.5">
          {[
            'React',
            'React Router v6',
            'Redux Toolkit',
            'Redux Thunk (Asynchronous Actions)',
            'Tailwind CSS v4 (Latest Native)',
            'React Hot Toast',
            'Lucide Icons',
            'LocalStorage Session Persistence'
          ].map(tag => (
            <span 
              key={tag}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold bg-slate-100 dark:bg-slate-900 border border-slate-200/45 dark:border-slate-800/45 text-slate-600 dark:text-slate-350 shadow-sm"
            >
              <Terminal className="w-3.5 h-3.5 text-primary-500" />
              {tag}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};

export default About;

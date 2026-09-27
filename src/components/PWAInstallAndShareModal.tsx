import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Share2,
  Copy,
  Check,
  Download,
  X,
  Globe,
  QrCode,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface PWAInstallAndShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'install' | 'share';
}

export const PWAInstallAndShareModal: React.FC<PWAInstallAndShareModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'install',
}) => {
  const [activeTab, setActiveTab] = useState<'install' | 'share'>(defaultTab);
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    // Detect if already running standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for beforeinstallprompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for appinstalled
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  // Use current live URL or official active dev fallback
  const appUrl =
    typeof window !== 'undefined' && window.location.href.startsWith('http')
      ? window.location.origin
      : 'https://ais-dev-s6r2wnxl6knp373y7u77pz-232955989952.europe-west2.run.app';

  const devUrl = 'https://ais-dev-s6r2wnxl6knp373y7u77pz-232955989952.europe-west2.run.app';
  const sharedUrl = 'https://ais-pre-s6r2wnxl6knp373y7u77pz-232955989952.europe-west2.run.app';

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // If prompt not triggered yet, inform user
      if (isIOS) {
        setActiveTab('install');
      } else {
        alert('لتثبيت التطبيق على جهازك: افتح قائمة المتصفح (⋮) ثم اضغط "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"');
      }
    }
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(appUrl)}&color=064e3b`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-emerald-300">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black">تشغيل وتثبيت التطبيق على الهاتف</h2>
              <p className="text-[11px] text-emerald-200">رابط ويب مباشر + تطبيق هاتف PWA بدون متجر</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2">
          <button
            onClick={() => setActiveTab('install')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'install'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>تثبيت كتطبيق هاتف 📲</span>
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'share'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-4 h-4 text-teal-600" />
            <span>رابط الويب والمشاركة 🌐</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {activeTab === 'install' ? (
            <div className="space-y-4">
              {isInstalled ? (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-2">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h3 className="font-black text-emerald-900 text-sm">التطبيق مثبت لديك بنجاح!</h3>
                  <p className="text-xs text-emerald-800">
                    يمكنك تشغيل تطبيق "حكر الجامع" مباشرة من شاشة هاتفك الرئيسية كأي تطبيق مستقل وبدون الحاجة لفتح المتصفح.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
                    <img
                      src="/icon-192.png"
                      alt="أيقونة التطبيق"
                      className="w-16 h-16 rounded-2xl shadow-md border border-emerald-400"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-sm">بيانات حكر الجامع</h3>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          تطبيق PWA معتمد
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        تطبيق خفيف وسريع، يعمل بدون استهلاك ذاكرة الهاتف، ويدعم العمل في جميع الظروف.
                      </p>
                    </div>
                  </div>

                  {deferredPrompt ? (
                    <button
                      onClick={handleNativeInstall}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Download className="w-5 h-5" />
                      <span>تثبيت التطبيق على هاتفك الآن (بنقرة واحدة)</span>
                    </button>
                  ) : isIOS ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs space-y-2.5 text-amber-900">
                      <div className="font-bold flex items-center gap-2 text-amber-950">
                        <Smartphone className="w-4 h-4 text-amber-700" />
                        <span>طريقة التثبيت على هواتف iPhone / iPad (Safari):</span>
                      </div>
                      <ol className="list-decimal list-inside space-y-1.5 pr-1 leading-relaxed">
                        <li>
                          اضغط على زر <strong>المشاركة (Share ⎋)</strong> في أسفل شاشة Safari.
                        </li>
                        <li>
                          اسحب القائمة لأسفل واختر <strong>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen ➕)</strong>.
                        </li>
                        <li>
                          اضغط على <strong>"إضافة" (Add)</strong> في الزاوية العلوية ليظهر التطبيق مع تطبيقات هاتفك.
                        </li>
                      </ol>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-slate-700">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        <span>طريقة التثبيت على هواتف أندرويد ومتصفح Chrome:</span>
                      </div>
                      <p className="leading-relaxed">
                        اضغط على قائمة المتصفح الثلاث نقاط <strong>(⋮)</strong> في أعلى الزاوية، ثم اختر{' '}
                        <strong>"تثبيت التطبيق" (Install App)</strong> أو{' '}
                        <strong>"إضافة إلى الشاشة الرئيسية"</strong>.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
                    <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                      <span className="block font-bold text-slate-800">⚡ فوري</span>
                      <span className="text-slate-500">بدون تحميل ملفات كبيرة</span>
                    </div>
                    <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                      <span className="block font-bold text-slate-800">🔒 آمن</span>
                      <span className="text-slate-500">حماية وتشفير SSL</span>
                    </div>
                    <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                      <span className="block font-bold text-slate-800">🔄 متزامن</span>
                      <span className="text-slate-500">تحديث تلقائي دائماً</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <span className="text-xs font-bold text-slate-700 block">رابط تشغيل التطبيق المباشر عبر الويب:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={appUrl}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 select-all"
                  />
                  <button
                    onClick={handleCopy}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
                  </button>
                </div>
              </div>

              {/* Instructions on activating public link via AI Studio Share */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-950">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>كيف تفتح الرابط للجمهور والمواطنين دون قيود؟</span>
                </div>
                <p className="leading-relaxed text-[11px] text-emerald-800">
                  1. <strong>الرابط المنسوخ أعلاه:</strong> يفتح معك مباشرة على الهاتف أو الكمبيوتر.
                  <br />
                  2. <strong>لتفعيل الرابط العام (Public Link)</strong> لأي مواطن: اضغط على زر <strong>"Share" (مشاركة)</strong> الموجود في <strong>أعلى شاشة Google AI Studio Build</strong>، وسيتم نشر المنظومة وتفعيل الرابط العام فوراً للجميع.
                </p>
              </div>

              {/* QR Code */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
                <div className="p-2 bg-white rounded-xl shadow-xs border border-emerald-200 shrink-0">
                  <img src={qrUrl} alt="رمز الاستجابة السريعة QR" className="w-28 h-28" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 justify-center sm:justify-start">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>امسح الكود بكاميرا الهاتف</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    وجه كاميرا أي هاتف محمول نحو الكود للدخول المباشر إلى المنظومة وتثبيتها كأبليكيشن بنقرة واحدة.
                  </p>
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `رابط منظومة بيانات حكر الجامع لتسجيل ومتابعة الأسر والمواطنين:\n${appUrl}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>مشاركة عبر واتساب</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

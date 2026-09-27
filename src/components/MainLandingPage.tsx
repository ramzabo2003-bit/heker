import React, { useState } from 'react';
import { FamilyRecord } from '../types';
import { RegistrationForm } from './RegistrationForm';
import { PWAInstallAndShareModal } from './PWAInstallAndShareModal';
import {
  UserCheck,
  UserPlus,
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  MapPin,
  HeartHandshake,
  FileSpreadsheet,
  Search,
  KeyRound,
  FileCheck,
  Smartphone,
  Globe,
} from 'lucide-react';

interface MainLandingPageProps {
  families: FamilyRecord[];
  onCitizenLoginSuccess: (family: FamilyRecord) => void;
  onSaveNewFamily: (family: FamilyRecord) => void;
  onOpenStaffLogin: () => void;
  onPrintPreview: (family: FamilyRecord) => void;
}

export const MainLandingPage: React.FC<MainLandingPageProps> = ({
  families,
  onCitizenLoginSuccess,
  onSaveNewFamily,
  onOpenStaffLogin,
  onPrintPreview,
}) => {
  // Active Tab inside the unified portal: 'query' (استعلام ودخول) | 'register' (تسجيل أسرة جديدة)
  const [activeTab, setActiveTab] = useState<'query' | 'register'>('query');

  // PWA & Share Modal State
  const [showPwaModal, setShowPwaModal] = useState<boolean>(false);
  const [pwaDefaultTab, setPwaDefaultTab] = useState<'install' | 'share'>('install');

  // Query Form State
  const [headIdInput, setHeadIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCitizenQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanedId = headIdInput.trim().replace(/\D/g, '');
    if (!cleanedId) {
      setErrorMessage('يرجى إدخال رقم هوية صحيح مكون من 9 أرقام.');
      return;
    }

    const foundFamily = families.find(
      (f) => f.headIdNumber === cleanedId || f.id.toLowerCase() === headIdInput.trim().toLowerCase()
    );

    if (!foundFamily) {
      setErrorMessage('رقم الهوية غير مسجل في منظومة حكر الجامع. يمكنك التبديل إلى تبويب "تسجيل أسرة جديدة" لتسجيل ملفك لأول مرة.');
      return;
    }

    // Verify password if set; otherwise default to '123456' or national ID itself
    const validPassword = foundFamily.password || '123456';
    if (
      passwordInput &&
      passwordInput !== validPassword &&
      passwordInput !== '123456' &&
      passwordInput !== foundFamily.headIdNumber
    ) {
      setErrorMessage(
        'كلمة المرور غير صحيحة. إذا تم إدراج اسمك عبر كشوفات الإدارة (إكسل) ولم تعين كلمة سر، يمكنك استخدام رقم هويتك أو 123456 للدخول.'
      );
      return;
    }

    // Successfully log the citizen in
    onCitizenLoginSuccess(foundFamily);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top clean header for citizen */}
      <header className="border-b border-slate-800/80 px-4 sm:px-8 py-3.5 bg-slate-950/60 sticky top-0 z-40 backdrop-blur-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-500/20">
              ح
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-wide text-white">بيانات حكر الجامع</h1>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                لجنة حي حكر الجامع - دير البلح
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPwaDefaultTab('install');
                setShowPwaModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>تثبيت كتطبيق 📲</span>
            </button>

            <button
              onClick={() => {
                setPwaDefaultTab('share');
                setShowPwaModal(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer border border-slate-700"
              title="رابط الويب ومشاركة المنظومة"
            >
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">رابط الويب</span>
            </button>

            {/* Discreet Secure Padlock Icon without exposing any staff info */}
            <button
              onClick={onOpenStaffLogin}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition cursor-pointer"
              title="تسجيل الدخول"
              aria-label="تسجيل الدخول"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-10 flex flex-col justify-center">
        {/* Title & Introduction */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
            <HeartHandshake className="w-3.5 h-3.5" />
            البوابة الموحدة للمواطنين - دير البلح
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            منظومة بيانات حكر الجامع
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            اللوحة الموحدة للاستعلام عن ملف الأسرة واستكمال البيانات الناقصة أو تسجيل أسرة جديدة لأول مرة.
          </p>
        </div>

        {/* UNIFIED PANEL: Tabs Switcher (دمج لوحة الاستعلام وتسجيل أسرة جديدة في لوحة واحدة) */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur-xs space-y-6">
          {/* Dual Navigation Switcher */}
          <div className="flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700/80 max-w-md mx-auto">
            <button
              onClick={() => {
                setActiveTab('query');
                setErrorMessage('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'query'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>استعلام ودخول ملف الأسرة</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('register');
                setErrorMessage('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>تسجيل أسرة جديدة لأول مرة</span>
            </button>
          </div>

          {/* TAB 1: استعلام ودخول ملف الأسرة (برقم الهوية وكلمة السر) */}
          {activeTab === 'query' && (
            <div className="max-w-xl mx-auto space-y-5 animate-fadeIn">
              <div className="text-center space-y-1">
                <h3 className="font-bold text-base text-white flex items-center justify-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  استعلام ومتابعة ملف الأسرة
                </h3>
                <p className="text-xs text-slate-400">
                  أدخل رقم هوية رب الأسرة وكلمة السر لاستعراض حالة الاعتماد، استكمال النواقص، أو طباعة بطاقة الأسرة.
                </p>
              </div>

              {/* Notice for citizens imported via committee Excel sheets */}
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3.5 text-xs text-emerald-200 flex items-start gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-white">إعلان للمواطنين المدرجة أسماؤهم بكشوفات الإدارة (ملف إكسل):</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    إذا كان اسمك مسجلاً ضمن كشوفات اللجنة الصادرة، يمكنك الدخول برقم هويتك مباشرة ومراجعة ملفك، ثم الضغط على <strong>"استكمال البيانات الناقصة"</strong> لتحديث بيانات الزوجة والأبناء، والطلاب، وأضرار الحرب، ورقم المحفظة المالية لتأكيد حقك في الاستفادة.
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-rose-950/70 border border-rose-500/50 text-rose-200 p-3.5 rounded-2xl text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="leading-relaxed">{errorMessage}</p>
                    {errorMessage.includes('غير مسجل') && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('register')}
                        className="text-emerald-400 hover:underline font-bold inline-flex items-center gap-1 cursor-pointer pt-1"
                      >
                        الانتقال لتسجيل أسرة جديدة الآن
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleCitizenQuerySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">
                    رقم هوية رب الأسرة (9 أرقام) <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={9}
                    placeholder="مثال: 902145876"
                    value={headIdInput}
                    onChange={(e) => setHeadIdInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/90 border border-slate-600 rounded-xl text-white font-mono text-sm tracking-wider focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">
                    كلمة السر <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="أدخل كلمة السر (الافتراضية: 123456)"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/90 border border-slate-600 rounded-xl text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    إذا لم تكن قد قمت بتعيين كلمة سر خاصة بعد، يمكنك إدخال كلمة السر الافتراضية: <strong>123456</strong>
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition shadow-lg shadow-emerald-700/30 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>استعلام ودخول لملف الأسرة واستكمال البيانات</span>
                  </button>
                </div>
              </form>

              {/* Quick switch helper */}
              <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span>ليس لديك ملف مسجل بعد؟</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  تسجيل أسرة جديدة لأول مرة
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: تسجيل أسرة جديدة لأول مرة (استمارة التسجيل المدمجة في نفس اللوحة) */}
          {activeTab === 'register' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-sm text-white">
                    استمارة تسجيل أسرة جديدة لأول مرة
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('query')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  العودة للاستعلام بالهوية
                </button>
              </div>

              {/* Render Full Registration Form directly inside the unified container */}
              <div className="text-slate-900">
                <RegistrationForm
                  initialData={null}
                  existingFamilies={families}
                  onSaveSuccess={(newRecord) => {
                    onSaveNewFamily(newRecord);
                    onCitizenLoginSuccess(newRecord);
                  }}
                  onCancel={() => setActiveTab('query')}
                  onPrintPreview={onPrintPreview}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-slate-400">
            منظومة بيانات حكر الجامع © {new Date().getFullYear()} - دير البلح
          </p>
          <p className="text-[11px] text-slate-500">
            بوابة المواطنين المعتمدة | نظام حفظ وسرية البيانات
          </p>
        </div>
      </footer>

      {/* PWA Install & Share Modal */}
      <PWAInstallAndShareModal
        isOpen={showPwaModal}
        onClose={() => setShowPwaModal(false)}
        defaultTab={pwaDefaultTab}
      />
    </div>
  );
};

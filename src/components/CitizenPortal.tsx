import React, { useState } from 'react';
import { FamilyRecord } from '../types';
import { Search, UserCheck, AlertCircle, Printer, FileText, CheckCircle2, ShieldCheck, ArrowRight, Home, Users } from 'lucide-react';

interface CitizenPortalProps {
  families: FamilyRecord[];
  onStartNewRegistration: () => void;
  onPrintPreview: (family: FamilyRecord) => void;
  onViewFamily: (family: FamilyRecord) => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  families,
  onStartNewRegistration,
  onPrintPreview,
  onViewFamily,
}) => {
  const [idNumberInput, setIdNumberInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [searchResult, setSearchResult] = useState<FamilyRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = idNumberInput.trim().replace(/\D/g, '');
    if (!cleaned) return;

    const found = families.find((f) => f.headIdNumber === cleaned || f.id === idNumberInput.trim());
    setSearchResult(found || null);
    setHasSearched(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header card */}
      <div className="bg-gradient-to-l from-emerald-800 to-slate-900 text-white p-6 rounded-2xl shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">بوابة استعلام ودخول المواطن</h2>
            <p className="text-xs text-slate-300">منظومة بيانات حكر الجامع - دير البلح</p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mt-2">
          يمكن للمواطنين الاستعلام عن حالة اعتماد الأسرة، استخراج وطباعة بطاقة الأسرة الرسمية، والتأكد من صحة البيانات المسجلة للمساعدات النقدية والعينية.
        </p>
      </div>

      {/* Query / Login Form */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رقم هوية رب الأسرة (9 أرقام) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                maxLength={9}
                placeholder="أدخل رقم الهوية المكون من 9 أرقام"
                value={idNumberInput}
                onChange={(e) => setIdNumberInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono tracking-wider focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                كلمة السر أو كود التحقق (اختياري)
              </label>
              <input
                type="password"
                placeholder="كلمة السر الخاصة بك (إن وجدت)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Search className="w-4 h-4" />
              استعلام وبحث عن ملف الأسرة
            </button>

            <button
              type="button"
              onClick={onStartNewRegistration}
              className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              تسجيل أسرة جديدة لأول مرة
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Query Results */}
      {hasSearched && (
        <div>
          {searchResult ? (
            <div className="bg-white rounded-2xl border-2 border-emerald-500 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{searchResult.headName}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>رقم الهوية: {searchResult.headIdNumber}</span>
                      <span>•</span>
                      <span className="font-mono text-emerald-800 font-bold">{searchResult.id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPrintPreview(searchResult)}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    طباعة بطاقة الأسرة
                  </button>
                  <button
                    onClick={() => onViewFamily(searchResult)}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    معاينة كامل الملف
                  </button>
                </div>
              </div>

              {/* Verified status banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">حالة الاعتماد</span>
                  <span className="font-bold text-emerald-800 text-xs inline-block mt-0.5">
                    ✓ {searchResult.status}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">عدد الأفراد</span>
                  <span className="font-bold text-slate-800 text-xs inline-block mt-0.5">
                    {1 + (searchResult.wives?.length || 0) + (searchResult.childrenCount || 0)} أفراد
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">نوع السكن</span>
                  <span className="font-bold text-slate-800 text-xs inline-block mt-0.5">
                    {searchResult.housingType}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">المحفظة المالية</span>
                  <span className="font-bold text-slate-800 text-xs inline-block mt-0.5">
                    {searchResult.walletType.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Details breakdown */}
              <div className="bg-slate-50 rounded-xl p-4 text-xs space-y-2 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">العنوان المسجل:</span>
                  <span className="font-semibold text-slate-800">
                    {searchResult.city} - {searchResult.area} - {searchResult.neighborhood}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">أقرب معلم:</span>
                  <span className="font-bold text-emerald-900">{searchResult.nearestLandmark}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">رقم الجوال الأساسي:</span>
                  <span className="font-mono font-bold text-slate-800">{searchResult.primaryPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">حساب استلام المساعدات:</span>
                  <span className="font-mono text-slate-800">
                    {searchResult.walletNumber} ({searchResult.accountHolderName})
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-amber-950">لم يتم العثور على ملف بهذا الرقم</h3>
              <p className="text-xs text-amber-800 max-w-md mx-auto">
                رقم الهوية ({idNumberInput}) غير مسجل في قاعدة بيانات حكر الجامع حتى الآن، أو قد تكون أدخلت رقماً غير دقيق.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onStartNewRegistration}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  تسجيل أسرة جديدة الآن
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Helpful Info Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          تعليمات وإرشادات هامة للمواطنين
        </h3>
        <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
          <li>يجب التأكد من دقة رقم الهوية ورقم الواتساب لاستلام رسائل المساعدات والطرود الإغاثية.</li>
          <li>في حال تغيير مكان السكن أو رقم الجوال، يرجى مراجعة مشرف الحي في منطقة حكر الجامع لتحديث البيانات.</li>
          <li>تسجيل البيانات مكتملة يمنح الأسرة الأولوية التلقائية في التوزيع بحسب معايير الهشاشة والحاجة.</li>
        </ul>
      </div>
    </div>
  );
};

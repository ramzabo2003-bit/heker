import React, { useState } from 'react';
import { FamilyRecord } from '../types';
import { validateFamilyForm, isFamilyRecordComplete } from '../utils/validation';
import { LifeEventsModal, LifeEventType } from './LifeEventsModal';
import { PWAInstallAndShareModal } from './PWAInstallAndShareModal';
import {
  User,
  Users,
  HeartPulse,
  Home,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Printer,
  Edit3,
  LogOut,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  Calendar,
  Phone,
  FileCheck,
  Sparkles,
  Baby,
  Heart,
  Flame,
  Briefcase,
  PlusCircle,
  Smartphone,
} from 'lucide-react';

interface CitizenDashboardProps {
  family: FamilyRecord;
  allFamilies?: FamilyRecord[];
  onEditFamily: (family: FamilyRecord) => void;
  onUpdateFamilyRecord?: (family: FamilyRecord) => void;
  onPrintCard: (family: FamilyRecord) => void;
  onUpdatePassword: (familyId: string, newPass: string) => void;
  onLogout: () => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  family,
  allFamilies = [],
  onEditFamily,
  onUpdateFamilyRecord,
  onPrintCard,
  onUpdatePassword,
  onLogout,
}) => {
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);
  const [showPwaModal, setShowPwaModal] = useState(false);

  // Life Event Modal State (مولود جديد - زواج - وفاة)
  const [isLifeEventModalOpen, setIsLifeEventModalOpen] = useState(false);
  const [lifeEventType, setLifeEventType] = useState<LifeEventType>('newborn');

  const openLifeEvent = (type: LifeEventType) => {
    setLifeEventType(type);
    setIsLifeEventModalOpen(true);
  };

  const validation = validateFamilyForm(family);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.trim().length < 4) return;
    onUpdatePassword(family.id, newPassword.trim());
    setPassSuccess(true);
    setTimeout(() => {
      setPassSuccess(false);
      setShowPasswordChangeModal(false);
      setNewPassword('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar for Citizen */}
      <header className="bg-slate-900 text-white border-b border-slate-800 shadow-sm sticky top-0 z-40 no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-lg">
              ح
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base">بيانات حكر الجامع</h1>
              <p className="text-[11px] text-slate-400">بوابة المواطن الشخصية - ملف الأسرة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPwaModal(true)}
              className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تثبيت التطبيق 📲</span>
            </button>

            <button
              onClick={() => setShowPasswordChangeModal(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">تغيير كلمة السر</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 bg-rose-900/40 hover:bg-rose-900/70 text-rose-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Special Banner for Imported Records or Incomplete Profiles */}
        {(family.isImportedFromExcel || !validation.isEligibleToFinalize) && (
          <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-teal-500/15 border-2 border-amber-400 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900">
                      {family.isImportedFromExcel
                        ? 'تم إدراج اسمك مسبقاً من كشوفات الإدارة المعتمدة (ملف إكسل)'
                        : 'ملف الأسرة غير مكتمل - استكمال البيانات مطلوب'}
                    </h3>
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      مطلوب استكمال
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    أهلاً بك يا <strong>{family.headName}</strong>. لتأكيد استحقاق أسرتك في المساعدات والطرود والخدمات الإغاثية لدى لجنة حي حكر الجامع، يرجى مراجعة واستكمال باقي الحقول الناقصة (بيانات الزوجة، الأبناء والتعليم، وطلاب الجامعات والتوجيهي، وإصابات وأضرار الحرب، ورقم المحفظة المالية).
                  </p>
                </div>
              </div>

              <button
                onClick={() => onEditFamily(family)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white px-5 py-3 rounded-2xl text-xs font-black shadow-lg shadow-emerald-700/25 transition cursor-pointer shrink-0"
              >
                <Edit3 className="w-4 h-4" />
                <span>استكمال وتحديث البيانات الناقصة الآن ⚡</span>
              </button>
            </div>
          </div>
        )}

        {/* Welcome & File ID Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xl shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black text-slate-900">{family.headName}</h2>
                {isFamilyRecordComplete(family) ? (
                  <span className="bg-emerald-100 text-emerald-950 border-2 border-emerald-400 text-xs font-black px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    مستوفي كامل البيانات
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    يحتاج استكمال
                  </span>
                )}
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    family.residencyStatus === 'نازح'
                      ? 'bg-amber-50 text-amber-900 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  }`}
                >
                  {family.residencyStatus || 'مقيم'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                <span>رقم الهوية: <strong className="font-mono text-slate-700">{family.headIdNumber}</strong></span>
                <span>•</span>
                <span>كود الملف: <strong className="font-mono text-emerald-800">{family.id}</strong></span>
                <span>•</span>
                <span>تاريخ التسجيل: {family.submissionDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onPrintCard(family)}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              طباعة بطاقة الأسرة (A4)
            </button>

            <button
              onClick={() => onEditFamily(family)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              {validation.isEligibleToFinalize ? 'تعديل البيانات' : 'استكمال البيانات الناقصة'}
            </button>
          </div>
        </div>

        {/* Validation & Missing Fields Banner */}
        <div
          className={`rounded-2xl p-5 border shadow-2xs ${
            validation.isEligibleToFinalize
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  validation.isEligibleToFinalize ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}
              >
                {validation.isEligibleToFinalize ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base">
                  {validation.isEligibleToFinalize
                    ? 'كافة البيانات مكتملة ومستوفاة بنسبة 100%'
                    : `توجد بيانات ناقصة (${validation.missingItems.length} بيان متبقٍ)`}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {validation.isEligibleToFinalize
                    ? 'ملف أسرتك جاهز ومعتمد في منظومة حكر الجامع لتوزيع المساعدات والطرود.'
                    : 'يرجى الضغط على زر "استكمال البيانات الناقصة" لضمان إدراج أسرتك في كشوفات الاستحقاق.'}
                </p>
              </div>
            </div>

            <div className="text-left">
              <span className="font-mono text-xl font-black">{validation.completionPercentage}%</span>
              <span className="text-[11px] block text-slate-500">نسبة الاكتمال</span>
            </div>
          </div>

          {/* Missing items list if any */}
          {!validation.isEligibleToFinalize && (
            <div className="mt-4 pt-3 border-t border-amber-200">
              <h4 className="text-xs font-bold text-amber-900 mb-2">النواقص المطلوب استكمالها:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {validation.missingItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 bg-white/80 p-2 rounded-lg border border-amber-200 text-slate-800"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span className="font-semibold">{item.label}:</span>
                    <span className="text-slate-600 truncate">{item.message}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-left">
                <button
                  onClick={() => onEditFamily(family)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" />
                  إكمال هذه النواقص الآن
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Citizen's Life Events Hub (يحق للمواطن تعديل بياناته وإضافة مولود جديد، حالة زواج، أو حالة وفاة) */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl space-y-4 border border-slate-700/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  الخدمات العائلية والوقائع الحياتية (تحديثات الأسرة المستمرة)
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                يحق لك كرب أسرة إضافة أي مستجدات طارئة في ملفك فوراً (مواليد جدد، زواج، أو وفيات) لتعديل استحقاق الأسرة.
              </p>
            </div>

            <button
              onClick={() => onEditFamily(family)}
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-600 transition cursor-pointer shrink-0"
            >
              <Edit3 className="w-4 h-4 text-emerald-400" />
              <span>تعديل كافة بيانات الملف</span>
            </button>
          </div>

          {/* Quick Life Event Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Card 1: إضافة مولود جديد */}
            <button
              type="button"
              onClick={() => openLifeEvent('newborn')}
              className="p-4 rounded-2xl bg-slate-800/80 hover:bg-emerald-950/40 border border-slate-700 hover:border-emerald-500/60 transition group text-right cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
                  <Baby className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300">
                  زيادة أفراد الأسرة +1
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-white group-hover:text-emerald-300 transition">
                  إضافة مولود جديد 👶
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  تسجيل طفل رضيع جديد بالملف لزيادة حصة الطرود الإغاثية.
                </p>
              </div>
            </button>

            {/* Card 2: تسجيل واقعة زواج */}
            <button
              type="button"
              onClick={() => openLifeEvent('marriage')}
              className="p-4 rounded-2xl bg-slate-800/80 hover:bg-pink-950/40 border border-slate-700 hover:border-pink-500/60 transition group text-right cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center group-hover:scale-110 transition">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300">
                  تحديث الحالة الاجتماعية
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-white group-hover:text-pink-300 transition">
                  تسجيل واقعة زواج 💍
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  إضافة بيانات الزوجة وتعديل الوضع العائلي من أعزب إلى متزوج.
                </p>
              </div>
            </button>

            {/* Card 3: تسجيل حالة وفاة أو استشهاد */}
            <button
              type="button"
              onClick={() => openLifeEvent('death')}
              className="p-4 rounded-2xl bg-slate-800/80 hover:bg-amber-950/40 border border-slate-700 hover:border-amber-500/60 transition group text-right cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300">
                  شهداء ومفقودون
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-white group-hover:text-amber-300 transition">
                  تسجيل حالة وفاة 🕊️
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  توثيق استشهاد أو وفاة أحد أفراد الأسرة لتحديث القيود الرسمية.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Family Summary Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: Head & Spouse & Children */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Users className="w-4 h-4 text-emerald-600" />
              أفراد الأسرة المسجلون وبيانات المهنة
            </h3>

            <div className="space-y-3 text-xs">
              {/* عمل رب الأسرة */}
              <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-emerald-950 font-bold flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-emerald-700" />
                  عمل رب الأسرة / المهنة:
                </span>
                <span className="font-extrabold text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
                  {family.headOccupation || 'عامل يومي (أجر يومي)'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">الحالة الاجتماعية:</span>
                <span className="font-bold text-slate-800">{family.maritalStatus}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">تاريخ ميلاد رب الأسرة:</span>
                <span className="font-semibold text-slate-800">{family.headBirthDate || '-'}</span>
              </div>
              {family.wives && family.wives.length > 0 && (
                <div className="py-1 border-b border-slate-50">
                  <span className="text-slate-500 block mb-1">الزوجة:</span>
                  {family.wives.map((w, idx) => (
                    <div key={w.id || idx} className="bg-slate-50 p-2 rounded-lg font-semibold text-slate-800">
                      {w.name} (هوية: {w.idNumber})
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-slate-500">عدد الأطفال:</span>
                <span className="font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {family.childrenCount} أطفال
                </span>
              </div>

              {family.children && family.children.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-600 block flex items-center justify-between">
                    <span>قائمة الأبناء والتعليم:</span>
                    <span className="text-[10px] text-emerald-700">شامل التوجيهي والجامعات</span>
                  </span>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {family.children.map((c, i) => {
                      const isTawjihi = c.grade === 'توجيهي (ثانوية عامة)' || (c.isTawjihiOrUniversity && !c.isUniversityStudent && c.grade !== 'طالب جامعي');
                      const isUni = c.grade === 'طالب جامعي' || c.isUniversityStudent;

                      return (
                        <div key={c.id || i} className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-[11px] space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-800">{i + 1}. {c.name}</span>
                            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">{c.grade}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            هوية: {c.idNumber} | ميلاد: {c.birthDate}
                          </div>

                          {/* Tawjihi details */}
                          {isTawjihi && (
                            <div className="bg-amber-50 border border-amber-200 text-amber-900 px-2 py-1 rounded text-[10px] font-medium">
                              معدل الثانوية العامة (التوجيهي): <strong>{c.academicAverage || 'غير مسجل'}</strong>
                            </div>
                          )}

                          {/* University details */}
                          {isUni && (
                            <div className="bg-blue-50/70 border border-blue-200 text-blue-950 p-2 rounded-lg text-[10px] space-y-0.5">
                              <div><strong>الجامعة:</strong> {c.universityName || '-'} | <strong>التخصص:</strong> {c.universityMajor || '-'}</div>
                              <div><strong>المعدل:</strong> {c.universityGpa || '-'} | <strong>الفصل:</strong> {c.universitySemester || '-'}</div>
                              {c.hasAccumulatedFees && (
                                <div className="text-rose-700 font-bold pt-0.5 border-t border-blue-100">
                                  رسوم متراكمة لم يتم سدادها: {c.accumulatedFeesAmount || 'يوجد رسوم متراكمة'}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Box 2: Health, Location & Financial */}
          <div className="space-y-4">
            {/* Housing & Location */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Home className="w-4 h-4 text-emerald-600" />
                السكن والموقع الجغرافي
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">حالة الإقامة:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      family.residencyStatus === 'نازح'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {family.residencyStatus || 'مقيم'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">نوع وحالة السكن:</span>
                  <span className="font-bold text-slate-800">{family.housingType} ({family.housingCondition})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">المنطقة والحي:</span>
                  <span className="font-semibold text-slate-800">{family.area} - {family.neighborhood}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">أقرب معلم:</span>
                  <span className="font-bold text-emerald-900">{family.nearestLandmark}</span>
                </div>
              </div>
            </div>

            {/* War Impacts Card if any */}
            {(family.hasWarLoss || family.hasWarInjury) && (
              <div className="bg-red-50/70 border border-red-200 rounded-2xl p-5 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold text-red-900 flex items-center gap-2 border-b border-red-200 pb-2">
                  <ShieldAlert className="w-4 h-4 text-red-700" />
                  آثار الحرب (الشهداء، المفقودون، والإصابات)
                </h3>
                <div className="space-y-2 text-xs">
                  {family.hasWarLoss && (
                    <div className="bg-white p-2.5 rounded-xl border border-red-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-red-950">شهيد / مفقود:</span>
                        <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          {family.lostPersonStatus || 'شهيد'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">الاسم: </span>
                        <strong className="text-slate-900">{family.lostPersonName}</strong>
                        {family.lostPersonRelation && <span className="text-slate-500 mr-1">({family.lostPersonRelation})</span>}
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono">
                        تاريخ الاستشهاد / الفقد: {family.lostPersonDate || '-'}
                      </div>
                    </div>
                  )}

                  {family.hasWarInjury && (
                    <div className="bg-white p-2.5 rounded-xl border border-red-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-red-950">إصابة الحرب:</span>
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          مصاب
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">نوع الإصابة: </span>
                        <strong className="text-rose-900">{family.warInjuryType || family.warInjuryDetails}</strong>
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono">
                        تاريخ الإصابة: {family.warInjuryDate || '-'}
                      </div>
                      {family.warInjuryDetails && (
                        <div className="text-[11px] text-slate-600">
                          {family.warInjuryDetails}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Health & Wallet */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                الاتصال والمحفظة المالية
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">الجوال الأساسي:</span>
                  <span className="font-mono font-bold text-slate-800">{family.primaryPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">واتس اب المعتمد:</span>
                  <span className="font-mono font-bold text-emerald-700">{family.whatsappPhone}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100">
                  <span className="text-slate-500">المحفظة / الحساب:</span>
                  <span className="font-bold text-slate-800">{family.walletType} ({family.walletNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">اسم صاحب الحساب:</span>
                  <span className="font-semibold text-slate-800">{family.accountHolderName} ({family.accountHolderRelationship})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Change Password Modal */}
      {showPasswordChangeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <KeyRound className="w-4 h-4 text-emerald-600" />
              تغيير كلمة السر الخاصة بحسابك
            </h3>

            {passSuccess ? (
              <div className="bg-emerald-50 text-emerald-900 p-3 rounded-xl text-xs font-bold text-center">
                تم تغيير كلمة السر بنجاح!
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    أدخل كلمة السر الجديدة
                  </label>
                  <input
                    type="password"
                    placeholder="كلمة سر لا تقل عن 4 خانات"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-center font-mono text-sm"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    ستستخدم هذه الكلمة مع رقم هويتك للدخول في المرات القادمة.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordChangeModal(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition cursor-pointer"
                  >
                    حفظ كلمة السر
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Life Events Modal (مواليد جدد - زواج - وفيات) */}
      <LifeEventsModal
        isOpen={isLifeEventModalOpen}
        onClose={() => setIsLifeEventModalOpen(false)}
        family={family}
        initialType={lifeEventType}
        allFamilies={allFamilies}
        onSaveSuccess={(updatedFamily) => {
          if (onUpdateFamilyRecord) {
            onUpdateFamilyRecord(updatedFamily);
          }
        }}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 no-print">
        منظومة بيانات حكر الجامع - بوابة المواطن الشخصية
      </footer>

      {/* PWA Install & Share Modal */}
      <PWAInstallAndShareModal
        isOpen={showPwaModal}
        onClose={() => setShowPwaModal(false)}
      />
    </div>
  );
};

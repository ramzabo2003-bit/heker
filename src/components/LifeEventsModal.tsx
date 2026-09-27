import React, { useState } from 'react';
import { FamilyRecord, ChildRecord, WifeRecord, MaritalStatus } from '../types';
import { findDuplicateIdAnywhere, findDuplicateHeadId } from '../utils/duplicateCheck';
import { validateFamilyForm } from '../utils/validation';
import {
  Baby,
  Heart,
  Flame,
  X,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  ShieldAlert,
  Calendar,
  Sparkles,
  Info,
  Clock,
  HeartHandshake,
} from 'lucide-react';

export type LifeEventType = 'newborn' | 'marriage' | 'death';

interface LifeEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  family: FamilyRecord;
  initialType?: LifeEventType;
  allFamilies: FamilyRecord[];
  onSaveSuccess: (updatedFamily: FamilyRecord) => void;
}

export const LifeEventsModal: React.FC<LifeEventsModalProps> = ({
  isOpen,
  onClose,
  family,
  initialType = 'newborn',
  allFamilies,
  onSaveSuccess,
}) => {
  const [activeType, setActiveType] = useState<LifeEventType>(initialType);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 1. NEWBORN FORM STATE
  const [babyName, setBabyName] = useState('');
  const [babyGender, setBabyGender] = useState<'ذكر' | 'أنثى'>('ذكر');
  const [babyBirthDate, setBabyBirthDate] = useState(new Date().toISOString().split('T')[0]);
  const [babyIdNumber, setBabyIdNumber] = useState('');

  // 2. MARRIAGE FORM STATE
  const [wifeName, setWifeName] = useState('');
  const [wifeIdNumber, setWifeIdNumber] = useState('');
  const [wifeBirthDate, setWifeBirthDate] = useState('');
  const [marriageDate, setMarriageDate] = useState(new Date().toISOString().split('T')[0]);

  // 3. DEATH / MARTYR FORM STATE
  const [deceasedTarget, setDeceasedTarget] = useState<'child' | 'wife' | 'head' | 'other'>('child');
  const [selectedChildId, setSelectedChildId] = useState<string>(family.children?.[0]?.id || '');
  const [selectedWifeId, setSelectedWifeId] = useState<string>(family.wives?.[0]?.id || '');
  const [otherPersonName, setOtherPersonName] = useState('');
  const [otherPersonRelation, setOtherPersonRelation] = useState('ابن');
  const [deathStatus, setDeathStatus] = useState<'شهيد' | 'مفقود' | 'وفاة طبيعية'>('شهيد');
  const [deathDate, setDeathDate] = useState(new Date().toISOString().split('T')[0]);
  const [deathDetails, setDeathDetails] = useState('');

  if (!isOpen) return null;

  // Handle Newborn Submission
  const handleNewbornSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = babyName.trim();
    if (cleanName.split(/\s+/).length < 2) {
      setErrorMessage('يرجى إدخال اسم المولود ثنائياً أو ثلاثياً على الأقل.');
      return;
    }

    const cleanBabyId = babyIdNumber.trim().replace(/\D/g, '');
    if (cleanBabyId) {
      if (cleanBabyId.length !== 9) {
        setErrorMessage('رقم هوية المولود أو رقم السجل يجب أن يتكون من 9 أرقام.');
        return;
      }

      // Check anti-duplication
      const dupCheck = findDuplicateIdAnywhere(cleanBabyId, family.id, allFamilies);
      if (dupCheck.isDuplicate) {
        setErrorMessage(
          `⚠️ يمنع تكرار البيانات: رقم الهوية [${cleanBabyId}] مسجل مسبقاً في المنظومة لـ (${dupCheck.personName} - صفة: ${dupCheck.role}). يرجى التأكد من الرقم.`
        );
        return;
      }
    }

    const newChild: ChildRecord = {
      id: `child-${Date.now()}`,
      name: cleanName,
      idNumber: cleanBabyId || `TEMP-${Date.now().toString().slice(-6)}`,
      birthDate: babyBirthDate,
      gender: babyGender,
      grade: 'دون سن الدراسة (رضيع)',
    };

    const updatedChildren = [...(family.children || []), newChild];
    const dateStr = new Date().toISOString().split('T')[0];

    const draftRecord: FamilyRecord = {
      ...family,
      children: updatedChildren,
      childrenCount: updatedChildren.length,
      lastUpdated: dateStr,
      notes: family.notes
        ? `${family.notes}\n[تحديث]: تمت إضافة مولود جديد (${cleanName}) بتاريخ ${dateStr}`
        : `[تحديث]: تمت إضافة مولود جديد (${cleanName}) بتاريخ ${dateStr}`,
    };

    const isComplete = validateFamilyForm(draftRecord).isEligibleToFinalize;
    const updatedFamily: FamilyRecord = {
      ...draftRecord,
      status: isComplete ? 'مستوفي كامل البيانات' : 'يحتاج استكمال',
      needsCompletion: !isComplete,
    };

    onSaveSuccess(updatedFamily);
    setSuccessMessage(`مبارك ما رُزقتم! 👶 تم تسجيل المولود (${cleanName}) وتحديث كشف أفراد الأسرة وحصة الاستحقاق بنجاح.`);
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 2500);
  };

  // Handle Marriage Submission
  const handleMarriageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = wifeName.trim();
    if (cleanName.split(/\s+/).length < 2) {
      setErrorMessage('يرجى إدخال اسم الزوجة ثنائياً أو ثلاثياً على الأقل.');
      return;
    }

    const cleanId = wifeIdNumber.trim().replace(/\D/g, '');
    if (cleanId.length !== 9) {
      setErrorMessage('رقم هوية الزوجة يجب أن يتكون من 9 أرقام صحيحة.');
      return;
    }

    // Check anti-duplication
    const dupCheck = findDuplicateIdAnywhere(cleanId, family.id, allFamilies);
    if (dupCheck.isDuplicate) {
      setErrorMessage(
        `⚠️ يمنع تكرار البيانات: رقم الهوية [${cleanId}] مسجل مسبقاً في المنظومة لـ (${dupCheck.personName} - ${dupCheck.role}). يمنع تسجيل نفس الهوية مرتين.`
      );
      return;
    }

    const newWife: WifeRecord = {
      id: `wife-${Date.now()}`,
      name: cleanName,
      idNumber: cleanId,
      birthDate: wifeBirthDate,
    };

    const dateStr = new Date().toISOString().split('T')[0];
    const updatedWives = [...(family.wives || []), newWife];

    const draftRecord: FamilyRecord = {
      ...family,
      maritalStatus: 'متزوج',
      wives: updatedWives,
      lastUpdated: dateStr,
      notes: family.notes
        ? `${family.notes}\n[تحديث]: تم تسجيل واقعة زواج وإضافة الزوجة (${cleanName}) بتاريخ ${dateStr}`
        : `[تحديث]: تم تسجيل واقعة زواج وإضافة الزوجة (${cleanName}) بتاريخ ${dateStr}`,
    };

    const isComplete = validateFamilyForm(draftRecord).isEligibleToFinalize;
    const updatedFamily: FamilyRecord = {
      ...draftRecord,
      status: isComplete ? 'مستوفي كامل البيانات' : 'يحتاج استكمال',
      needsCompletion: !isComplete,
    };

    onSaveSuccess(updatedFamily);
    setSuccessMessage(`مبارك الزواج والبركة! 💍 تم توثيق واقعة الزواج وإضافة الزوجة (${cleanName}) وتحديث ملف الأسرة.`);
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 2500);
  };

  // Handle Death / Martyr Submission
  const handleDeathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    let lostName = '';
    let lostRelation = '';
    let updatedChildren = [...(family.children || [])];
    let updatedWives = [...(family.wives || [])];

    if (deceasedTarget === 'child') {
      const child = family.children.find((c) => c.id === selectedChildId);
      if (!child) {
        setErrorMessage('يرجى اختيار الابن/الابنة من القائمة.');
        return;
      }
      lostName = child.name;
      lostRelation = child.gender === 'أنثى' ? 'ابنة' : 'ابن';
      // respectfully remove from active children ration count or mark
      updatedChildren = updatedChildren.filter((c) => c.id !== selectedChildId);
    } else if (deceasedTarget === 'wife') {
      const wife = family.wives.find((w) => w.id === selectedWifeId);
      if (!wife) {
        setErrorMessage('يرجى اختيار الزوجة من القائمة.');
        return;
      }
      lostName = wife.name;
      lostRelation = 'زوجة';
      updatedWives = updatedWives.filter((w) => w.id !== selectedWifeId);
    } else if (deceasedTarget === 'head') {
      lostName = family.headName;
      lostRelation = 'رب الأسرة';
    } else {
      if (!otherPersonName.trim()) {
        setErrorMessage('يرجى كتابة اسم الفقيد كاملاً.');
        return;
      }
      lostName = otherPersonName.trim();
      lostRelation = otherPersonRelation;
    }

    const dateStr = new Date().toISOString().split('T')[0];

    const draftRecord: FamilyRecord = {
      ...family,
      children: updatedChildren,
      childrenCount: updatedChildren.length,
      wives: updatedWives,
      maritalStatus: updatedWives.length === 0 && family.maritalStatus === 'متزوج' ? 'أرمل' : family.maritalStatus,
      hasWarLoss: true,
      lostPersonName: lostName,
      lostPersonStatus: deathStatus === 'شهيد' ? 'شهيد' : deathStatus === 'مفقود' ? 'مفقود' : 'شهيد',
      lostPersonRelation: lostRelation,
      lostPersonDate: deathDate,
      lastUpdated: dateStr,
      notes: family.notes
        ? `${family.notes}\n[توثيق]: تسجيل واقعة (${deathStatus}: ${lostName} - صلة القرابة: ${lostRelation}) بتاريخ ${deathDate}. ${deathDetails}`
        : `[توثيق]: تسجيل واقعة (${deathStatus}: ${lostName} - صلة القرابة: ${lostRelation}) بتاريخ ${deathDate}. ${deathDetails}`,
    };

    const isComplete = validateFamilyForm(draftRecord).isEligibleToFinalize;
    const updatedFamily: FamilyRecord = {
      ...draftRecord,
      status: isComplete ? 'مستوفي كامل البيانات' : 'يحتاج استكمال',
      needsCompletion: !isComplete,
    };

    onSaveSuccess(updatedFamily);
    setSuccessMessage(
      `إنا لله وإنا إليه راجعون. 🕊️ رحم الله الفقيد/الشهيد (${lostName}) وجعل مثواه الجنة. تم تحديث البيانات بالمنظومة.`
    );
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-fadeIn my-6">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">تحديث الوقائع الأسرية والحياتية</h2>
              <p className="text-[11px] text-slate-300">
                ملف الأسرة: <strong>{family.headName}</strong> (كود: {family.id})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Prompt on Citizen's Right to update */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 p-3.5 text-xs text-emerald-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong>حق المواطن مكفول:</strong> يحق لرب الأسرة تحديث وتعديل بيانات ملفه وإضافة المستجدات فور حدوث أي
            (مولود جديد، واقعة زواج، أو حالة وفاة/استشهاد) لضمان دقة الكشوفات وتعديل الحصص الإغاثية.
          </p>
        </div>

        {/* Tab Switcher for 3 Life Events */}
        <div className="p-4 bg-slate-100/80 border-b border-slate-200 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveType('newborn');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeType === 'newborn'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Baby className="w-4 h-4" />
            <span>مولود جديد 👶</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveType('marriage');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeType === 'marriage'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-300" />
            <span>حالة زواج 💍</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveType('death');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeType === 'death'
                ? 'bg-slate-800 text-white shadow-md shadow-slate-800/30'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>حالة وفاة 🕊️</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-6">
          {/* Success Banner */}
          {successMessage && (
            <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <p className="font-bold leading-relaxed">{successMessage}</p>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 text-xs flex items-start gap-3 animate-fadeIn">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">{errorMessage}</p>
                <p className="text-[11px] text-rose-700">
                  نظام بيانات حكر الجامع يمنع تكرار الهويات والأسماء لحماية حقوق جميع المستفيدين.
                </p>
              </div>
            </div>
          )}

          {/* 1. NEWBORN FORM */}
          {activeType === 'newborn' && (
            <form onSubmit={handleNewbornSubmit} className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Baby className="w-4 h-4 text-emerald-600" />
                  تسجيل مولود جديد في كشف الأسرة
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  سيتم زيادة عدد أفراد الأسرة إلى {(family.childrenCount || 0) + 1} أفراد فور الحفظ.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اسم المولود الجديد <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: يوسف أحمد النجار"
                  value={babyName}
                  onChange={(e) => setBabyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  يرجى إدخال اسم الطفل ثلاثياً أو رباعياً مطابقاً لشهادة الميلاد.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الجنس <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={babyGender}
                    onChange={(e) => setBabyGender(e.target.value as 'ذكر' | 'أنثى')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-slate-50 cursor-pointer"
                  >
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    تاريخ الولادة <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={babyBirthDate}
                    onChange={(e) => setBabyBirthDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-slate-50 cursor-pointer"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم هوية المولود أو رقم إشعار الولادة (9 أرقام)
                </label>
                <input
                  type="text"
                  maxLength={9}
                  placeholder="مثال: 425123987"
                  value={babyIdNumber}
                  onChange={(e) => setBabyIdNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono tracking-wider focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  (يمنع تكرار رقم الهوية نهائياً عبر المنظومة). إذا لم يصدر له رقم بعد سيتم تخصيص كود مؤقت تلقائياً.
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition cursor-pointer flex items-center gap-2"
                >
                  <Baby className="w-4 h-4" />
                  <span>تأكيد إضافة المولود 👶</span>
                </button>
              </div>
            </form>
          )}

          {/* 2. MARRIAGE FORM */}
          {activeType === 'marriage' && (
            <form onSubmit={handleMarriageSubmit} className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-600" />
                  توثيق واقعة زواج جديدة وتحديث الحالة
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  الحالة الاجتماعية الحالية: <strong>{family.maritalStatus}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اسم الزوجة بالكامل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: منال محمود سليم خليل"
                  value={wifeName}
                  onChange={(e) => setWifeName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 bg-slate-50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    رقم هوية الزوجة (9 أرقام) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={9}
                    placeholder="901234567"
                    value={wifeIdNumber}
                    onChange={(e) => setWifeIdNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono tracking-wider focus:ring-2 focus:ring-pink-500 bg-slate-50"
                    required
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    يمنع تكرار رقم الهوية نهائياً.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    تاريخ ميلاد الزوجة <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={wifeBirthDate}
                    onChange={(e) => setWifeBirthDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 bg-slate-50 cursor-pointer"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  تاريخ عقد الزواج
                </label>
                <input
                  type="date"
                  value={marriageDate}
                  onChange={(e) => setMarriageDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 bg-slate-50 cursor-pointer"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-black shadow-lg shadow-pink-600/30 transition cursor-pointer flex items-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  <span>تثبيت واقعة الزواج 💍</span>
                </button>
              </div>
            </form>
          )}

          {/* 3. DEATH / MARTYR FORM */}
          {activeType === 'death' && (
            <form onSubmit={handleDeathSubmit} className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  توثيق واقعة وفاة أو استشهاد في الأسرة
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  رحم الله الشهداء والأموات. يرجى تحديد الشخص لتحديث القيود الرسمية وسجلات الدعم.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  المتوفى / الشهيد في الأسرة <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDeceasedTarget('child')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer transition ${
                      deceasedTarget === 'child'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    أحد الأبناء
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeceasedTarget('wife')}
                    disabled={!family.wives || family.wives.length === 0}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition ${
                      !family.wives || family.wives.length === 0
                        ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-200'
                        : deceasedTarget === 'wife'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm cursor-pointer'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 cursor-pointer'
                    }`}
                  >
                    الزوجة
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeceasedTarget('head')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer transition ${
                      deceasedTarget === 'head'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    رب الأسرة
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeceasedTarget('other')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer transition ${
                      deceasedTarget === 'other'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    فرد آخر / شهيد
                  </button>
                </div>
              </div>

              {/* Sub-selectors */}
              {deceasedTarget === 'child' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    اختر الابن / الابنة المتوفى:
                  </label>
                  {family.children && family.children.length > 0 ? (
                    <select
                      value={selectedChildId}
                      onChange={(e) => setSelectedChildId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-800 bg-slate-50 cursor-pointer"
                    >
                      {family.children.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} - (هوية: {c.idNumber || 'بدون'}) - {c.gender}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-xs text-rose-500">لا يوجد أبناء مسجلين بالملف.</p>
                  )}
                </div>
              )}

              {deceasedTarget === 'wife' && family.wives && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    اختر الزوجة المتوفاة:
                  </label>
                  <select
                    value={selectedWifeId}
                    onChange={(e) => setSelectedWifeId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-800 bg-slate-50 cursor-pointer"
                  >
                    {family.wives.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} - (هوية: {w.idNumber})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {deceasedTarget === 'other' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      اسم الشهيد / المتوفى <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="الاسم كاملاً"
                      value={otherPersonName}
                      onChange={(e) => setOtherPersonName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-800 bg-slate-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      صلة القرابة
                    </label>
                    <input
                      type="text"
                      placeholder="والد، والدة، أخ، أخت..."
                      value={otherPersonRelation}
                      onChange={(e) => setOtherPersonRelation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-800 bg-slate-50"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    صفة الوفاة <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={deathStatus}
                    onChange={(e) => setDeathStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-800 bg-slate-50 cursor-pointer"
                  >
                    <option value="شهيد">شهيد (قصف / عدوان)</option>
                    <option value="وفاة طبيعية">وفاة طبيعية</option>
                    <option value="مفقود">مفقود تحت الركام</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    تاريخ الوفاة أو الاستشهاد <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={deathDate}
                    onChange={(e) => setDeathDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-800 bg-slate-50 cursor-pointer"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  تفاصيل إضافية أو مكان الاستشهاد / الدفن
                </label>
                <textarea
                  rows={2}
                  placeholder="مكان الحدث أو سبب الاستشهاد..."
                  value={deathDetails}
                  onChange={(e) => setDeathDetails(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-slate-800 bg-slate-50"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-lg shadow-slate-900/30 transition cursor-pointer flex items-center gap-2"
                >
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>تأكيد تسجيل الحالة 🕊️</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

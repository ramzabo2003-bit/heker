import React, { useState, useEffect } from 'react';
import {
  FamilyRecord,
  ChildRecord,
  WifeRecord,
  MaritalStatus,
  HousingType,
  HousingCondition,
  WalletType,
  ResidencyStatus,
} from '../types';
import { validateFamilyForm } from '../utils/validation';
import { findDuplicateHeadId, findDuplicateHeadName, findDuplicateIdAnywhere } from '../utils/duplicateCheck';
import {
  User,
  Users,
  HeartPulse,
  Home,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Save,
  Printer,
  Sparkles,
  Phone,
  ArrowRight,
  FileCheck,
  GraduationCap,
  ShieldAlert,
  Briefcase,
} from 'lucide-react';

export const OCCUPATION_OPTIONS = [
  'عامل يومي (أجر يومي)',
  'عاطل عن العمل (بدون عمل حالياً)',
  'موظف حكومي (قطاع عام)',
  'موظف وكالة (الأونروا - UNRWA)',
  'موظف قطاع خاص / شركات',
  'مهني / صاحب حرفة (نجار، حداد، خياط، كهربائي، بناء)',
  'أعمال حرة / تجارة وتوزيع',
  'سائق (مركبة / شاحنة)',
  'مزارع / فلاح',
  'صياد أسماك',
  'متقاعد عن العمل',
  'طالب علم / جامعي',
  'غير قادر على العمل (مرض مزمن / إصابة / عجز)',
  'ربة منزل ومعيلة للأسرة',
];

interface RegistrationFormProps {
  initialData?: FamilyRecord | null;
  existingFamilies?: FamilyRecord[];
  onSaveSuccess: (savedRecord: FamilyRecord) => void;
  onCancel?: () => void;
  onPrintPreview?: (record: FamilyRecord) => void;
}

const DEFAULT_RECORD: Partial<FamilyRecord> = {
  headName: '',
  headIdNumber: '',
  headBirthDate: '',
  maritalStatus: 'متزوج',
  headOccupation: 'عامل يومي (أجر يومي)',
  residencyStatus: 'مقيم',
  wives: [
    {
      id: 'w-init',
      name: '',
      idNumber: '',
      birthDate: '',
    },
  ],
  childrenCount: 0,
  children: [],
  isHeadSick: false,
  illnessType: '',
  isChronic: false,
  chronicDetails: '',
  hasWarLoss: false,
  lostPersonName: '',
  lostPersonDate: '',
  lostPersonStatus: 'شهيد',
  lostPersonRelation: '',
  hasWarInjury: false,
  warInjuryType: '',
  warInjuryDate: '',
  warInjuryDetails: '',
  housingType: 'خيمة / مركز إيواء',
  housingCondition: 'صالح جزئياً',
  city: 'دير البلح',
  area: 'حكر الجامع',
  neighborhood: '',
  nearestLandmark: '',
  primaryPhone: '',
  secondaryPhone: '',
  whatsappPhone: '',
  walletType: 'محفظة بال باي (PalPay)',
  walletNumber: '',
  accountHolderName: '',
  accountHolderRelationship: 'رب الأسرة نفسه',
  status: 'معتمد',
  notes: '',
};

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  initialData,
  existingFamilies = [],
  onSaveSuccess,
  onCancel,
  onPrintPreview,
}) => {
  const draftStorageKey = initialData?.id
    ? `HKR_REG_DRAFT_${initialData.id}`
    : 'HKR_NEW_REG_DRAFT';

  const [formData, setFormData] = useState<Partial<FamilyRecord>>(() => {
    if (initialData) return initialData;
    try {
      const saved = localStorage.getItem('HKR_NEW_REG_DRAFT');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data) return parsed.data;
      }
    } catch {}
    return DEFAULT_RECORD;
  });

  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const key = initialData?.id ? `HKR_REG_DRAFT_${initialData.id}` : 'HKR_NEW_REG_DRAFT';
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.step === 'number' && parsed.step >= 1 && parsed.step <= 7) {
          return parsed.step;
        }
      }
    } catch {}
    return 1;
  });

  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [savedRecord, setSavedRecord] = useState<FamilyRecord | null>(null);

  // Anti-duplication check: Detect if head National ID or identical name is already registered
  const duplicateHeadIdFamily = findDuplicateHeadId(
    formData.headIdNumber || '',
    formData.id,
    existingFamilies
  );
  const duplicateHeadNameFamily = findDuplicateHeadName(
    formData.headName || '',
    formData.id,
    existingFamilies
  );

  // Validate form data on every change
  const validation = validateFamilyForm(formData);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Persist form draft & step so user never loses their position upon exit or refresh!
  useEffect(() => {
    try {
      localStorage.setItem(
        draftStorageKey,
        JSON.stringify({
          step: currentStep,
          data: formData,
        })
      );
    } catch {}
  }, [formData, currentStep, draftStorageKey]);

  // Adjust wives list based on marital status
  const handleMaritalStatusChange = (status: MaritalStatus) => {
    let updatedWives = formData.wives || [];
    if (status === 'متزوج' && (!updatedWives || updatedWives.length === 0)) {
      updatedWives = [{ id: 'w-' + Date.now(), name: '', idNumber: '', birthDate: '' }];
    } else if (status !== 'متزوج') {
      updatedWives = [];
    }
    setFormData((prev) => ({
      ...prev,
      maritalStatus: status,
      wives: updatedWives,
    }));
  };

  // Adjust children count and array
  const handleChildrenCountChange = (count: number) => {
    const validCount = Math.max(0, count);
    const existing = formData.children || [];
    let updatedChildren: ChildRecord[] = [...existing];

    if (validCount > existing.length) {
      // Add more children
      for (let i = existing.length; i < validCount; i++) {
        updatedChildren.push({
          id: 'child-' + Date.now() + '-' + i,
          name: '',
          idNumber: '',
          birthDate: '',
          gender: 'ذكر',
          grade: 'أول ابتدائي',
        });
      }
    } else if (validCount < existing.length) {
      // Trim
      updatedChildren = updatedChildren.slice(0, validCount);
    }

    setFormData((prev) => ({
      ...prev,
      childrenCount: validCount,
      children: updatedChildren,
    }));
  };

  const handleAddChild = () => {
    const newCount = (formData.childrenCount || 0) + 1;
    handleChildrenCountChange(newCount);
  };

  const handleRemoveChild = (index: number) => {
    const updated = (formData.children || []).filter((_, idx) => idx !== index);
    setFormData((prev) => ({
      ...prev,
      childrenCount: updated.length,
      children: updated,
    }));
  };

  const updateChild = (index: number, field: keyof ChildRecord, value: any) => {
    const updated = [...(formData.children || [])];
    if (updated[index]) {
      updated[index] = { ...updated[index], [field]: value };
      setFormData((prev) => ({ ...prev, children: updated }));
    }
  };

  const handleAddWife = () => {
    const current = formData.wives || [];
    const newWife: WifeRecord = {
      id: 'wife-' + Date.now(),
      name: '',
      idNumber: '',
      birthDate: '',
    };
    setFormData((prev) => ({ ...prev, wives: [...current, newWife] }));
  };

  const handleRemoveWife = (index: number) => {
    const current = formData.wives || [];
    const updated = current.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, wives: updated }));
  };

  const updateWife = (index: number, field: keyof WifeRecord, value: string) => {
    const current = [...(formData.wives || [])];
    if (current[index]) {
      current[index] = { ...current[index], [field]: value };
      setFormData((prev) => ({ ...prev, wives: current }));
    }
  };

  const handleFinalizeSubmission = () => {
    if (duplicateHeadIdFamily) {
      setCurrentStep(1);
      return;
    }

    if (!validation.isEligibleToFinalize) {
      // Jump to step 7 so they see missing items
      setCurrentStep(7);
      return;
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const isComplete = validation.isEligibleToFinalize;
    const computedStatus: FamilyRecord['status'] = isComplete ? 'مستوفي كامل البيانات' : 'يحتاج استكمال';

    const recordToSave: FamilyRecord = {
      id: formData.id || `HKR-2026-${Math.floor(100 + Math.random() * 900)}`,
      submissionDate: formData.submissionDate || dateStr,
      lastUpdated: dateStr,
      status: computedStatus,
      headName: formData.headName || '',
      headIdNumber: formData.headIdNumber || '',
      headBirthDate: formData.headBirthDate || '',
      maritalStatus: formData.maritalStatus || 'متزوج',
      headOccupation: formData.headOccupation || 'عامل يومي (أجر يومي)',
      residencyStatus: formData.residencyStatus || 'مقيم',
      wives: formData.wives || [],
      childrenCount: formData.childrenCount || 0,
      children: formData.children || [],
      isHeadSick: Boolean(formData.isHeadSick),
      illnessType: formData.illnessType || '',
      isChronic: Boolean(formData.isChronic),
      chronicDetails: formData.chronicDetails || '',
      hasWarLoss: Boolean(formData.hasWarLoss),
      lostPersonName: formData.lostPersonName || '',
      lostPersonStatus: formData.lostPersonStatus || 'شهيد',
      lostPersonRelation: formData.lostPersonRelation || '',
      lostPersonDate: formData.lostPersonDate || '',
      hasWarInjury: Boolean(formData.hasWarInjury),
      warInjuryType: formData.warInjuryType || '',
      warInjuryDate: formData.warInjuryDate || '',
      warInjuryDetails: formData.warInjuryDetails || '',
      housingType: formData.housingType || 'خيمة / مركز إيواء',
      housingCondition: formData.housingCondition || 'صالح جزئياً',
      city: formData.city || 'دير البلح',
      area: formData.area || 'حكر الجامع',
      neighborhood: formData.neighborhood || '',
      nearestLandmark: formData.nearestLandmark || '',
      primaryPhone: formData.primaryPhone || '',
      secondaryPhone: formData.secondaryPhone || '',
      whatsappPhone: formData.whatsappPhone || '',
      walletType: formData.walletType || 'محفظة بال باي (PalPay)',
      walletNumber: formData.walletNumber || '',
      accountHolderName: formData.accountHolderName || '',
      accountHolderRelationship: formData.accountHolderRelationship || 'رب الأسرة نفسه',
      notes: formData.notes || '',
      password: formData.password || '123456',
      isImportedFromExcel: formData.isImportedFromExcel,
      needsCompletion: !isComplete,
      importedAt: formData.importedAt,
    };

    try {
      localStorage.removeItem(draftStorageKey);
    } catch {}

    setSavedRecord(recordToSave);
    setShowSuccessModal(true);
    onSaveSuccess(recordToSave);
  };

  const stepsList = [
    { num: 1, title: 'رب الأسرة', icon: User },
    { num: 2, title: 'الزوجة', icon: Users },
    { num: 3, title: 'الأطفال والتعليم', icon: GraduationCap },
    { num: 4, title: 'الصحة وآثار الحرب', icon: HeartPulse },
    { num: 5, title: 'السكن والإقامة', icon: Home },
    { num: 6, title: 'الاتصال والمحفظة', icon: CreditCard },
    { num: 7, title: 'صلاحية الإنهاء', icon: validation.isEligibleToFinalize ? Unlock : Lock },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Completion & Eligibility Status Header */}
      <div className={`p-4 rounded-2xl border transition-all duration-300 ${
        validation.isEligibleToFinalize
          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm'
          : 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl ${
              validation.isEligibleToFinalize ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
            }`}>
              {validation.isEligibleToFinalize ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm md:text-base">
                  {validation.isEligibleToFinalize
                    ? 'صلاحية إنهاء التسجيل مفعلة ومتاحة الآن'
                    : 'صلاحية إنهاء التسجيل معلقة (يلزم استكمال كافة الحقول)'}
                </h3>
                <span className={`px-2 py-0.5 rounded-md text-xs font-black ${
                  validation.isEligibleToFinalize ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                }`}>
                  {validation.completionPercentage}% مكتمل
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {validation.isEligibleToFinalize
                  ? 'تم استيفاء جميع بيانات رب الأسرة، الزوجة، الأطفال، الوضع الصحي، السكن، والبيانات المالية بنجاح.'
                  : `يتبقى ${validation.missingItems.length} بيان إلزامي يجب إكماله لتفعيل زر "إنهاء التسجيل واعتماد الطلب".`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep(7)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 transition shadow-2xs text-slate-700 cursor-pointer"
            >
              فحص النواقص ({validation.missingItems.length})
            </button>
            <button
              onClick={handleFinalizeSubmission}
              disabled={!validation.isEligibleToFinalize}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                validation.isEligibleToFinalize
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer ring-2 ring-emerald-400/50'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              {validation.isEligibleToFinalize ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              إنهاء التسجيل والاعتماد
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              validation.isEligibleToFinalize ? 'bg-emerald-600' : 'bg-amber-500'
            }`}
            style={{ width: `${validation.completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps Navigator */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[650px] gap-1">
          {stepsList.map((step) => {
            const isCurrent = currentStep === step.num;
            const hasErrorsInStep = validation.missingItems.some((m) => m.stepIndex === step.num);
            const IconComponent = step.icon;

            return (
              <button
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isCurrent
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-emerald-400 text-slate-900'
                      : hasErrorsInStep
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {step.num}
                </div>
                <span>{step.title}</span>
                {hasErrorsInStep && step.num !== 7 && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Content by Step */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {/* STEP 1: بيانات رب الأسرة */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                الخطوة 1: بيانات رب الأسرة الأساسية
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                يرجى إدخال اسم رب الأسرة بالكامل ورقم الهوية المعتمد المكون من 9 أرقام.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اسم رب الأسرة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: أحمد محمود إسماعيل النجار"
                  value={formData.headName || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, headName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  يرجى إدخال الاسم ثلاثياً أو رباعياً على الأقل.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم الهوية (9 أرقام) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={9}
                  placeholder="902145876"
                  value={formData.headIdNumber || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setFormData((prev) => ({ ...prev, headIdNumber: val }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono tracking-wider focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  رقم الهوية الفلسطينية المكون من 9 أرقام.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  تاريخ الميلاد <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.headBirthDate || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, headBirthDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الحالة الاجتماعية <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.maritalStatus || 'متزوج'}
                  onChange={(e) => handleMaritalStatusChange(e.target.value as MaritalStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50 cursor-pointer"
                >
                  <option value="متزوج">متزوج</option>
                  <option value="أرمل">أرمل</option>
                  <option value="مطلق">مطلق</option>
                  <option value="أعزب">أعزب</option>
                  <option value="منفصل">منفصل</option>
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  إذا تم اختيار "متزوج" سيتم فتح خطوة تعبئة بيانات الزوجة.
                </span>
              </div>

              {/* اختيار ما هو عمل رب الأسرة */}
              <div className="col-span-1 md:col-span-2 p-4 rounded-2xl border border-slate-200 bg-emerald-50/30 space-y-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-700" />
                  <label className="block text-xs font-extrabold text-slate-900">
                    ما هو عمل رب الأسرة؟ / المهنة والوضع الوظيفي <span className="text-rose-500">*</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={
                      formData.headOccupation && !OCCUPATION_OPTIONS.includes(formData.headOccupation)
                        ? 'أخرى (يرجى التحديد)'
                        : formData.headOccupation || 'عامل يومي (أجر يومي)'
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'أخرى (يرجى التحديد)') {
                        setFormData((prev) => ({ ...prev, headOccupation: '' }));
                      } else {
                        setFormData((prev) => ({ ...prev, headOccupation: val }));
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
                  >
                    {OCCUPATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                    <option value="أخرى (يرجى التحديد)">أخرى (يرجى كتابة المهنة يدوياً)</option>
                  </select>

                  {(!formData.headOccupation || !OCCUPATION_OPTIONS.includes(formData.headOccupation)) && (
                    <input
                      type="text"
                      placeholder="يرجى كتابة عمل رب الأسرة هنا (مثال: نجار، حداد، تاجر)..."
                      value={formData.headOccupation || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, headOccupation: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                      required
                    />
                  )}
                </div>
                <span className="text-[11px] text-slate-500 block">
                  تحديد عمل رب الأسرة يساعد لجان الإغاثة والتوزيع في تقدير الاحتياج الاقتصادي وتوجيه المساعدات بدقة.
                </span>
              </div>

              {/* تحذيرات منع التكرار الصارمة */}
              {duplicateHeadIdFamily && (
                <div className="col-span-1 md:col-span-2 p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 text-rose-950 flex items-start gap-3 animate-fadeIn">
                  <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <p className="font-black text-sm text-rose-900">⚠️ يمنع تكرار البيانات منعاً باتاً:</p>
                    <p className="leading-relaxed font-semibold">
                      رقم الهوية <strong>[{formData.headIdNumber}]</strong> مسجل مسبقاً في المنظومة لرب الأسرة:{' '}
                      <strong className="underline">{duplicateHeadIdFamily.headName}</strong> (كود الملف:{' '}
                      <span className="font-mono text-rose-800">{duplicateHeadIdFamily.id}</span>).
                    </p>
                    <p className="text-[11px] text-rose-800 leading-relaxed">
                      يمنع النظام بشكل نهائي تسجيل نفس المواطن مرتين منعاً للازدواجية. يحق للمواطن المسجل الدخول برقم هويته
                      وتعديل بياناته أو إضافة المواليد وحالات الزواج والوفاة.
                    </p>
                  </div>
                </div>
              )}

              {duplicateHeadNameFamily && !duplicateHeadIdFamily && (
                <div className="col-span-1 md:col-span-2 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <p className="font-black text-sm text-amber-900">⚠️ تنبيه تكرار الاسم في المنظومة:</p>
                    <p className="leading-relaxed">
                      يوجد مواطن مسجل مسبقاً بنفس الاسم الرباعي بالكامل: <strong>{duplicateHeadNameFamily.headName}</strong>{' '}
                      (رقم الهوية: {duplicateHeadNameFamily.headIdNumber}).
                    </p>
                    <p className="text-[11px] text-amber-800">
                      يمنع تكرار الأسماء والسجلات لنفس الأسرة لضمان عدالة التوزيع. يرجى التأكد من رقم الهوية أو تعديل الملف السابق.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: بيانات الزوجة */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  الخطوة 2: بيانات الزوجة
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  الاسم الكامل للزوجة، رقم الهوية (9 أرقام) وتاريخ الميلاد.
                </p>
              </div>
              {formData.maritalStatus === 'متزوج' && (
                <button
                  type="button"
                  onClick={handleAddWife}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  إضافة زوجة أخرى
                </button>
              )}
            </div>

            {formData.maritalStatus !== 'متزوج' ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center space-y-2">
                <Users className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">لا يتطلب تسجيل زوجة</h4>
                <p className="text-xs text-slate-500">
                  الحالة الاجتماعية لرب الأسرة مسجلة بأنها ({formData.maritalStatus})، لذلك هذا القسم غير إلزامي.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {(formData.wives || []).map((wife, idx) => (
                  <div key={wife.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold text-slate-800">بيانات الزوجة رقم {idx + 1}</span>
                      {(formData.wives || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveWife(idx)}
                          className="text-rose-600 hover:text-rose-800 p-1 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          حذف
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          اسم الزوجة <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="الاسم الرباعي للزوجة"
                          value={wife.name || ''}
                          onChange={(e) => updateWife(idx, 'name', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          رقم هوية الزوجة (9 أرقام) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={9}
                          placeholder="904587123"
                          value={wife.idNumber || ''}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            updateWife(idx, 'idNumber', val);
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono tracking-wider focus:ring-2 focus:ring-emerald-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          تاريخ ميلاد الزوجة <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={wife.birthDate || ''}
                          onChange={(e) => updateWife(idx, 'birthDate', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: بيانات الأطفال والتعليم */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  الخطوة 3: عدد الأطفال وبياناتهم والصفوف الدراسية
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  تحديد عدد الأطفال وإدخال رقم هوية وتاريخ ميلاد وصف دراسي لكل طفل.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">عدد الأطفال:</span>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleChildrenCountChange((formData.childrenCount || 0) - 1)}
                    className="w-7 h-7 rounded-lg bg-white text-slate-700 font-bold flex items-center justify-center hover:bg-slate-200 transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-slate-900 text-sm">
                    {formData.childrenCount || 0}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleChildrenCountChange((formData.childrenCount || 0) + 1)}
                    className="w-7 h-7 rounded-lg bg-white text-slate-700 font-bold flex items-center justify-center hover:bg-slate-200 transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {Number(formData.childrenCount || 0) === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center space-y-3">
                <p className="text-sm font-bold text-slate-700">لا يوجد أطفال مسجلون (0 أطفال)</p>
                <p className="text-xs text-slate-500">
                  إذا كان لدى الأسرة أطفال، يرجى زيادة العدد بالضغط على زر (+) أعلاه أو زر "إضافة طفل".
                </p>
                <button
                  type="button"
                  onClick={handleAddChild}
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  إضافة طفل الآن
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {(formData.children || []).map((child, idx) => (
                  <div key={child.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px]">
                          {idx + 1}
                        </span>
                        بيانات الطفل رقم {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChild(idx)}
                        className="text-rose-600 hover:text-rose-800 p-1 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        حذف الطفل
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          اسم الطفل <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="الاسم"
                          value={child.name || ''}
                          onChange={(e) => updateChild(idx, 'name', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          رقم هوية الطفل <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={9}
                          placeholder="9 أرقام"
                          value={child.idNumber || ''}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            updateChild(idx, 'idNumber', val);
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono tracking-wider focus:ring-2 focus:ring-emerald-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          تاريخ ميلاد الطفل <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={child.birthDate || ''}
                          onChange={(e) => updateChild(idx, 'birthDate', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          الصف الدراسي <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={child.grade || 'أول ابتدائي'}
                          onChange={(e) => {
                            const val = e.target.value;
                            const isTawjihi = val === 'توجيهي (ثانوية عامة)';
                            const isUni = val === 'طالب جامعي';
                            updateChild(idx, 'grade', val);
                            if (isTawjihi) {
                              updateChild(idx, 'isTawjihiOrUniversity', true);
                              updateChild(idx, 'isUniversityStudent', false);
                            } else if (isUni) {
                              updateChild(idx, 'isTawjihiOrUniversity', true);
                              updateChild(idx, 'isUniversityStudent', true);
                            }
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
                        >
                          <option value="دون سن الدراسة (رضيع)">دون سن الدراسة (رضيع)</option>
                          <option value="روضة أطفال">روضة أطفال</option>
                          <option value="أول ابتدائي">أول ابتدائي</option>
                          <option value="ثاني ابتدائي">ثاني ابتدائي</option>
                          <option value="ثالث ابتدائي">ثالث ابتدائي</option>
                          <option value="رابع ابتدائي">رابع ابتدائي</option>
                          <option value="خامس ابتدائي">خامس ابتدائي</option>
                          <option value="سادس ابتدائي">سادس ابتدائي</option>
                          <option value="سابع أساسي">سابع أساسي</option>
                          <option value="ثامن أساسي">ثامن أساسي</option>
                          <option value="تاسع أساسي">تاسع أساسي</option>
                          <option value="عاشر (أول ثانوي)">عاشر (أول ثانوي)</option>
                          <option value="حادي عشر">حادي عشر</option>
                          <option value="توجيهي (ثانوية عامة)">توجيهي (ثانوية عامة)</option>
                          <option value="طالب جامعي">طالب جامعي</option>
                          <option value="خريج / غير ملتحق">خريج / غير ملتحق</option>
                        </select>
                      </div>
                    </div>

                    {/* خيار إضافي يدوي للتوجيهي أو الجامعة */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={
                            child.grade === 'توجيهي (ثانوية عامة)' ||
                            child.grade === 'طالب جامعي' ||
                            Boolean(child.isTawjihiOrUniversity)
                          }
                          onChange={(e) => {
                            const checked = e.target.checked;
                            updateChild(idx, 'isTawjihiOrUniversity', checked);
                            if (checked && child.grade !== 'توجيهي (ثانوية عامة)' && child.grade !== 'طالب جامعي') {
                              updateChild(idx, 'grade', 'طالب جامعي');
                              updateChild(idx, 'isUniversityStudent', true);
                            }
                          }}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="font-semibold text-slate-700">
                          هذا الابن/الابنة طالب في (التوجيهي أو الجامعة)
                        </span>
                      </label>

                      {(child.grade === 'توجيهي (ثانوية عامة)' ||
                        child.grade === 'طالب جامعي' ||
                        child.isTawjihiOrUniversity) && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              updateChild(idx, 'grade', 'توجيهي (ثانوية عامة)');
                              updateChild(idx, 'isTawjihiOrUniversity', true);
                              updateChild(idx, 'isUniversityStudent', false);
                            }}
                            className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                              child.grade === 'توجيهي (ثانوية عامة)' && !child.isUniversityStudent
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            توجيهي
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateChild(idx, 'grade', 'طالب جامعي');
                              updateChild(idx, 'isTawjihiOrUniversity', true);
                              updateChild(idx, 'isUniversityStudent', true);
                            }}
                            className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                              child.grade === 'طالب جامعي' || child.isUniversityStudent
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            جامعة
                          </button>
                        </div>
                      )}
                    </div>

                    {/* إذا كان في التوجيهي: يرجى تحديد المعدل */}
                    {(child.grade === 'توجيهي (ثانوية عامة)' ||
                      (child.isTawjihiOrUniversity && !child.isUniversityStudent)) && (
                      <div className="mt-2.5 p-3.5 bg-amber-50/90 border border-amber-300 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                            <GraduationCap className="w-4 h-4 text-amber-700" />
                            بيانات مرحلة التوجيهي (الثانوية العامة)
                          </span>
                          <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                            مطلوب تحديد المعدل
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              يرجى تحديد المعدل (أو المعدل المتوقع %) <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="مثال: 88.5% أو 92%"
                              value={child.academicAverage || ''}
                              onChange={(e) => updateChild(idx, 'academicAverage', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs font-bold focus:ring-2 focus:ring-amber-500 bg-white"
                            />
                            <span className="text-[10px] text-amber-800 mt-1 block">
                              أدخل النسبة المئوية التقريبية أو المعتمدة في كشف العلامات
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* إذا كان في الجامعة: تحديد المعدل الجامعي، الفصل الدراسي، التخصص، اسم الجامعة، والرسوم المتراكمة */}
                    {(child.grade === 'طالب جامعي' || Boolean(child.isUniversityStudent)) && (
                      <div className="mt-2.5 p-4 bg-blue-50/90 border border-blue-300 rounded-xl space-y-3">
                        <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                          <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                            <GraduationCap className="w-4 h-4 text-blue-700" />
                            بيانات الطالب الجامعي والرسوم الدراسية
                          </span>
                          <span className="text-[11px] bg-blue-200 text-blue-900 font-bold px-2.5 py-0.5 rounded-full">
                            تعليم جامعي
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          {/* اسم الجامعة */}
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              اسم الجامعة <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              list={`universities-${idx}`}
                              placeholder="مثال: جامعة الأقصى، الإسلامية..."
                              value={child.universityName || ''}
                              onChange={(e) => updateChild(idx, 'universityName', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-blue-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                            <datalist id={`universities-${idx}`}>
                              <option value="جامعة الأقصى" />
                              <option value="الجامعة الإسلامية بغزة" />
                              <option value="جامعة الأزهر - غزة" />
                              <option value="جامعة القدس المفتوحة" />
                              <option value="جامعة فلسطين" />
                              <option value="الكلية الجامعية للعلوم التطبيقية (UCAS)" />
                              <option value="جامعة الإسراء" />
                              <option value="جامعة غزة" />
                              <option value="كلية فلسطين التقنية - دير البلح" />
                            </datalist>
                          </div>

                          {/* التخصص */}
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              التخصص <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="مثال: تمريض، هندسة برمجيات، محاسبة..."
                              value={child.universityMajor || ''}
                              onChange={(e) => updateChild(idx, 'universityMajor', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-blue-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                          </div>

                          {/* تحديد المعدل الجامعي */}
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              تحديد المعدل الجامعي <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="مثال: 85.5% أو 3.5 من 4"
                              value={child.universityGpa || ''}
                              onChange={(e) => updateChild(idx, 'universityGpa', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-blue-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                          </div>

                          {/* تحديد الفصل الدراسي */}
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              تحديد الفصل الدراسي <span className="text-rose-500">*</span>
                            </label>
                            <select
                              value={child.universitySemester || 'الفصل الأول - سنة أولى'}
                              onChange={(e) => updateChild(idx, 'universitySemester', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-blue-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                            >
                              <option value="الفصل الأول - سنة أولى">الفصل الأول - سنة أولى</option>
                              <option value="الفصل الثاني - سنة أولى">الفصل الثاني - سنة أولى</option>
                              <option value="الفصل الأول - سنة ثانية">الفصل الأول - سنة ثانية</option>
                              <option value="الفصل الثاني - سنة ثانية">الفصل الثاني - سنة ثانية</option>
                              <option value="الفصل الأول - سنة ثالثة">الفصل الأول - سنة ثالثة</option>
                              <option value="الفصل الثاني - سنة ثالثة">الفصل الثاني - سنة ثالثة</option>
                              <option value="الفصل الأول - سنة رابعة">الفصل الأول - سنة رابعة</option>
                              <option value="الفصل الثاني - سنة رابعة (تخرج)">الفصل الثاني - سنة رابعة (تخرج)</option>
                              <option value="الفصل الخامس / امتياز">الفصل الخامس / امتياز</option>
                              <option value="فصل صيفي">فصل صيفي</option>
                            </select>
                          </div>
                        </div>

                        {/* رسوم متراكمة */}
                        <div className="pt-2.5 border-t border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-800 text-xs">
                              إذا كان يوجد رسوم متراكمة لم تستطع سدادها:
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => updateChild(idx, 'hasAccumulatedFees', true)}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                  child.hasAccumulatedFees
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-white border border-slate-300 text-slate-700'
                                }`}
                              >
                                نعم، يوجد رسوم متراكمة
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  updateChild(idx, 'hasAccumulatedFees', false);
                                  updateChild(idx, 'accumulatedFeesAmount', '');
                                }}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                  !child.hasAccumulatedFees
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white border border-slate-300 text-slate-700'
                                }`}
                              >
                                لا يوجد
                              </button>
                            </div>
                          </div>

                          {child.hasAccumulatedFees && (
                            <div className="flex items-center gap-2">
                              <label className="text-xs font-bold text-rose-800 shrink-0">
                                كم المبلغ المتراكم؟ <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="مثال: 1800 شيكل أو 450 دينار"
                                value={child.accumulatedFeesAmount || ''}
                                onChange={(e) => updateChild(idx, 'accumulatedFeesAmount', e.target.value)}
                                className="w-52 px-3 py-1.5 rounded-lg border border-rose-300 text-xs font-bold focus:ring-2 focus:ring-rose-500 bg-white"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddChild}
                  className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:text-emerald-700 hover:border-emerald-400 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  إضافة طفل آخر للقائمة
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: الوضع الصحي وإصابات الحرب */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-emerald-600" />
                الخطوة 4: الوضع الصحي وإصابات الحرب لرب الأسرة
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                تحديد هل رب الأسرة مريض (ونوع المرض)، الأمراض المزمنة، وتفاصيل إصابات الحرب إن وجدت.
              </p>
            </div>

            <div className="space-y-5">
              {/* Question 1: هل رب الاسرة مريض */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    هل رب الأسرة مريض؟ <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, isHeadSick: true }))}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                        formData.isHeadSick
                          ? 'bg-rose-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-700'
                      }`}
                    >
                      نعم (مريض)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          isHeadSick: false,
                          illnessType: '',
                        }))
                      }
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                        !formData.isHeadSick
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-700'
                      }`}
                    >
                      لا (سليم)
                    </button>
                  </div>
                </div>

                {formData.isHeadSick && (
                  <div className="pt-2 border-t border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      يرجى تحديد نوع المرض بدقة <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: انزلاق غضروفي حاد، ضعف نظر شديد، التهاب مفاصل روماتويدي"
                      value={formData.illnessType || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, illnessType: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Question 2: مزمن */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    هل يعاني من مرض مزمن؟ (ضغط، سكري، قلب، كلى، أورام...) <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, isChronic: true }))}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                        formData.isChronic
                          ? 'bg-rose-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-700'
                      }`}
                    >
                      نعم (مرض مزمن)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          isChronic: false,
                          chronicDetails: '',
                        }))
                      }
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                        !formData.isChronic
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-700'
                      }`}
                    >
                      لا
                    </button>
                  </div>
                </div>

                {formData.isChronic && (
                  <div className="pt-2 border-t border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      تفاصيل المرض المزمن والعلاج الدوري <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: سكري وضغط دم مزمن - بحاجة لأنسولين شهري"
                      value={formData.chronicDetails || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, chronicDetails: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Question 3: هل فقدت أحد أفراد العائلة خلال الحرب */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">
                      هل فقدت أحد أفراد العائلة خلال الحرب؟ <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-500">
                      تسجيل الشهداء والمفقودين لتوثيق حقوق الأسرة والتدخلات الإغاثية
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, hasWarLoss: true }))}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                        formData.hasWarLoss
                          ? 'bg-rose-700 text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-700'
                      }`}
                    >
                      نعم (شهيد / مفقود)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          hasWarLoss: false,
                          lostPersonName: '',
                          lostPersonDate: '',
                          lostPersonRelation: '',
                        }))
                      }
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                        !formData.hasWarLoss
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-700'
                      }`}
                    >
                      لا
                    </button>
                  </div>
                </div>

                {formData.hasWarLoss && (
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          اسم الشهيد او المفقود <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="الاسم ثلاثياً أو رباعياً"
                          value={formData.lostPersonName || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, lostPersonName: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-rose-300 text-sm focus:ring-2 focus:ring-rose-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          الصفة <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.lostPersonStatus || 'شهيد'}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, lostPersonStatus: e.target.value as 'شهيد' | 'مفقود' }))
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 bg-white cursor-pointer"
                        >
                          <option value="شهيد">شهيد</option>
                          <option value="مفقود">مفقود</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          تاريخ الاستشهاد او الفقد <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={formData.lostPersonDate || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, lostPersonDate: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-rose-300 text-sm focus:ring-2 focus:ring-rose-500 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        صلة القرابة برب الأسرة
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: ابن، ابنة، والد، والدة، زوج، زوجة، شقيق..."
                        value={formData.lostPersonRelation || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, lostPersonRelation: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Question 4: هل تعرضت لإصابة خلال الحرب */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">
                      هل تعرضت لاصابة خلال الحرب؟ <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-500">
                      تشمل إصابات رب الأسرة أو أفراد العائلة جراء القصف أو الشظايا
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, hasWarInjury: true }))}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                        formData.hasWarInjury
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-700'
                      }`}
                    >
                      نعم (يوجد إصابة حرب)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          hasWarInjury: false,
                          warInjuryType: '',
                          warInjuryDate: '',
                          warInjuryDetails: '',
                        }))
                      }
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                        !formData.hasWarInjury
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-700'
                      }`}
                    >
                      لا يوجد إصابة
                    </button>
                  </div>
                </div>

                {formData.hasWarInjury && (
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          نوع الاصابة <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="مثال: شظايا بالساق، كسر مضاعف، بتر جزئي، حروق، فقد سمع..."
                          value={formData.warInjuryType || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, warInjuryType: e.target.value }))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-red-300 text-sm focus:ring-2 focus:ring-red-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          تاريخ الاصابة <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={formData.warInjuryDate || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, warInjuryDate: e.target.value }))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-red-300 text-sm focus:ring-2 focus:ring-red-500 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        تفاصيل إضافية عن الإصابة ونسبة العجز إن وجدت
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: عجز حركي 30%، بحاجة لعملية جراحية ومتابعة علاج طبيعي"
                        value={formData.warInjuryDetails || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, warInjuryDetails: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: نوع السكن وحالته والعنوان وحالة الإقامة */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Home className="w-5 h-5 text-emerald-600" />
                الخطوة 5: بيانات السكن والموقع الجغرافي وحالة الإقامة
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                تحديد حالة الإقامة (مقيم أو نازح)، نوع السكن وحالته، والمدينة والمنطقة والحي وأقرب معلم معروف.
              </p>
            </div>

            {/* حالة الإقامة: مقيم أو نازح */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                حالة الإقامة <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, residencyStatus: 'مقيم' }))}
                  className={`p-3.5 rounded-xl border text-right transition cursor-pointer flex items-center justify-between ${
                    formData.residencyStatus === 'مقيم'
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/50 shadow-xs'
                      : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">مقيم</span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      من سكان المنطقة الأصليين داخل حكر الجامع / دير البلح
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 ${
                      formData.residencyStatus === 'مقيم'
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {formData.residencyStatus === 'مقيم' && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, residencyStatus: 'نازح' }))}
                  className={`p-3.5 rounded-xl border text-right transition cursor-pointer flex items-center justify-between ${
                    formData.residencyStatus === 'نازح'
                      ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/50 shadow-xs'
                      : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">نازح</span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      نازح من مناطق أخرى داخل قطاع غزة ومقيم حالياً في حكر الجامع
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 ${
                      formData.residencyStatus === 'نازح'
                        ? 'border-amber-600 bg-amber-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {formData.residencyStatus === 'نازح' && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  نوع السكن <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.housingType || 'خيمة / مركز إيواء'}
                  onChange={(e) => setFormData((prev) => ({ ...prev, housingType: e.target.value as HousingType }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 cursor-pointer"
                >
                  <option value="خيمة / مركز إيواء">خيمة / مركز إيواء</option>
                  <option value="إيجار">إيجار</option>
                  <option value="ملك">ملك</option>
                  <option value="كرفان">كرفان</option>
                  <option value="استضافة لدى أقارب">استضافة لدى أقارب</option>
                  <option value="منزل متضرر جزئياً">منزل متضرر جزئياً</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  حالة السكن <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.housingCondition || 'صالح جزئياً'}
                  onChange={(e) => setFormData((prev) => ({ ...prev, housingCondition: e.target.value as HousingCondition }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 cursor-pointer"
                >
                  <option value="صالح للسكن">صالح للسكن</option>
                  <option value="صالح جزئياً">صالح جزئياً</option>
                  <option value="غير صالح للسكن">غير صالح للسكن</option>
                  <option value="مدمر كلياً">مدمر كلياً</option>
                  <option value="مدمر جزئياً">مدمر جزئياً</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  المدينة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: دير البلح"
                  value={formData.city || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  المنطقة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: حكر الجامع"
                  value={formData.area || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, area: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الحي <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: حي السلام / حارة القدايحة / شارع البيئة"
                  value={formData.neighborhood || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, neighborhood: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  أقرب معلم معروف <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: مسجد حكر الجامع الكبير / صيدلية النور / مدرسة دير البلح"
                  value={formData.nearestLandmark || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nearestLandmark: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  ضروري جداً لتحديد مكان الأسرة بدقة عند توزيع المساعدات.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: الاتصال والمحفظة المالية */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                الخطوة 6: بيانات الاتصال والمحفظة المالية والبنكية
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                أرقام الجوالات والواتساب، بالإضافة إلى تفاصيل المحفظة الرقمية أو الحساب البنكي لاستلام المساعدات النقدية.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم جوال أساسي <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: 0599123456"
                  value={formData.primaryPhone || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d+]/g, '');
                    setFormData((prev) => ({ ...prev, primaryPhone: val }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono tracking-wider focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم جوال بديل (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="مثال: 0569874123"
                  value={formData.secondaryPhone || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d+]/g, '');
                    setFormData((prev) => ({ ...prev, secondaryPhone: val }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono tracking-wider focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم واتس اب نشط <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: 0599123456"
                  value={formData.whatsappPhone || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d+]/g, '');
                    setFormData((prev) => ({ ...prev, whatsappPhone: val }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono tracking-wider focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 mb-3">بيانات الحساب المالي / المحفظة الإلكترونية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    نوع المحفظة أو الحساب <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.walletType || 'محفظة بال باي (PalPay)'}
                    onChange={(e) => setFormData((prev) => ({ ...prev, walletType: e.target.value as WalletType }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 cursor-pointer"
                  >
                    <option value="محفظة بال باي (PalPay)">محفظة بال باي (PalPay)</option>
                    <option value="محفظة جوال بي (Jawwal Pay)">محفظة جوال بي (Jawwal Pay)</option>
                    <option value="حساب بنك فلسطين">حساب بنك فلسطين</option>
                    <option value="محفظة كاش كابيتال">محفظة كاش كابيتال</option>
                    <option value="حساب بنكي آخر">حساب بنكي آخر</option>
                    <option value="لا يوجد محفظة">لا يوجد محفظة حالياً</option>
                  </select>
                </div>

                {formData.walletType !== 'لا يوجد محفظة' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        رقم محفظة بال باي او جوال بي او بنك فلسطين <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="رقم المحفظة أو رقم الحساب"
                        value={formData.walletNumber || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, walletNumber: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono tracking-wider focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        اسم صاحب الحساب <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="الاسم المسجل رسمياً لدى البنك / المحفظة"
                        value={formData.accountHolderName || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, accountHolderName: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        صلة القرابة بصاحب الحساب <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: رب الأسرة نفسه / الزوجة / الابن الأكبر / شقيق"
                        value={formData.accountHolderRelationship || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, accountHolderRelationship: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ملاحظات إضافية خاصة بالأسرة (اختياري)
              </label>
              <textarea
                rows={2}
                placeholder="أي معلومات أخرى ترغب في إضافتها إلى ملف الأسرة..."
                value={formData.notes || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-emerald-950">
                كلمة سر ملف الأسرة (لدخول المواطن برقم الهوية لاحقاً واستكمال البيانات)
              </label>
              <input
                type="text"
                placeholder="مثال: 123456 أو كلمة سر من اختيارك"
                value={formData.password || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-emerald-700 block">
                تُستخدم هذه الكلمة مع رقم هوية رب الأسرة لتسجيل دخول المواطن في أي وقت والتعديل أو استكمال النواقص (إن تُركت فارغة ستكون 123456 تلقائياً).
              </span>
            </div>
          </div>
        )}

        {/* STEP 7: مدقق الصلاحية والمراجعة النهائية قبل الانتقال لإنهاء التسجيل */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                الخطوة 7: مدقق صلاحية إتمام التسجيل والمراجعة الشاملة
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                وفقاً للتعليمات والضوابط، لا يتم منح صلاحية إنهاء التسجيل إلا بعد التأكد من اكتمال كافة البيانات الإلزامية بنسبة 100%.
              </p>
            </div>

            {/* Validation Outcome Banner */}
            {validation.isEligibleToFinalize ? (
              <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black text-emerald-950">
                  تهانينا! تم التحقق من استيفاء كافة البيانات بنجاح
                </h3>
                <p className="text-xs text-emerald-800 max-w-lg mx-auto leading-relaxed">
                  تم منح صلاحية إنهاء التسجيل الرسمي الآن. يمكنك الضغط على زر "إنهاء التسجيل واعتماد الطلب" لحفظ الملف وإصدار بطاقة التسجيل الرسمية.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleFinalizeSubmission}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 cursor-pointer ring-4 ring-emerald-200"
                  >
                    <Unlock className="w-5 h-5" />
                    إنهاء التسجيل واعتماد الأسرة رسمياً
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-500 text-white rounded-xl">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-amber-950">
                      صلاحية إنهاء التسجيل معلقة - بيانات ناقصة
                    </h3>
                    <p className="text-xs text-amber-800 mt-1">
                      المنظومة تتطلب إدخال كافة الحقول الإلزامية قبل السماح بإنهاء التسجيل. يرجى الضغط على أي حقل ناقص أدناه للانتقال إليه مباشرة وإكماله:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {validation.missingItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between gap-3 text-xs shadow-2xs hover:border-amber-400 transition"
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 block">{item.label}</span>
                          <span className="text-[11px] text-slate-500">{item.message}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(item.stepIndex)}
                        className="shrink-0 px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold text-[11px] transition cursor-pointer"
                      >
                        إكمال الحقل
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick summary of entered data */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-800">ملخص سريع للبيانات المدخلة:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">حالة الإقامة</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-black ${
                    formData.residencyStatus === 'نازح' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {formData.residencyStatus || 'مقيم'}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">رب الأسرة</span>
                  <span className="font-bold text-slate-800">{formData.headName || 'غير مكتمل'}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">رقم الهوية</span>
                  <span className="font-mono font-bold text-slate-800">{formData.headIdNumber || 'غير مكتمل'}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">عدد الأبناء</span>
                  <span className="font-bold text-emerald-800">{formData.childrenCount}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">شهداء أو مفقودين</span>
                  <span className="font-bold text-slate-800">
                    {formData.hasWarLoss ? `نعم: ${formData.lostPersonName}` : 'لا يوجد'}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">إصابات الحرب</span>
                  <span className="font-bold text-slate-800">
                    {formData.hasWarInjury ? `نعم: ${formData.warInjuryType}` : 'لا يوجد'}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">نوع وحالة السكن</span>
                  <span className="font-bold text-slate-800">{formData.housingType}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">المنطقة والحي</span>
                  <span className="font-semibold text-slate-800">{formData.area} - {formData.neighborhood || '-'}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">أقرب معلم</span>
                  <span className="font-semibold text-slate-800">{formData.nearestLandmark || 'غير مكتمل'}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">الجوال والواتساب</span>
                  <span className="font-mono text-slate-800">{formData.primaryPhone || '-'}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">المحفظة / الحساب</span>
                  <span className="font-semibold text-slate-800">{formData.walletType}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                الخطوة السابقة
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                إلغاء
              </button>
            )}

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={Boolean(currentStep === 1 && duplicateHeadIdFamily)}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs ${
                  currentStep === 1 && duplicateHeadIdFamily
                    ? 'bg-rose-100 text-rose-400 cursor-not-allowed border border-rose-200'
                    : 'text-white bg-slate-900 hover:bg-slate-800 cursor-pointer'
                }`}
              >
                {currentStep === 1 && duplicateHeadIdFamily ? '⚠️ الهوية مسجلة مسبقاً (ممنوع التكرار)' : 'متابعة الخطوة التالية'}
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalizeSubmission}
                disabled={!validation.isEligibleToFinalize}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer ${
                  validation.isEligibleToFinalize
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer ring-2 ring-emerald-400/50'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                }`}
              >
                {validation.isEligibleToFinalize ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                إنهاء التسجيل واعتماد البيانات
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal upon Completion */}
      {showSuccessModal && savedRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-center border border-slate-200 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">تم إتمام واعتماد التسجيل بنجاح</h3>
              <p className="text-xs text-slate-500 mt-1">
                تم حفظ بيانات الأسرة بالكامل في قاعدة بيانات منظومة حكر الجامع.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2 text-right">
              <div className="flex justify-between">
                <span className="text-slate-500">رقم الملف المعتمد:</span>
                <span className="font-mono font-bold text-emerald-800 text-sm">{savedRecord.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">اسم رب الأسرة:</span>
                <span className="font-bold text-slate-800">{savedRecord.headName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">رقم الهوية:</span>
                <span className="font-mono font-bold text-slate-800">{savedRecord.headIdNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">إجمالي الأفراد:</span>
                <span className="font-semibold text-slate-800">
                  {1 + (savedRecord.wives?.length || 0) + (savedRecord.childrenCount || 0)} فرد
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              {onPrintPreview && (
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    onPrintPreview(savedRecord);
                  }}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  طباعة استمارة الأسرة
                </button>
              )}
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  if (onCancel) onCancel();
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                الانتقال لجدول البيانات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

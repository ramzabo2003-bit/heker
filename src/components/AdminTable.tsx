import React, { useState, useMemo } from 'react';
import { FamilyRecord } from '../types';
import { ExcelImportModal } from './ExcelImportModal';
import { isFamilyRecordComplete } from '../utils/validation';
import {
  Search,
  Filter,
  Printer,
  Download,
  Plus,
  Eye,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  AlertTriangle,
  HeartPulse,
  Home,
  CreditCard,
  Users,
  CheckCircle2,
  RefreshCw,
  UploadCloud,
  FileCheck,
} from 'lucide-react';

interface AdminTableProps {
  families: FamilyRecord[];
  onAddNew: () => void;
  onEdit: (family: FamilyRecord) => void;
  onView: (family: FamilyRecord) => void;
  onPrint: (family: FamilyRecord) => void;
  onDelete: (id: string) => void;
  userRole: 'admin' | 'supervisor' | 'citizen';
  onImportSuccess?: (importedFamilies: FamilyRecord[]) => void;
}

export const AdminTable: React.FC<AdminTableProps> = ({
  families,
  onAddNew,
  onEdit,
  onView,
  onPrint,
  onDelete,
  userRole,
  onImportSuccess,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResidency, setFilterResidency] = useState('ALL');
  const [filterHousing, setFilterHousing] = useState('ALL');
  const [filterHealth, setFilterHealth] = useState('ALL');
  const [filterWarLoss, setFilterWarLoss] = useState('ALL');
  const [filterEducation, setFilterEducation] = useState('ALL');
  const [filterMarital, setFilterMarital] = useState('ALL');
  const [filterRecordStatus, setFilterRecordStatus] = useState('ALL');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Filtered families
  const filteredFamilies = useMemo(() => {
    return families.filter((f) => {
      // Search matching
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        f.headName.toLowerCase().includes(term) ||
        f.headIdNumber.includes(term) ||
        f.id.toLowerCase().includes(term) ||
        f.primaryPhone.includes(term) ||
        (f.secondaryPhone && f.secondaryPhone.includes(term)) ||
        f.nearestLandmark.toLowerCase().includes(term) ||
        f.neighborhood.toLowerCase().includes(term) ||
        (f.lostPersonName && f.lostPersonName.toLowerCase().includes(term)) ||
        (f.warInjuryType && f.warInjuryType.toLowerCase().includes(term)) ||
        f.wives.some((w) => w.name.toLowerCase().includes(term) || w.idNumber.includes(term)) ||
        f.children.some(
          (c) =>
            c.name.toLowerCase().includes(term) ||
            c.idNumber.includes(term) ||
            (c.universityName && c.universityName.toLowerCase().includes(term)) ||
            (c.universityMajor && c.universityMajor.toLowerCase().includes(term))
        );

      // Residency filter
      const matchesResidency = filterResidency === 'ALL' || f.residencyStatus === filterResidency;

      // Housing filter
      const matchesHousing = filterHousing === 'ALL' || f.housingType === filterHousing;

      // Health filter
      let matchesHealth = true;
      if (filterHealth === 'SICK') matchesHealth = f.isHeadSick;
      else if (filterHealth === 'CHRONIC') matchesHealth = f.isChronic;
      else if (filterHealth === 'WAR_INJURY') matchesHealth = f.hasWarInjury;

      // War loss filter
      const matchesWarLoss = filterWarLoss === 'ALL' || (filterWarLoss === 'HAS_LOSS' && f.hasWarLoss);

      // Education filter
      let matchesEducation = true;
      if (filterEducation === 'TAWJIHI') {
        matchesEducation = f.children.some((c) => c.grade === 'توجيهي (ثانوية عامة)' || c.isTawjihiOrUniversity);
      } else if (filterEducation === 'UNIVERSITY') {
        matchesEducation = f.children.some((c) => c.grade === 'طالب جامعي' || c.isUniversityStudent);
      } else if (filterEducation === 'ACCUMULATED_FEES') {
        matchesEducation = f.children.some((c) => c.hasAccumulatedFees);
      }

      // Marital filter
      const matchesMarital = filterMarital === 'ALL' || f.maritalStatus === filterMarital;

      // Record status filter (مستوفي كامل البيانات vs يحتاج استكمال)
      let matchesStatus = true;
      if (filterRecordStatus === 'COMPLETE') {
        matchesStatus = isFamilyRecordComplete(f);
      } else if (filterRecordStatus === 'IMPORTED') {
        matchesStatus = Boolean(f.isImportedFromExcel);
      } else if (filterRecordStatus === 'NEEDS_COMPLETION') {
        matchesStatus = !isFamilyRecordComplete(f);
      }

      return (
        matchesSearch &&
        matchesResidency &&
        matchesHousing &&
        matchesHealth &&
        matchesWarLoss &&
        matchesEducation &&
        matchesMarital &&
        matchesStatus
      );
    });
  }, [
    families,
    searchTerm,
    filterResidency,
    filterHousing,
    filterHealth,
    filterWarLoss,
    filterEducation,
    filterMarital,
    filterRecordStatus,
  ]);

  // Export to CSV with UTF-8 BOM so Excel opens Arabic correctly
  const exportToCSV = () => {
    const headers = [
      'كود الأسرة',
      'اسم رب الأسرة',
      'حالة استيفاء البيانات',
      'رقم الهوية',
      'تاريخ الميلاد',
      'عمل رب الأسرة',
      'حالة الإقامة',
      'الحالة الاجتماعية',
      'بيانات الزوجة',
      'عدد الأطفال',
      'بيانات الأطفال والتعليم',
      'هل رب الأسرة مريض',
      'نوع المرض',
      'مرض مزمن',
      'تفاصيل المزمن',
      'هل فقدت أحد أفراد العائلة خلال الحرب',
      'اسم الشهيد أو المفقود',
      'صفة الفقد وصلة القرابة',
      'تاريخ الاستشهاد أو الفقد',
      'هل تعرضت لإصابة خلال الحرب',
      'نوع الإصابة',
      'تاريخ الإصابة',
      'تفاصيل الإصابة',
      'نوع السكن',
      'حالة السكن',
      'المدينة',
      'المنطقة',
      'الحي',
      'أقرب معلم',
      'جوال أساسي',
      'جوال بديل',
      'واتس اب',
      'نوع المحفظة',
      'رقم المحفظة / الحساب',
      'اسم صاحب الحساب',
      'صلة القرابة',
      'تاريخ التسجيل',
    ];

    const rows = filteredFamilies.map((f) => {
      const wivesInfo = f.wives.map((w) => `${w.name} (${w.idNumber})`).join(' | ');
      const childrenInfo = f.children
        .map((c) => {
          let extra = '';
          if (c.academicAverage) extra += ` - معدل توجيهي: ${c.academicAverage}`;
          if (c.universityName)
            extra += ` - جامعة: ${c.universityName} (${c.universityMajor}) معدل: ${c.universityGpa} فصل: ${c.universitySemester}`;
          if (c.hasAccumulatedFees) extra += ` [رسوم متراكمة: ${c.accumulatedFeesAmount}]`;
          return `${c.name} [هوية: ${c.idNumber}, ميلاد: ${c.birthDate}, صف: ${c.grade}${extra}]`;
        })
        .join(' | ');

      return [
        f.id,
        f.headName,
        isFamilyRecordComplete(f) ? 'مستوفي كامل البيانات' : 'يحتاج استكمال',
        f.headIdNumber,
        f.headBirthDate,
        f.headOccupation || 'عامل يومي (أجر يومي)',
        f.residencyStatus || 'مقيم',
        f.maritalStatus,
        wivesInfo || 'لا يوجد',
        f.childrenCount,
        childrenInfo || 'لا يوجد',
        f.isHeadSick ? 'نعم' : 'لا',
        f.illnessType || '',
        f.isChronic ? 'نعم' : 'لا',
        f.chronicDetails || '',
        f.hasWarLoss ? 'نعم' : 'لا',
        f.lostPersonName || '',
        f.lostPersonStatus ? `${f.lostPersonStatus} (${f.lostPersonRelation || '-'})` : '',
        f.lostPersonDate || '',
        f.hasWarInjury ? 'نعم' : 'لا',
        f.warInjuryType || '',
        f.warInjuryDate || '',
        f.warInjuryDetails || '',
        f.housingType,
        f.housingCondition,
        f.city,
        f.area,
        f.neighborhood,
        f.nearestLandmark,
        f.primaryPhone,
        f.secondaryPhone || '',
        f.whatsappPhone,
        f.walletType,
        f.walletNumber,
        f.accountHolderName,
        f.accountHolderRelationship,
        f.submissionDate,
      ].map((val) => `"${String(val).replace(/"/g, '""')}"`);
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `بيانات_حكر_الجامع_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-5">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              جدول سجلات بيانات حكر الجامع الشامل
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              إدارة وعرض وتعديل وطباعة كافة بيانات الأسر المسجلة مع تفاصيل رب الأسرة والزوجة والأطفال والسكن والمحافظ المالية.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {userRole === 'admin' && onImportSuccess && (
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs"
                title="إدراج واستيراد كشوفات الإكسل إلى المنظومة"
              >
                <UploadCloud className="w-4 h-4 text-emerald-600" />
                <span>استيراد ملف إكسل</span>
              </button>
            )}
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              تصدير إكسل (CSV)
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              طباعة الكشف
            </button>
            <button
              onClick={onAddNew}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              إضافة أسرة جديدة
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-3 border-t border-slate-100">
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="البحث بالاسم، الهوية، الشهيد، الجامعة، الجوال..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-9 pl-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div>
            <select
              value={filterRecordStatus}
              onChange={(e) => setFilterRecordStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 cursor-pointer font-bold text-slate-800"
            >
              <option value="ALL">حالة الاستيفاء (الكل)</option>
              <option value="COMPLETE">مستوفي كامل البيانات ✅</option>
              <option value="NEEDS_COMPLETION">يحتاج استكمال ⚠️</option>
              <option value="IMPORTED">مستورد من إكسل 📥</option>
            </select>
          </div>

          <div>
            <select
              value={filterResidency}
              onChange={(e) => setFilterResidency(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 cursor-pointer font-medium"
            >
              <option value="ALL">الإقامة (الكل)</option>
              <option value="مقيم">مقيم فقط</option>
              <option value="نازح">نازح فقط</option>
            </select>
          </div>

          <div>
            <select
              value={filterWarLoss}
              onChange={(e) => setFilterWarLoss(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 cursor-pointer font-medium"
            >
              <option value="ALL">الشهداء والمفقودون</option>
              <option value="HAS_LOSS">أسر بها شهداء أو مفقودين</option>
            </select>
          </div>

          <div>
            <select
              value={filterEducation}
              onChange={(e) => setFilterEducation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 cursor-pointer font-medium"
            >
              <option value="ALL">التعليم (الجميع)</option>
              <option value="TAWJIHI">طلاب توجيهي (ثانوية عامة)</option>
              <option value="UNIVERSITY">طلاب جامعيون</option>
              <option value="ACCUMULATED_FEES">رسوم جامعية متراكمة</option>
            </select>
          </div>

          <div>
            <select
              value={filterHealth}
              onChange={(e) => setFilterHealth(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 cursor-pointer font-medium"
            >
              <option value="ALL">الصحة والإصابات</option>
              <option value="WAR_INJURY">إصابات حرب فقط</option>
              <option value="CHRONIC">أمراض مزمنة فقط</option>
              <option value="SICK">رب الأسرة مريض</option>
            </select>
          </div>

          <div>
            <select
              value={filterHousing}
              onChange={(e) => setFilterHousing(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 cursor-pointer font-medium"
            >
              <option value="ALL">نوع السكن (الكل)</option>
              <option value="خيمة / مركز إيواء">خيمة / مركز إيواء</option>
              <option value="إيجار">إيجار</option>
              <option value="ملك">ملك</option>
              <option value="كرفان">كرفان</option>
              <option value="استضافة لدى أقارب">استضافة لدى أقارب</option>
              <option value="منزل متضرر جزئياً">منزل متضرر جزئياً</option>
            </select>
          </div>
        </div>

        {/* Counter indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            عرض <strong className="text-slate-800 font-bold">{filteredFamilies.length}</strong> من إجمالي{' '}
            <strong className="text-slate-800 font-bold">{families.length}</strong> أسرة مسجلة
          </span>
          {(searchTerm ||
            filterResidency !== 'ALL' ||
            filterWarLoss !== 'ALL' ||
            filterEducation !== 'ALL' ||
            filterHousing !== 'ALL' ||
            filterHealth !== 'ALL' ||
            filterMarital !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterResidency('ALL');
                setFilterWarLoss('ALL');
                setFilterEducation('ALL');
                setFilterHousing('ALL');
                setFilterHealth('ALL');
                setFilterMarital('ALL');
              }}
              className="text-xs text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              <RefreshCw className="w-3 h-3" />
              إعادة ضبط الفلاتر
            </button>
          )}
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border-collapse">
            <thead className="bg-slate-900 text-slate-200 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3 w-10 text-center">تفاصيل</th>
                <th className="p-3">كود الملف</th>
                <th className="p-3">اسم رب الأسرة</th>
                <th className="p-3">رقم الهوية</th>
                <th className="p-3">تاريخ الميلاد</th>
                <th className="p-3">الحالة الاجتماعية</th>
                <th className="p-3">الزوجة</th>
                <th className="p-3">الأطفال</th>
                <th className="p-3">الوضع الصحي</th>
                <th className="p-3">السكن والحالة</th>
                <th className="p-3">العنوان & أقرب معلم</th>
                <th className="p-3">الاتصال</th>
                <th className="p-3">المحفظة / الحساب</th>
                <th className="p-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredFamilies.length === 0 ? (
                <tr>
                  <td colSpan={14} className="p-8 text-center text-slate-500">
                    لا توجد سجلات تطابق معايير البحث والفلترة.
                  </td>
                </tr>
              ) : (
                filteredFamilies.map((family, idx) => {
                  const isExpanded = expandedRowId === family.id;
                  const wifeNames = family.wives.map((w) => w.name).join('، ');

                  return (
                    <React.Fragment key={family.id}>
                      <tr className={`hover:bg-slate-50 transition ${idx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'}`}>
                        {/* Expand toggle */}
                        <td className="p-3 text-center">
                          <button
                            onClick={() => toggleRow(family.id)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600 transition cursor-pointer"
                            title="عرض تفاصيل الأبناء والزوجة"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>

                        {/* File ID */}
                        <td className="p-3 font-mono font-bold text-emerald-800 whitespace-nowrap">
                          {family.id}
                        </td>

                        {/* Head of Family */}
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">{family.headName}</span>
                            {isFamilyRecordComplete(family) ? (
                              <span
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-2xs"
                                title="استكمل المواطن جميع البيانات الأساسية المطلوبة بنجاح"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                مستوفي كامل البيانات
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-950 border border-amber-300"
                                title="ينقص هذا السجل بعض البيانات الأساسية بانتظار استكمال المواطن"
                              >
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                                يحتاج استكمال
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {family.headOccupation && (
                              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                💼 {family.headOccupation}
                              </span>
                            )}
                            <span
                              className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                family.residencyStatus === 'نازح'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              }`}
                            >
                              {family.residencyStatus || 'مقيم'}
                            </span>
                            {family.hasWarLoss && (
                              <span
                                className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300"
                                title={`الشهيد/المفقود: ${family.lostPersonName} (${family.lostPersonDate})`}
                              >
                                أسرة شهيد/مفقود
                              </span>
                            )}
                            {family.isImportedFromExcel && (
                              <span
                                className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300"
                                title="سجل مستورد من كشف إكسل"
                              >
                                إكسل 📥
                              </span>
                            )}
                          </div>
                        </td>

                        {/* National ID */}
                        <td className="p-3 font-mono font-semibold text-slate-700 whitespace-nowrap">
                          {family.headIdNumber}
                        </td>

                        {/* DOB */}
                        <td className="p-3 text-slate-600 whitespace-nowrap">
                          {family.headBirthDate || '-'}
                        </td>

                        {/* Marital */}
                        <td className="p-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">
                            {family.maritalStatus}
                          </span>
                        </td>

                        {/* Wife */}
                        <td className="p-3 text-slate-700 max-w-[130px] truncate" title={wifeNames || 'لا يوجد'}>
                          {family.wives && family.wives.length > 0 ? (
                            <div>
                              <div className="font-semibold truncate">{family.wives[0].name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{family.wives[0].idNumber}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        {/* Children Count */}
                        <td className="p-3 text-center whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-900 text-xs">
                            {family.childrenCount}
                          </span>
                        </td>

                        {/* Health status summary */}
                        <td className="p-3 whitespace-nowrap">
                          <div className="space-y-0.5">
                            {family.hasWarInjury && (
                              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                                إصابة حرب
                              </span>
                            )}
                            {family.isChronic && (
                              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 mr-1">
                                مزمن
                              </span>
                            )}
                            {family.isHeadSick && !family.isChronic && (
                              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                مريض
                              </span>
                            )}
                            {!family.hasWarInjury && !family.isChronic && !family.isHeadSick && (
                              <span className="text-[11px] text-slate-400">سليم</span>
                            )}
                          </div>
                        </td>

                        {/* Housing */}
                        <td className="p-3 whitespace-nowrap">
                          <div className="font-semibold text-slate-800">{family.housingType}</div>
                          <div className="text-[10px] text-slate-500">{family.housingCondition}</div>
                        </td>

                        {/* Location */}
                        <td className="p-3 max-w-[150px] truncate" title={`${family.neighborhood} - أقرب معلم: ${family.nearestLandmark}`}>
                          <div className="font-semibold truncate">{family.neighborhood || family.area}</div>
                          <div className="text-[10px] text-emerald-800 truncate">{family.nearestLandmark}</div>
                        </td>

                        {/* Contact */}
                        <td className="p-3 font-mono whitespace-nowrap">
                          <div className="font-bold text-slate-800">{family.primaryPhone}</div>
                          <div className="text-[10px] text-emerald-600 font-semibold">{family.whatsappPhone}</div>
                        </td>

                        {/* Financial */}
                        <td className="p-3 max-w-[140px] truncate">
                          <div className="font-semibold text-slate-800 truncate">{family.walletType}</div>
                          <div className="text-[10px] font-mono text-slate-500 truncate">{family.walletNumber}</div>
                        </td>

                        {/* Actions */}
                        <td className="p-3 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => onView(family)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                              title="معاينة الملف كاملاً"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onPrint(family)}
                              className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                              title="طباعة بطاقة واستمارة الأسرة"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            {(userRole === 'admin' || userRole === 'supervisor') && (
                              <button
                                onClick={() => onEdit(family)}
                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                title="تعديل السجل"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            {userRole === 'admin' && (
                              <button
                                onClick={() => setDeleteConfirmId(family.id)}
                                className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="حذف السجل"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable row: Children & Details */}
                      {isExpanded && (
                        <tr className="bg-slate-100/70 border-y border-slate-300">
                          <td colSpan={14} className="p-4">
                            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-4">
                              <div className="flex items-center justify-between border-b border-slate-200 pb-2 flex-wrap gap-2">
                                <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  تفاصيل الأبناء والتعليم لأسرة: {family.headName}
                                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                    المهنة: {family.headOccupation || 'عامل يومي'}
                                  </span>
                                </h4>
                                <span className="text-xs text-slate-500 font-mono">
                                  صلة قرابة الحساب المالي: {family.accountHolderName} ({family.accountHolderRelationship})
                                </span>
                              </div>

                              {family.children && family.children.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                  {family.children.map((child, cIdx) => (
                                    <div key={child.id || cIdx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs space-y-1.5">
                                      <div className="flex justify-between items-center">
                                        <span className="font-bold text-slate-800">{child.name}</span>
                                        <span className="text-[10px] text-slate-500">{child.gender}</span>
                                      </div>
                                      <div className="text-[11px] text-slate-600 font-mono">
                                        هوية: <strong className="text-slate-800">{child.idNumber}</strong>
                                      </div>
                                      <div className="text-[11px] text-slate-600">
                                        ميلاد: {child.birthDate}
                                      </div>
                                      <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                                        الصف: {child.grade}
                                      </div>

                                      {/* Tawjihi details if applicable */}
                                      {(child.grade === 'توجيهي (ثانوية عامة)' || (child.isTawjihiOrUniversity && !child.isUniversityStudent && child.grade !== 'طالب جامعي')) && (
                                        <div className="bg-amber-50 border border-amber-200 p-1.5 rounded text-[11px] text-amber-900">
                                          معدل التوجيهي: <strong>{child.academicAverage || 'غير مسجل'}</strong>
                                        </div>
                                      )}

                                      {/* University details if applicable */}
                                      {(child.grade === 'طالب جامعي' || child.isUniversityStudent) && (
                                        <div className="bg-blue-50 border border-blue-200 p-2 rounded text-[11px] text-blue-950 space-y-0.5">
                                          <div><strong>الجامعة:</strong> {child.universityName || '-'}</div>
                                          <div><strong>التخصص:</strong> {child.universityMajor || '-'}</div>
                                          <div><strong>المعدل:</strong> {child.universityGpa || '-'} | <strong>الفصل:</strong> {child.universitySemester || '-'}</div>
                                          {child.hasAccumulatedFees && (
                                            <div className="text-rose-700 font-bold pt-0.5 border-t border-blue-100">
                                              رسوم متراكمة: {child.accumulatedFeesAmount || 'نعم'}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-500 italic">لا يوجد أطفال مسجلون في هذا السجل.</p>
                              )}

                              {/* Health & Housing extra notes */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                                <div>
                                  <span className="text-slate-500 block mb-0.5">تفاصيل الوضع الصحي:</span>
                                  <span className="text-slate-800 font-medium">
                                    {family.illnessType ? `المرض: ${family.illnessType}. ` : ''}
                                    {family.chronicDetails ? `مزمن: ${family.chronicDetails}. ` : ''}
                                    {family.warInjuryDetails ? `إصابة حرب: ${family.warInjuryDetails}. ` : ''}
                                    {!family.illnessType && !family.chronicDetails && !family.warInjuryDetails && 'لا توجد ملاحظات صحية خاصة.'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-500 block mb-0.5">تفاصيل السكن وأقرب معلم:</span>
                                  <span className="text-slate-800 font-medium">
                                    {family.city} - {family.area} - {family.neighborhood} (معلم: {family.nearestLandmark})
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 text-center border border-slate-200 space-y-3">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">تأكيد حذف ملف الأسرة</h3>
            <p className="text-xs text-slate-500">
              هل أنت متأكد من رغبتك في حذف ملف الأسرة رقم ({deleteConfirmId}) نهائياً من قاعدة البيانات؟
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  onDelete(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                نعم، احذف الملف
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excel Import Modal */}
      {isImportModalOpen && onImportSuccess && (
        <ExcelImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImportSuccess={(newFamilies) => {
            onImportSuccess(newFamilies);
          }}
          existingFamilies={families}
        />
      )}
    </div>
  );
};

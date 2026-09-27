import React from 'react';
import { FamilyRecord } from '../types';
import { isFamilyRecordComplete } from '../utils/validation';
import { Printer, X, CheckCircle, MapPin, Phone, ShieldCheck, HeartPulse, CreditCard, Users, Home } from 'lucide-react';

interface FamilyPrintCardProps {
  family: FamilyRecord;
  onClose: () => void;
}

export const FamilyPrintCard: React.FC<FamilyPrintCardProps> = ({ family, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Control bar (hidden during print) */}
      <div className="no-print fixed top-4 right-4 left-4 max-w-4xl mx-auto flex items-center justify-between bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl z-50">
        <div className="flex items-center gap-3">
          <span className="font-bold text-emerald-400">معاينة استمارة الطباعة الرسمية</span>
          <span className="text-xs text-slate-300">رقم الملف: {family.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            طباعة الاستمارة (A4)
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-sm transition cursor-pointer"
          >
            <X className="w-4 h-4" />
            إغلاق
          </button>
        </div>
      </div>

      {/* The Printable A4 Sheet */}
      <div className="bg-white text-slate-900 w-full max-w-3xl mt-16 p-8 rounded-xl shadow-xl border border-slate-200 print:shadow-none print:border-none print:m-0 print:p-4 print:max-w-none">
        {/* Document Header */}
        <div className="border-b-2 border-emerald-800 pb-4 mb-6 flex items-center justify-between">
          <div className="text-right">
            <h1 className="text-xl font-bold text-emerald-900">منظومة بيانات حكر الجامع</h1>
            <p className="text-xs font-semibold text-slate-600">لجنة متابعة بيانات الأسر والمواطنين - دير البلح</p>
            <p className="text-xs text-slate-500 mt-1">تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}</p>
          </div>
          <div className="text-center p-2 border border-slate-300 rounded-lg bg-slate-50">
            <div className="text-xs font-bold text-slate-600">كود ملف الأسرة</div>
            <div className="text-lg font-black text-emerald-800 tracking-wider font-mono">{family.id}</div>
            <div className="text-[10px] font-bold text-slate-700">
              {isFamilyRecordComplete(family) ? 'مستوفي كامل البيانات ✓' : 'يحتاج استكمال ⚠️'}
            </div>
          </div>
        </div>

        {/* Section 1: Head of Family & Spouse */}
        <div className="mb-6 border border-slate-300 rounded-lg p-4 bg-slate-50/50">
          <h2 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-3 border-b border-slate-200 pb-1.5">
            <Users className="w-4 h-4 text-emerald-700" />
            أولاً: بيانات رب الأسرة والزوجة وحالة الإقامة
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">اسم رب الأسرة:</span>
              <span className="font-bold text-slate-800 text-sm block">{family.headName}</span>
              <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-black border ${
                isFamilyRecordComplete(family)
                  ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                  : 'bg-amber-100 text-amber-950 border-amber-400'
              }`}>
                {isFamilyRecordComplete(family) ? 'مستوفي كامل البيانات' : 'يحتاج استكمال'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">رقم الهوية:</span>
              <span className="font-mono font-bold text-slate-800 text-sm">{family.headIdNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block">عمل رب الأسرة:</span>
              <span className="font-bold text-emerald-950 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded inline-block text-[11px]">
                {family.headOccupation || 'عامل يومي (أجر يومي)'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">تاريخ الميلاد:</span>
              <span className="font-semibold text-slate-800">{family.headBirthDate || 'غير محدد'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">حالة الإقامة:</span>
              <span className="font-bold text-emerald-900 border border-emerald-300 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                {family.residencyStatus || 'مقيم'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">الحالة الاجتماعية:</span>
              <span className="font-semibold text-emerald-800">{family.maritalStatus}</span>
            </div>
          </div>

          {/* Wives section if any */}
          {family.wives && family.wives.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-700 block mb-2">بيانات الزوجة:</span>
              <div className="space-y-2">
                {family.wives.map((wife, idx) => (
                  <div key={wife.id || idx} className="grid grid-cols-3 gap-3 text-xs bg-white p-2 rounded border border-slate-200">
                    <div>
                      <span className="text-slate-500">الاسم: </span>
                      <span className="font-bold text-slate-800">{wife.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">رقم الهوية: </span>
                      <span className="font-mono font-bold text-slate-800">{wife.idNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">تاريخ الميلاد: </span>
                      <span className="font-semibold text-slate-800">{wife.birthDate || '-'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Children */}
        <div className="mb-6 border border-slate-300 rounded-lg p-4 bg-slate-50/50">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-3">
            <h2 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              ثانياً: بيانات الأطفال والأبناء ومتابعة التوجيهي والجامعة
            </h2>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded">
              عدد الأطفال: {family.childrenCount}
            </span>
          </div>

          {family.children && family.children.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border border-slate-300">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-l border-slate-300 text-center w-8">#</th>
                    <th className="p-2 border-l border-slate-300">اسم الابن/الطفل</th>
                    <th className="p-2 border-l border-slate-300">رقم الهوية</th>
                    <th className="p-2 border-l border-slate-300">تاريخ الميلاد</th>
                    <th className="p-2 border-l border-slate-300">الجنس</th>
                    <th className="p-2 border-l border-slate-300">المرحلة / الصف</th>
                    <th className="p-2">بيانات التوجيهي / الجامعة والرسوم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {family.children.map((child, idx) => {
                    const isTawjihi = child.grade === 'توجيهي (ثانوية عامة)' || (child.isTawjihiOrUniversity && !child.isUniversityStudent && child.grade !== 'طالب جامعي');
                    const isUni = child.grade === 'طالب جامعي' || Boolean(child.isUniversityStudent);

                    return (
                      <tr key={child.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="p-2 border-l border-slate-300 text-center font-bold text-slate-600">{idx + 1}</td>
                        <td className="p-2 border-l border-slate-300 font-semibold text-slate-800">{child.name}</td>
                        <td className="p-2 border-l border-slate-300 font-mono font-bold text-slate-800">{child.idNumber}</td>
                        <td className="p-2 border-l border-slate-300">{child.birthDate}</td>
                        <td className="p-2 border-l border-slate-300">{child.gender}</td>
                        <td className="p-2 border-l border-slate-300 font-medium text-emerald-900">{child.grade}</td>
                        <td className="p-2">
                          {isTawjihi && (
                            <span className="font-semibold text-amber-900">
                              معدل التوجيهي: {child.academicAverage || '-'}
                            </span>
                          )}
                          {isUni && (
                            <div className="text-[11px] leading-snug">
                              <div><strong>{child.universityName}</strong> - {child.universityMajor}</div>
                              <div>معدل: {child.universityGpa} | فصل: {child.universitySemester}</div>
                              {child.hasAccumulatedFees && (
                                <div className="text-red-700 font-bold">رسوم متراكمة: {child.accumulatedFeesAmount}</div>
                              )}
                            </div>
                          )}
                          {!isTawjihi && !isUni && <span className="text-slate-400">-</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">لا يوجد أطفال مسجلون لهذه الأسرة.</p>
          )}
        </div>

        {/* Section 3: Health Status & War Impacts */}
        <div className="mb-6 border border-slate-300 rounded-lg p-4 bg-slate-50/50">
          <h2 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-3 border-b border-slate-200 pb-1.5">
            <HeartPulse className="w-4 h-4 text-emerald-700" />
            ثالثاً: الوضع الصحي وآثار الحرب (الشهداء والمفقودون والإصابات)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Health */}
            <div className="space-y-1.5 bg-white p-2.5 rounded border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">مرض رب الأسرة:</span>
                <span className={`px-2 py-0.5 rounded font-bold ${family.isHeadSick ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                  {family.isHeadSick ? 'نعم (مريض)' : 'سليم'}
                </span>
              </div>
              {family.isHeadSick && (
                <div className="text-slate-700 pt-1 border-t border-slate-100">
                  <span className="text-slate-500">نوع المرض: </span>
                  <span className="font-semibold">{family.illnessType}</span>
                </div>
              )}
              {family.isChronic && (
                <div className="text-slate-700 pt-1">
                  <span className="text-slate-500">أمراض مزمنة: </span>
                  <span className="font-semibold text-rose-700">{family.chronicDetails || 'نعم'}</span>
                </div>
              )}
            </div>

            {/* War Loss / Martyrs */}
            <div className="space-y-1.5 bg-white p-2.5 rounded border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">شهداء أو مفقودين:</span>
                <span className={`px-2 py-0.5 rounded font-bold ${family.hasWarLoss ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-slate-100 text-slate-600'}`}>
                  {family.hasWarLoss ? 'يوجد شهيد/مفقود' : 'لا يوجد'}
                </span>
              </div>
              {family.hasWarLoss && (
                <div className="text-slate-700 pt-1 border-t border-slate-100 space-y-0.5">
                  <div>
                    <span className="text-slate-500">الاسم: </span>
                    <strong className="text-slate-900">{family.lostPersonName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">تاريخ الاستشهاد/الفقد: </span>
                    <span className="font-mono">{family.lostPersonDate}</span>
                  </div>
                  {family.lostPersonRelation && (
                    <div>
                      <span className="text-slate-500">القرابة: </span>
                      <span>{family.lostPersonRelation}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* War Injury */}
            <div className="space-y-1.5 bg-white p-2.5 rounded border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">إصابة حرب:</span>
                <span className={`px-2 py-0.5 rounded font-bold ${family.hasWarInjury ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-slate-100 text-slate-600'}`}>
                  {family.hasWarInjury ? 'يوجد إصابة حرب' : 'لا يوجد'}
                </span>
              </div>
              {family.hasWarInjury && (
                <div className="text-slate-700 pt-1 border-t border-slate-100 space-y-0.5">
                  <div>
                    <span className="text-slate-500">نوع الإصابة: </span>
                    <strong className="text-red-900">{family.warInjuryType || family.warInjuryDetails}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">تاريخ الإصابة: </span>
                    <span className="font-mono">{family.warInjuryDate || '-'}</span>
                  </div>
                  {family.warInjuryDetails && (
                    <div>
                      <span className="text-slate-500">تفاصيل: </span>
                      <span>{family.warInjuryDetails}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Housing, Location & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Housing & Location */}
          <div className="border border-slate-300 rounded-lg p-4 bg-slate-50/50">
            <h2 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-3 border-b border-slate-200 pb-1.5">
              <Home className="w-4 h-4 text-emerald-700" />
              رابعاً: بيانات السكن والإقامة والعنوان
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">حالة الإقامة:</span>
                <span className="font-bold text-emerald-950">{family.residencyStatus || 'مقيم'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">نوع السكن:</span>
                <span className="font-bold text-slate-800">{family.housingType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">حالة السكن:</span>
                <span className="font-bold text-slate-800">{family.housingCondition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">المدينة والمنطقة:</span>
                <span className="font-semibold text-slate-800">{family.city} - {family.area}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">الحي:</span>
                <span className="font-semibold text-slate-800">{family.neighborhood}</span>
              </div>
              <div className="pt-1 border-t border-slate-200">
                <span className="text-slate-500 block">أقرب معلم:</span>
                <span className="font-bold text-emerald-900">{family.nearestLandmark}</span>
              </div>
            </div>
          </div>

          {/* Contact & Financial */}
          <div className="border border-slate-300 rounded-lg p-4 bg-slate-50/50">
            <h2 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-3 border-b border-slate-200 pb-1.5">
              <CreditCard className="w-4 h-4 text-emerald-700" />
              خامساً: الاتصال والمحفظة المالية
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">الجوال الأساسي:</span>
                <span className="font-mono font-bold text-slate-800">{family.primaryPhone}</span>
              </div>
              {family.secondaryPhone && (
                <div className="flex justify-between">
                  <span className="text-slate-500">الجوال البديل:</span>
                  <span className="font-mono text-slate-800">{family.secondaryPhone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">رقم الواتس اب:</span>
                <span className="font-mono font-semibold text-emerald-700">{family.whatsappPhone}</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500">المحفظة / الحساب:</span>
                <span className="font-bold text-slate-800 mr-1">{family.walletType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">رقم الحساب/المحفظة:</span>
                <span className="font-mono font-bold text-slate-800">{family.walletNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">اسم صاحب الحساب:</span>
                <span className="font-bold text-slate-800">{family.accountHolderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">صلة القرابة:</span>
                <span className="font-semibold text-emerald-900">{family.accountHolderRelationship}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Footer & Signatures */}
        <div className="border-t-2 border-slate-300 pt-4 mt-6">
          <div className="grid grid-cols-3 text-center text-xs gap-4 text-slate-700">
            <div>
              <span className="block font-bold mb-8">توقيع رب الأسرة / المفوض</span>
              <span className="block border-t border-dashed border-slate-400 w-3/4 mx-auto pt-1">.........................</span>
            </div>
            <div>
              <span className="block font-bold mb-8">ختم وتوقيع المشرف الميداني</span>
              <span className="block border-t border-dashed border-slate-400 w-3/4 mx-auto pt-1">.........................</span>
            </div>
            <div>
              <span className="block font-bold mb-8">اعتماد لجنة حكر الجامع</span>
              <span className="block border-t border-dashed border-slate-400 w-3/4 mx-auto pt-1">.........................</span>
            </div>
          </div>
          <div className="mt-6 text-center text-[10px] text-slate-400">
            هذه الاستمارة صادرة رسمياً من منظومة بيانات حكر الجامع - دير البلح | تم استيفاء وتدقيق كامل الشروط الإلزامية قبل الاعتماد
          </div>
        </div>
      </div>
    </div>
  );
};

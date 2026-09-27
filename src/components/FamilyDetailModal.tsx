import React from 'react';
import { FamilyRecord } from '../types';
import { isFamilyRecordComplete } from '../utils/validation';
import { X, Printer, Edit, Users, HeartPulse, Home, CreditCard, Phone, Calendar, UserCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface FamilyDetailModalProps {
  family: FamilyRecord;
  onClose: () => void;
  onEdit?: (family: FamilyRecord) => void;
  onPrint: (family: FamilyRecord) => void;
}

export const FamilyDetailModal: React.FC<FamilyDetailModalProps> = ({
  family,
  onClose,
  onEdit,
  onPrint,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono">
              {family.id.slice(-3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">{family.headName}</h2>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  family.residencyStatus === 'نازح' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {family.residencyStatus || 'مقيم'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span>رقم الملف: {family.id}</span>
                <span>•</span>
                <span>رقم الهوية: {family.headIdNumber}</span>
                <span>•</span>
                <span className={`font-bold ${isFamilyRecordComplete(family) ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isFamilyRecordComplete(family) ? 'مستوفي كامل البيانات' : 'يحتاج استكمال'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrint(family)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              طباعة الاستمارة
            </button>
            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(family);
                }}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                <Edit className="w-4 h-4" />
                تعديل البيانات
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* 1. رب الأسرة والزوجة */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <Users className="w-4 h-4 text-emerald-600" />
              بيانات رب الأسرة والزوجة
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">اسم رب الأسرة</span>
                <span className="font-extrabold text-slate-900 text-sm block">{family.headName}</span>
                {isFamilyRecordComplete(family) ? (
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    مستوفي كامل البيانات
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300">
                    <AlertTriangle className="w-3 h-3 text-amber-700" />
                    يحتاج استكمال
                  </span>
                )}
              </div>
              <div>
                <span className="text-slate-500 block mb-1">رقم الهوية</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{family.headIdNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">عمل رب الأسرة / المهنة</span>
                <span className="font-extrabold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded text-xs border border-emerald-200 inline-block">
                  {family.headOccupation || 'عامل يومي (أجر يومي)'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">تاريخ الميلاد</span>
                <span className="font-medium text-slate-800">{family.headBirthDate || 'غير محدد'}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">حالة الإقامة</span>
                <span className={`inline-block px-2.5 py-0.5 rounded-md font-bold text-xs ${
                  family.residencyStatus === 'نازح' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {family.residencyStatus || 'مقيم'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">الحالة الاجتماعية</span>
                <span className="inline-block px-2.5 py-0.5 rounded-md font-bold text-xs bg-slate-200 text-slate-800">
                  {family.maritalStatus}
                </span>
              </div>
            </div>

            {family.wives && family.wives.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-2">بيانات الزوجة:</span>
                <div className="space-y-2">
                  {family.wives.map((wife, i) => (
                    <div key={wife.id || i} className="bg-white p-3 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">اسم الزوجة: </span>
                        <span className="font-bold text-slate-900">{wife.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">رقم الهوية: </span>
                        <span className="font-mono font-bold text-slate-900">{wife.idNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">تاريخ الميلاد: </span>
                        <span className="text-slate-800">{wife.birthDate || '-'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. الأطفال والتعليم (مع بيانات التوجيهي والجامعة) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                بيانات الأطفال والتعليم ومتابعة التوجيهي والجامعة
              </h3>
              <span className="text-xs font-bold bg-slate-200 text-slate-800 px-2.5 py-0.5 rounded-full">
                إجمالي الأطفال: {family.childrenCount}
              </span>
            </div>

            {family.children && family.children.length > 0 ? (
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                      <tr>
                        <th className="p-2.5 text-center w-10">#</th>
                        <th className="p-2.5">اسم الابن/الطفل</th>
                        <th className="p-2.5">رقم الهوية</th>
                        <th className="p-2.5">تاريخ الميلاد</th>
                        <th className="p-2.5">الجنس</th>
                        <th className="p-2.5">المرحلة / الصف الدراسي</th>
                        <th className="p-2.5">تفاصيل التوجيهي / الجامعة والرسوم</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {family.children.map((child, idx) => {
                        const isTawjihi = child.grade === 'توجيهي (ثانوية عامة)' || (child.isTawjihiOrUniversity && !child.isUniversityStudent && child.grade !== 'طالب جامعي');
                        const isUni = child.grade === 'طالب جامعي' || Boolean(child.isUniversityStudent);

                        return (
                          <tr key={child.id || idx} className="hover:bg-slate-50">
                            <td className="p-2.5 text-center font-bold text-slate-400">{idx + 1}</td>
                            <td className="p-2.5 font-bold text-slate-800">{child.name}</td>
                            <td className="p-2.5 font-mono font-semibold text-slate-700">{child.idNumber}</td>
                            <td className="p-2.5 text-slate-600">{child.birthDate}</td>
                            <td className="p-2.5 text-slate-600">{child.gender}</td>
                            <td className="p-2.5 font-semibold text-emerald-800">
                              <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {child.grade}
                              </span>
                            </td>
                            <td className="p-2.5">
                              {isTawjihi && (
                                <div className="text-[11px] bg-amber-50 border border-amber-200 text-amber-900 px-2 py-1 rounded-md">
                                  <strong>معدل التوجيهي: </strong>
                                  <span className="font-bold font-mono">{child.academicAverage || 'غير محدد'}</span>
                                </div>
                              )}
                              {isUni && (
                                <div className="text-[11px] bg-blue-50 border border-blue-200 text-blue-950 p-1.5 rounded-md space-y-0.5">
                                  <div>
                                    <span className="font-bold">{child.universityName || 'طالب جامعي'}</span> - {child.universityMajor || '-'}
                                  </div>
                                  <div className="text-slate-600 flex items-center gap-2">
                                    <span>المعدل: <strong className="font-mono text-blue-900">{child.universityGpa || '-'}</strong></span>
                                    <span>•</span>
                                    <span>الفصل: {child.universitySemester || '-'}</span>
                                  </div>
                                  {child.hasAccumulatedFees ? (
                                    <div className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 inline-block mt-0.5">
                                      رسوم متراكمة لم تسدد: {child.accumulatedFeesAmount || 'نعم'}
                                    </div>
                                  ) : (
                                    <span className="text-emerald-700 text-[10px] block">لا يوجد رسوم متراكمة</span>
                                  )}
                                </div>
                              )}
                              {!isTawjihi && !isUni && (
                                <span className="text-slate-400 text-[11px]">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-2">لا يوجد أطفال مسجلون في هذا الملف.</p>
            )}
          </div>

          {/* 3. الوضع الصحي وآثار الحرب والشهداء */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <HeartPulse className="w-4 h-4 text-emerald-600" />
              الوضع الصحي وآثار الحرب (الشهداء والمفقودون والإصابات)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* الوضع الصحي العام */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">مرض رب الأسرة:</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${family.isHeadSick ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                    {family.isHeadSick ? 'نعم (مريض)' : 'سليم'}
                  </span>
                </div>
                {family.isHeadSick && (
                  <p className="text-slate-700">
                    <span className="text-slate-500">نوع المرض: </span>
                    <span className="font-semibold">{family.illnessType}</span>
                  </p>
                )}
                {family.isChronic && (
                  <p className="text-slate-700">
                    <span className="text-slate-500">مرض مزمن: </span>
                    <span className="font-semibold text-rose-700">{family.chronicDetails || 'نعم'}</span>
                  </p>
                )}
              </div>

              {/* شهداء ومفقودو العائلة خلال الحرب */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">فقدان أحد أفراد العائلة خلال الحرب:</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${family.hasWarLoss ? 'bg-rose-100 text-rose-900 border border-rose-300' : 'bg-slate-100 text-slate-600'}`}>
                    {family.hasWarLoss ? 'نعم (يوجد شهيد/مفقود)' : 'لا'}
                  </span>
                </div>
                {family.hasWarLoss && (
                  <div className="pt-1 text-slate-800 space-y-1 bg-rose-50/50 p-2 rounded border border-rose-100">
                    <p>
                      <span className="text-slate-500">اسم الشهيد أو المفقود: </span>
                      <strong className="text-rose-950 font-bold">{family.lostPersonName}</strong>
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-600">
                      <span>الصفة: <strong className="text-rose-800">{family.lostPersonStatus || 'شهيد'}</strong></span>
                      {family.lostPersonRelation && <span>صلة القرابة: {family.lostPersonRelation}</span>}
                    </div>
                    <p className="text-[11px]">
                      <span className="text-slate-500">تاريخ الاستشهاد او الفقد: </span>
                      <span className="font-mono font-semibold text-slate-800">{family.lostPersonDate}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* إصابات الحرب */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">التعرض لإصابة خلال الحرب:</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${family.hasWarInjury ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-slate-100 text-slate-600'}`}>
                    {family.hasWarInjury ? 'نعم (يوجد إصابة حرب)' : 'لا يوجد'}
                  </span>
                </div>
                {family.hasWarInjury && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-red-50/40 p-2.5 rounded border border-red-100">
                    <div>
                      <span className="text-slate-500 block mb-0.5">نوع الإصابة:</span>
                      <strong className="text-red-950 font-bold">{family.warInjuryType || family.warInjuryDetails}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">تاريخ الإصابة:</span>
                      <span className="font-mono font-semibold text-slate-800">{family.warInjuryDate || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">تفاصيل العجز / العلاج:</span>
                      <span className="text-slate-700">{family.warInjuryDetails || 'لا يوجد تفاصيل إضافية'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. السكن والعنوان بالتفصيل */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <Home className="w-4 h-4 text-emerald-600" />
              بيانات السكن والموقع الجغرافي
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">حالة الإقامة:</span>
                <span className={`inline-block px-2 py-0.5 rounded font-bold text-xs ${
                  family.residencyStatus === 'نازح' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {family.residencyStatus || 'مقيم'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">نوع السكن:</span>
                <span className="font-bold text-slate-800">{family.housingType}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">حالة السكن:</span>
                <span className="font-bold text-slate-800">{family.housingCondition}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">المدينة والمنطقة:</span>
                <span className="font-semibold text-slate-800">{family.city} - {family.area}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">الحي:</span>
                <span className="font-semibold text-slate-800">{family.neighborhood}</span>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <span className="text-slate-500 block mb-0.5">أقرب معلم معروف:</span>
                <span className="font-bold text-emerald-900 bg-white px-2 py-1 rounded border border-slate-200 inline-block">
                  {family.nearestLandmark}
                </span>
              </div>
            </div>
          </div>

          {/* 5. الاتصال والمحفظة */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              بيانات الاتصال والمحفظة المالية
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">الجوال الأساسي:</span>
                  <span className="font-mono font-bold text-slate-900">{family.primaryPhone}</span>
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
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">نوع المحفظة / الحساب:</span>
                  <span className="font-bold text-slate-800">{family.walletType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">رقم المحفظة / الحساب:</span>
                  <span className="font-mono font-bold text-slate-900">{family.walletNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">اسم صاحب الحساب:</span>
                  <span className="font-bold text-slate-800">{family.accountHolderName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">صلة القرابة:</span>
                  <span className="font-semibold text-emerald-800">{family.accountHolderRelationship}</span>
                </div>
              </div>
            </div>
          </div>

          {family.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900">
              <span className="font-bold block mb-1">ملاحظات إضافية:</span>
              <p>{family.notes}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            تاريخ الإضافة: {family.submissionDate} | آخر تحديث: {family.lastUpdated}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { FamilyRecord } from '../types';
import { Users, HeartPulse, Home, CreditCard, ShieldAlert, Award, AlertCircle, GraduationCap } from 'lucide-react';

interface StatsOverviewProps {
  families: FamilyRecord[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ families }) => {
  const totalFamilies = families.length;
  const totalChildren = families.reduce((sum, f) => sum + (f.childrenCount || 0), 0);
  const totalWives = families.reduce((sum, f) => sum + (f.wives?.length || 0), 0);
  const totalIndividuals = totalFamilies + totalWives + totalChildren;

  // Residency stats
  const residentFamiliesCount = families.filter((f) => f.residencyStatus !== 'نازح').length;
  const displacedFamiliesCount = families.filter((f) => f.residencyStatus === 'نازح').length;

  // War impact stats
  const warLossesCount = families.filter((f) => f.hasWarLoss).length;
  const warInjuriesCount = families.filter((f) => f.hasWarInjury).length;
  const chronicDiseasesCount = families.filter((f) => f.isChronic).length;
  const sickHeadsCount = families.filter((f) => f.isHeadSick).length;

  // Education stats
  const allChildren = families.flatMap((f) => f.children || []);
  const tawjihiStudentsCount = allChildren.filter(
    (c) => c.grade === 'توجيهي (ثانوية عامة)' || (c.isTawjihiOrUniversity && !c.isUniversityStudent && c.grade !== 'طالب جامعي')
  ).length;
  const universityStudentsCount = allChildren.filter(
    (c) => c.grade === 'طالب جامعي' || c.isUniversityStudent
  ).length;
  const accumulatedFeesCount = allChildren.filter((c) => c.hasAccumulatedFees).length;

  const tentsCount = families.filter((f) => f.housingType.includes('خيمة')).length;
  const damagedHousesCount = families.filter(
    (f) => f.housingType.includes('متضرر') || f.housingCondition.includes('مدمر') || f.housingCondition.includes('غير صالح')
  ).length;

  const palpayCount = families.filter((f) => f.walletType.includes('PalPay')).length;
  const jawwalPayCount = families.filter((f) => f.walletType.includes('Jawwal')).length;
  const bankOfPalestineCount = families.filter((f) => f.walletType.includes('بنك فلسطين')).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">تقرير إحصائيات منظومة حكر الجامع</h2>
          <p className="text-xs text-slate-300 mt-1">
            بيانات تحليلية حية ومحدثة لكافة الأسر المسجلة ببلدة ومخيم دير البلح - منطقة حكر الجامع
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 block">إجمالي السكان المقيدين</span>
            <span className="text-lg font-black text-emerald-400 font-mono">{totalIndividuals} فرد</span>
          </div>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">إجمالي الأسر</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalFamilies}</div>
          <p className="text-[10px] text-slate-400">ملفات مكتملة</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">أسر نازحة</span>
            <Home className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 font-mono">{displacedFamiliesCount}</div>
          <p className="text-[10px] text-slate-400">{totalFamilies ? Math.round((displacedFamiliesCount / totalFamilies) * 100) : 0}% من الإجمالي</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">شهداء ومفقودون</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700 font-mono">{warLossesCount}</div>
          <p className="text-[10px] text-slate-400">أسر فقدت أفراداً</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">إصابات حرب</span>
            <HeartPulse className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-700 font-mono">{warInjuriesCount}</div>
          <p className="text-[10px] text-slate-400">أولوية بالرعاية</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">طلاب الجامعات</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700 font-mono">{universityStudentsCount}</div>
          <p className="text-[10px] text-slate-400">+{tawjihiStudentsCount} توجيهي</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">رسوم متراكمة</span>
            <AlertCircle className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-700 font-mono">{accumulatedFeesCount}</div>
          <p className="text-[10px] text-slate-400">بحاجة لمنح دراسية</p>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Residency & Housing Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Home className="w-4 h-4 text-emerald-600" />
            تحليل الإقامة والوضع السكني
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>أسر مقيمة أصلية</span>
                <span className="font-mono text-emerald-800 font-bold">{residentFamiliesCount} ({totalFamilies ? Math.round((residentFamiliesCount / totalFamilies) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${totalFamilies ? (residentFamiliesCount / totalFamilies) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>أسر نازحة</span>
                <span className="font-mono text-amber-800 font-bold">{displacedFamiliesCount} ({totalFamilies ? Math.round((displacedFamiliesCount / totalFamilies) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full"
                  style={{ width: `${totalFamilies ? (displacedFamiliesCount / totalFamilies) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>أسر تقيم في خيام / مراكز إيواء</span>
                <span className="font-mono">{tentsCount} ({totalFamilies ? Math.round((tentsCount / totalFamilies) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${totalFamilies ? (tentsCount / totalFamilies) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>منازل متضررة أو غير صالحة</span>
                <span className="font-mono">{damagedHousesCount} ({totalFamilies ? Math.round((damagedHousesCount / totalFamilies) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-rose-500 h-2 rounded-full"
                  style={{ width: `${totalFamilies ? (damagedHousesCount / totalFamilies) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Education & Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            تحليل التعليم والتوجيهي والجامعات
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-xl border border-blue-100">
              <span className="font-semibold text-slate-800">طلاب الجامعات المقيدون</span>
              <span className="font-mono font-bold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded">
                {universityStudentsCount} طالب
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-xl border border-amber-100">
              <span className="font-semibold text-slate-800">طلاب الثانوية العامة (التوجيهي)</span>
              <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded">
                {tawjihiStudentsCount} طالب
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-rose-50 rounded-xl border border-rose-100">
              <span className="font-semibold text-rose-900">طلاب عليهم رسوم جامعية متراكمة</span>
              <span className="font-mono font-bold text-rose-900 bg-rose-100 px-2.5 py-0.5 rounded">
                {accumulatedFeesCount} طالب
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
              يتم تصدير وتوثيق بيانات الطلاب والمعدلات وقيمة الرسوم المتراكمة لمطابقتها مع منح التعليم العالي.
            </p>
          </div>
        </div>

        {/* Financial Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            توزيع المحافظ والحسابات البنكية
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700">محفظة بال باي (PalPay)</span>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                {palpayCount} أسرة
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700">محفظة جوال بي (Jawwal Pay)</span>
              <span className="font-mono font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                {jawwalPayCount} أسرة
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700">حسابات بنك فلسطين</span>
              <span className="font-mono font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded">
                {bankOfPalestineCount} أسرة
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

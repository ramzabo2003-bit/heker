import React from 'react';
import {
  FileSpreadsheet,
  UserPlus,
  UserCheck,
  BarChart3,
  ShieldCheck,
  User,
  Users,
  Settings,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'form' | 'table' | 'citizen' | 'stats';
  setActiveTab: (tab: 'form' | 'table' | 'citizen' | 'stats') => void;
  userRole: 'admin' | 'supervisor' | 'citizen';
  setUserRole: (role: 'admin' | 'supervisor' | 'citizen') => void;
  familiesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  familiesCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs font-black text-lg">
              ح
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900 tracking-tight">
                  بيانات حكر الجامع
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  دير البلح
                </span>
              </div>
              <p className="text-[11px] text-slate-500">منظومة تسجيل وإدارة بيانات الأسر والمواطنين</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              جدول الأسر
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-mono">
                {familiesCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4 text-emerald-600" />
              تسجيل أسرة جديدة
            </button>

            <button
              onClick={() => setActiveTab('citizen')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'citizen'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              بوابة المواطن
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              الإحصائيات
            </button>
          </nav>

          {/* User Role Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">الصلاحية:</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setUserRole('admin')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  userRole === 'admin'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="لوحة تحكم المدير: تحكم كامل وإدارة وسجلات وحذف"
              >
                الأدمن
              </button>
              <button
                onClick={() => setUserRole('supervisor')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  userRole === 'supervisor'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="لوحة المشرف الميداني: بحث، تعديل، إضافة، طباعة"
              >
                المشرف
              </button>
              <button
                onClick={() => setUserRole('citizen')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  userRole === 'citizen'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="واجهة المواطن: استعلام برقم الهوية وتسجيل"
              >
                المواطن
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden border-t border-slate-100 py-2 items-center justify-around text-xs font-bold">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-2 py-1 rounded-lg ${activeTab === 'table' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'}`}
          >
            الجدول
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`px-2 py-1 rounded-lg ${activeTab === 'form' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'}`}
          >
            تسجيل جديد
          </button>
          <button
            onClick={() => setActiveTab('citizen')}
            className={`px-2 py-1 rounded-lg ${activeTab === 'citizen' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'}`}
          >
            بوابة المواطن
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-2 py-1 rounded-lg ${activeTab === 'stats' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'}`}
          >
            الإحصائيات
          </button>
        </div>
      </div>
    </header>
  );
};

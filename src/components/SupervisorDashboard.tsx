import React, { useState } from 'react';
import { FamilyRecord, UserAccount } from '../types';
import { AdminTable } from './AdminTable';
import { PWAInstallAndShareModal } from './PWAInstallAndShareModal';
import {
  FileSpreadsheet,
  Plus,
  Printer,
  LogOut,
  MapPin,
  Users,
  Search,
  CheckCircle2,
  Info,
  Smartphone,
  Globe,
} from 'lucide-react';

interface SupervisorDashboardProps {
  supervisor: UserAccount;
  families: FamilyRecord[];
  onAddNewFamily: () => void;
  onEditFamily: (family: FamilyRecord) => void;
  onViewFamily: (family: FamilyRecord) => void;
  onPrintFamily: (family: FamilyRecord) => void;
  onLogout: () => void;
}

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({
  supervisor,
  families,
  onAddNewFamily,
  onEditFamily,
  onViewFamily,
  onPrintFamily,
  onLogout,
}) => {
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [pwaTab, setPwaTab] = useState<'install' | 'share'>('install');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Supervisor Top Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 shadow-sm sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-lg">
              ح
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight">بيانات حكر الجامع</span>
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded">
                  لوحة المشرف الميداني
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>المشرف: <strong>{supervisor.name}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {supervisor.assignedArea || 'حكر الجامع'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setPwaTab('install');
                setShowPwaModal(true);
              }}
              className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تثبيت التطبيق 📲</span>
            </button>

            <button
              onClick={() => {
                setPwaTab('share');
                setShowPwaModal(true);
              }}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border border-slate-700"
              title="رابط الويب"
            >
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">رابط الويب</span>
            </button>

            <button
              onClick={onAddNewFamily}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة أسرة</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Supervisor Guidelines Notice */}
      <div className="bg-blue-50/90 border-b border-blue-200 text-blue-900 py-2.5 px-4 text-xs no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              <strong>صلاحيات المشرف:</strong> يمكنك البحث في كافة السجلات، تعديل واستكمال بيانات الأسر، إضافة أسر جديدة، وطباعة الكشوفات الميدانية وبطاقات الأسر.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-blue-800 font-mono">
            إجمالي السجلات: {families.length}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <AdminTable
          families={families}
          onAddNew={onAddNewFamily}
          onEdit={onEditFamily}
          onView={onViewFamily}
          onPrint={onPrintFamily}
          onDelete={() => {}} // Disabled for supervisors
          userRole="supervisor"
        />
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 no-print">
        منظومة بيانات حكر الجامع - بوابة المشرف الميداني المعتمدة
      </footer>

      {/* PWA Install & Share Modal */}
      <PWAInstallAndShareModal
        isOpen={showPwaModal}
        onClose={() => setShowPwaModal(false)}
        defaultTab={pwaTab}
      />
    </div>
  );
};

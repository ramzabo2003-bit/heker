import React, { useState } from 'react';
import { FamilyRecord, UserAccount } from '../types';
import { AdminTable } from './AdminTable';
import { StatsOverview } from './StatsOverview';
import { PWAInstallAndShareModal } from './PWAInstallAndShareModal';
import {
  ShieldCheck,
  Users,
  FileSpreadsheet,
  KeyRound,
  UserPlus,
  BarChart3,
  LogOut,
  Plus,
  Trash2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Phone,
  MapPin,
  Menu,
  X,
  FileText,
  Download,
  Smartphone,
  Globe,
} from 'lucide-react';

interface AdminSidebarLayoutProps {
  adminUser: UserAccount;
  families: FamilyRecord[];
  users: UserAccount[];
  onAddNewFamily: () => void;
  onEditFamily: (family: FamilyRecord) => void;
  onViewFamily: (family: FamilyRecord) => void;
  onPrintFamily: (family: FamilyRecord) => void;
  onDeleteFamily: (id: string) => void;
  onAddSupervisor: (supervisor: Omit<UserAccount, 'id' | 'createdAt' | 'role'>) => void;
  onDeleteSupervisor: (id: string) => void;
  onUpdateUserPassword: (userId: string, newPass: string) => void;
  onUpdateFamilyPassword: (familyId: string, newPass: string) => void;
  onLogout: () => void;
  onImportFamilies?: (importedFamilies: FamilyRecord[]) => void;
}

export const AdminSidebarLayout: React.FC<AdminSidebarLayoutProps> = ({
  adminUser,
  families,
  users,
  onAddNewFamily,
  onEditFamily,
  onViewFamily,
  onPrintFamily,
  onDeleteFamily,
  onAddSupervisor,
  onDeleteSupervisor,
  onUpdateUserPassword,
  onUpdateFamilyPassword,
  onLogout,
  onImportFamilies,
}) => {
  const [activeTab, setActiveTab] = useState<'families' | 'supervisors' | 'passwords' | 'stats'>(() => {
    try {
      const saved = localStorage.getItem('HKR_ADMIN_ACTIVE_TAB');
      if (saved && ['families', 'supervisors', 'passwords', 'stats'].includes(saved)) {
        return saved as any;
      }
    } catch {}
    return 'families';
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Persist active tab across browser sessions
  React.useEffect(() => {
    try {
      localStorage.setItem('HKR_ADMIN_ACTIVE_TAB', activeTab);
    } catch {}
  }, [activeTab]);

  // Supervisor Form State
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [pwaTab, setPwaTab] = useState<'install' | 'share'>('install');
  const [showAddSupervisorModal, setShowAddSupervisorModal] = useState(false);
  const [newSupName, setNewSupName] = useState('');
  const [newSupUsername, setNewSupUsername] = useState('');
  const [newSupPassword, setNewSupPassword] = useState('');
  const [newSupPhone, setNewSupPhone] = useState('');
  const [newSupArea, setNewSupArea] = useState('حكر الجامع');

  // Password Change State
  const [selectedUserToChangePass, setSelectedUserToChangePass] = useState<string>('');
  const [newPasswordValue, setNewPasswordValue] = useState<string>('');
  const [passSuccessMessage, setPassSuccessMessage] = useState<string>('');

  // Citizen Password Reset State
  const [citizenIdSearch, setCitizenIdSearch] = useState('');
  const [foundCitizenForPass, setFoundCitizenForPass] = useState<FamilyRecord | null>(null);
  const [newCitizenPassword, setNewCitizenPassword] = useState('');

  const supervisorsList = users.filter((u) => u.role === 'supervisor');

  const handleCreateSupervisor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName || !newSupUsername || !newSupPassword) return;

    onAddSupervisor({
      name: newSupName,
      username: newSupUsername.trim(),
      password: newSupPassword,
      phone: newSupPhone,
      assignedArea: newSupArea,
      isActive: true,
    });

    setNewSupName('');
    setNewSupUsername('');
    setNewSupPassword('');
    setNewSupPhone('');
    setShowAddSupervisorModal(false);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserToChangePass || !newPasswordValue) return;

    onUpdateUserPassword(selectedUserToChangePass, newPasswordValue);
    setPassSuccessMessage('تم تحديث كلمة المرور بنجاح!');
    setNewPasswordValue('');
    setTimeout(() => setPassSuccessMessage(''), 4000);
  };

  const handleCitizenSearchForPass = (e: React.FormEvent) => {
    e.preventDefault();
    const found = families.find((f) => f.headIdNumber === citizenIdSearch.trim() || f.id === citizenIdSearch.trim());
    setFoundCitizenForPass(found || null);
  };

  const handleCitizenPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundCitizenForPass || !newCitizenPassword) return;
    onUpdateFamilyPassword(foundCitizenForPass.id, newCitizenPassword);
    setPassSuccessMessage(`تم تغيير كلمة سر المواطن (${foundCitizenForPass.headName}) بنجاح!`);
    setNewCitizenPassword('');
    setTimeout(() => setPassSuccessMessage(''), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-white"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-sm">لوحة الأدمن الرئيسي - بيانات حكر الجامع</span>
        </div>
        <button
          onClick={onLogout}
          className="text-xs bg-rose-600/80 px-2.5 py-1 rounded-lg font-bold"
        >
          خروج
        </button>
      </div>

      {/* ADMIN SIDEBAR (لوحة خاصة جانبية للأدمن) */}
      <aside
        className={`${
          mobileSidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-72 bg-slate-900 text-slate-200 flex flex-col shrink-0 border-l border-slate-800 z-40 md:sticky md:top-0 md:h-screen overflow-y-auto`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
              ح
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-wide">بيانات حكر الجامع</h1>
              <span className="text-[11px] font-semibold text-emerald-400 block">لوحة تحكم الأدمن الرئيسي</span>
            </div>
          </div>

          <div className="mt-4 p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-100 truncate">{adminUser.name}</p>
              <p className="text-[10px] text-slate-400">صلاحيات الإدارة الكاملة (Super Admin)</p>
            </div>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="p-4 space-y-1.5 flex-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            القائمة الرئيسية
          </div>

          <button
            onClick={() => {
              setActiveTab('families');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'families'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4" />
              <span>جدول سجلات الأسر</span>
            </div>
            <span className="bg-slate-950/40 px-2 py-0.5 rounded-full text-[10px] font-mono">
              {families.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('supervisors');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'supervisors'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>إدارة المشرفين والكوادر</span>
            </div>
            <span className="bg-slate-950/40 px-2 py-0.5 rounded-full text-[10px] font-mono">
              {supervisorsList.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('passwords');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'passwords'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>تغيير كلمات المرور</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('stats');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>الإحصائيات والتقارير</span>
          </button>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <button
              onClick={onAddNewFamily}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-emerald-700 text-emerald-300 hover:text-white border border-emerald-500/30 px-3.5 py-2.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>تسجيل أسرة جديدة</span>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 p-2.5 rounded-xl transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج من لوحة الأدمن</span>
          </button>
          <div className="text-[10px] text-slate-500 text-center mt-3">
            حكر الجامع © {new Date().getFullYear()}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Top greeting banner */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              {activeTab === 'families' && 'إدارة السجلات العامة للأسر والمواطنين'}
              {activeTab === 'supervisors' && 'لوحة إدارة صلاحيات وإضافة وحذف المشرفين'}
              {activeTab === 'passwords' && 'لوحة تعديل وإعادة ضبط كلمات المرور'}
              {activeTab === 'stats' && 'إحصائيات وتحليلات بيانات حكر الجامع'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              منطقة حكر الجامع - دير البلح | كود الأدمن: {adminUser.username}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setPwaTab('install');
                setShowPwaModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 transition cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>تثبيت التطبيق 📲</span>
            </button>
            <button
              onClick={() => {
                setPwaTab('share');
                setShowPwaModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>رابط الويب 🌐</span>
            </button>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl">
              إجمالي الأسر: {families.length}
            </span>
            <span className="text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-xl">
              المشرفين: {supervisorsList.length}
            </span>
          </div>
        </div>

        {/* TAB 1: Families Table */}
        {activeTab === 'families' && (
          <div className="space-y-4">
            <AdminTable
              families={families}
              onAddNew={onAddNewFamily}
              onEdit={onEditFamily}
              onView={onViewFamily}
              onPrint={onPrintFamily}
              onDelete={onDeleteFamily}
              userRole="admin"
              onImportSuccess={onImportFamilies}
            />
          </div>
        )}

        {/* TAB 2: Supervisors Management (إضافة المشرفين وحذفهم) */}
        {activeTab === 'supervisors' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  قائمة المشرفين الميدانيين المعتمدين
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  المشرف يملك صلاحية البحث والتعديل والإضافة وطباعة الكشوفات لبيانات المواطنين، ولا يستطيع حذف المشرفين أو تعديل الإدارة.
                </p>
              </div>

              <button
                onClick={() => setShowAddSupervisorModal(true)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                إضافة مشرف جديد
              </button>
            </div>

            {/* Supervisors Cards / Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supervisorsList.map((sup) => (
                <div
                  key={sup.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{sup.name}</h4>
                        <span className="text-[11px] font-mono text-slate-500 block">
                          اسم المستخدم: {sup.username}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteSupervisor(sup.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="حذف المشرف نهائياً"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{sup.assignedArea || 'منطقة حكر الجامع'}</span>
                    </div>
                    {sup.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{sup.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono text-slate-700">كلمة المرور: {sup.password}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>تاريخ الإضافة: {sup.createdAt}</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      نشط ومصرح له
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Password Management (تغيير كلمات المرور) */}
        {activeTab === 'passwords' && (
          <div className="space-y-6 max-w-4xl">
            {passSuccessMessage && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl flex items-center gap-3 text-xs font-bold animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{passSuccessMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Section 1: Change Staff / Supervisor Password */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  تغيير كلمة مرور المشرفين أو الأدمن
                </h3>
                <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">اختر الحساب المراد تعديل كلمته</label>
                    <select
                      value={selectedUserToChangePass}
                      onChange={(e) => setSelectedUserToChangePass(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                      required
                    >
                      <option value="">-- اختر المستخدم --</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role === 'admin' ? 'مدير عام' : 'مشرف ميداني'}) - [{u.username}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">كلمة المرور الجديدة</label>
                    <input
                      type="text"
                      placeholder="أدخل كلمة المرور الجديدة"
                      value={newPasswordValue}
                      onChange={(e) => setNewPasswordValue(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl font-bold transition shadow-xs cursor-pointer"
                  >
                    حفظ وتحديث كلمة المرور
                  </button>
                </form>
              </div>

              {/* Section 2: Reset Citizen Password */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <KeyRound className="w-4 h-4 text-blue-600" />
                  إعادة ضبط وتغيير كلمة سر المواطن
                </h3>

                <form onSubmit={handleCitizenSearchForPass} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      ابحث برقم هوية المواطن (9 أرقام) أو كود الملف
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="902145876 أو HKR-2026-001"
                        value={citizenIdSearch}
                        onChange={(e) => setCitizenIdSearch(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                      <button
                        type="submit"
                        className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl font-bold cursor-pointer"
                      >
                        بحث
                      </button>
                    </div>
                  </div>
                </form>

                {foundCitizenForPass && (
                  <form onSubmit={handleCitizenPasswordChange} className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                      <p className="font-bold text-blue-950">{foundCitizenForPass.headName}</p>
                      <p className="text-[11px] text-blue-800 font-mono mt-0.5">
                        رقم الهوية: {foundCitizenForPass.headIdNumber} | كلمة السر الحالية: {foundCitizenForPass.password || 'غير محددة'}
                      </p>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">كلمة السر الجديدة للمواطن</label>
                      <input
                        type="text"
                        placeholder="أدخل كلمة السر الجديدة للمواطن"
                        value={newCitizenPassword}
                        onChange={(e) => setNewCitizenPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl font-bold transition cursor-pointer"
                    >
                      تأكيد تغيير كلمة سر المواطن
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Stats */}
        {activeTab === 'stats' && <StatsOverview families={families} />}
      </main>

      {/* Add Supervisor Modal */}
      {showAddSupervisorModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                إضافة مشرف ميداني جديد
              </h3>
              <button
                onClick={() => setShowAddSupervisorModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupervisor} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  اسم المشرف الكامل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: أ. محمود سالم الشافعي"
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  اسم المستخدم لتسجيل الدخول (Username) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: supervisor3"
                  value={newSupUsername}
                  onChange={(e) => setNewSupUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  كلمة المرور <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="كلمة مرور قوية"
                  value={newSupPassword}
                  onChange={(e) => setNewSupPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم الجوال</label>
                <input
                  type="text"
                  placeholder="0599xxxxxx"
                  value={newSupPhone}
                  onChange={(e) => setNewSupPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">منطقة الإشراف والتوزيع</label>
                <input
                  type="text"
                  placeholder="مثال: حكر الجامع - غرب المسجد / مخيم دير البلح"
                  value={newSupArea}
                  onChange={(e) => setNewSupArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSupervisorModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
                >
                  إضافة المشرف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PWA Install & Share Modal */}
      <PWAInstallAndShareModal
        isOpen={showPwaModal}
        onClose={() => setShowPwaModal(false)}
        defaultTab={pwaTab}
      />
    </div>
  );
};

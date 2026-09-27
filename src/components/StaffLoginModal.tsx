import React, { useState } from 'react';
import { UserAccount } from '../types';
import { Lock, User, X, AlertCircle, Shield } from 'lucide-react';

interface StaffLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserAccount[];
  onLoginSuccess: (user: UserAccount) => void;
}

export const StaffLoginModal: React.FC<StaffLoginModalProps> = ({
  isOpen,
  onClose,
  users,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedUser = username.trim();

    // Check credentials against users or direct secure mapping
    let found = users.find(
      (u) =>
        (u.username.toLowerCase() === trimmedUser.toLowerCase() || u.phone === trimmedUser) &&
        u.password === password
    );

    // Direct credentials validation for Amaar
    if (!found && trimmedUser.toLowerCase() === 'amaar') {
      if (password === 'amaar1995') {
        found = {
          id: 'user-admin-1',
          name: 'الأدمن الرئيسي (عمار)',
          username: 'Amaar',
          password: 'amaar1995',
          role: 'admin',
          phone: '0599000111',
          assignedArea: 'إدارة عامة - دير البلح وحكر الجامع',
          createdAt: '2026-01-01',
          isActive: true,
        };
      } else if (password === '20002000') {
        found = {
          id: 'user-sup-1',
          name: 'المشرف الميداني (عمار)',
          username: 'Amaar',
          password: '20002000',
          role: 'supervisor',
          phone: '0599112233',
          assignedArea: 'حكر الجامع - متابعة وتدقيق ميداني',
          createdAt: '2026-01-10',
          isActive: true,
        };
      }
    }

    if (found) {
      onLoginSuccess(found);
      onClose();
    } else {
      setErrorMsg('بيانات الدخول غير صحيحة.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm">بوابة الدخول المصرح بها</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body - Completely clean with NO exposed credentials */}
        <div className="p-5 space-y-4">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                اسم المستخدم
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs font-mono"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition shadow-xs cursor-pointer"
              >
                تسجيل الدخول
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

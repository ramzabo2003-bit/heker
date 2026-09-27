import React, { useState, useEffect } from 'react';
import { FamilyRecord, UserAccount } from './types';
import {
  getStoredFamilies,
  saveFamilies,
  addFamilyRecord,
  updateFamilyRecord,
  deleteFamilyRecord,
  getStoredUsers,
  saveUsers,
  addSupervisor,
  deleteSupervisor,
  updateUserPassword,
  updateFamilyPassword,
  bulkUpsertFamilies,
  getStoredSession,
  saveStoredSession,
  clearStoredSession,
} from './data/mockData';
import { MainLandingPage } from './components/MainLandingPage';
import { StaffLoginModal } from './components/StaffLoginModal';
import { CitizenDashboard } from './components/CitizenDashboard';
import { SupervisorDashboard } from './components/SupervisorDashboard';
import { AdminSidebarLayout } from './components/AdminSidebarLayout';
import { RegistrationForm } from './components/RegistrationForm';
import { FamilyDetailModal } from './components/FamilyDetailModal';
import { FamilyPrintCard } from './components/FamilyPrintCard';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [families, setFamilies] = useState<FamilyRecord[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);

  // Auth States
  const [currentStaffUser, setCurrentStaffUser] = useState<UserAccount | null>(null);
  const [currentCitizen, setCurrentCitizen] = useState<FamilyRecord | null>(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  // View States:
  // 'landing' | 'citizen' | 'admin' | 'supervisor' | 'form'
  const [isRegisteringOrEditing, setIsRegisteringOrEditing] = useState(false);
  const [editingFamily, setEditingFamily] = useState<FamilyRecord | null>(null);

  // Modals
  const [viewingFamily, setViewingFamily] = useState<FamilyRecord | null>(null);
  const [printingFamily, setPrintingFamily] = useState<FamilyRecord | null>(null);

  // Load from localStorage on startup & restore exact last position!
  useEffect(() => {
    const loadedFamilies = getStoredFamilies();
    const loadedUsers = getStoredUsers();
    const savedSession = getStoredSession();

    setFamilies(loadedFamilies);
    setUsers(loadedUsers);

    // 1. Restore Staff Session if present
    if (savedSession.staffUserId) {
      const foundStaff = loadedUsers.find((u) => u.id === savedSession.staffUserId);
      if (foundStaff && foundStaff.isActive) {
        setCurrentStaffUser(foundStaff);
      }
    } else if (savedSession.citizenFamilyId) {
      // 2. Restore Citizen Session if present
      const foundCitizen = loadedFamilies.find((f) => f.id === savedSession.citizenFamilyId);
      if (foundCitizen) {
        setCurrentCitizen(foundCitizen);
      }
    }

    // 3. Restore Registration or Editing State if they were in the middle of filling data
    if (savedSession.isRegisteringOrEditing) {
      if (savedSession.editingFamilyId) {
        const toEdit = loadedFamilies.find((f) => f.id === savedSession.editingFamilyId);
        if (toEdit) {
          setEditingFamily(toEdit);
        }
      }
      setIsRegisteringOrEditing(true);
    }
  }, []);

  // Citizen Login Handler
  const handleCitizenLoginSuccess = (family: FamilyRecord) => {
    setCurrentCitizen(family);
    setCurrentStaffUser(null);
    setIsRegisteringOrEditing(false);
    saveStoredSession({
      citizenFamilyId: family.id,
      staffUserId: null,
      isRegisteringOrEditing: false,
      editingFamilyId: null,
    });
  };

  // Staff (Admin / Supervisor) Login Handler
  const handleStaffLoginSuccess = (user: UserAccount) => {
    setCurrentStaffUser(user);
    setCurrentCitizen(null);
    setIsRegisteringOrEditing(false);
    saveStoredSession({
      staffUserId: user.id,
      citizenFamilyId: null,
      isRegisteringOrEditing: false,
      editingFamilyId: null,
    });
  };

  // Logout Handler
  const handleLogout = () => {
    setCurrentStaffUser(null);
    setCurrentCitizen(null);
    setIsRegisteringOrEditing(false);
    setEditingFamily(null);
    clearStoredSession();
  };

  // Start New Registration (from Landing, Admin, or Supervisor)
  const handleStartNewRegistration = () => {
    setEditingFamily(null);
    setIsRegisteringOrEditing(true);
    saveStoredSession({
      isRegisteringOrEditing: true,
      editingFamilyId: null,
    });
  };

  // Start Editing Family
  const handleStartEditFamily = (family: FamilyRecord) => {
    setEditingFamily(family);
    setIsRegisteringOrEditing(true);
    saveStoredSession({
      isRegisteringOrEditing: true,
      editingFamilyId: family.id,
    });
  };

  // Save Record (New or Edited)
  const handleSaveSuccess = (savedRecord: FamilyRecord) => {
    if (editingFamily) {
      const updated = updateFamilyRecord(savedRecord);
      setFamilies(updated);
      if (currentCitizen && currentCitizen.id === savedRecord.id) {
        setCurrentCitizen(savedRecord);
      }
    } else {
      const updated = [savedRecord, ...families.filter((f) => f.id !== savedRecord.id)];
      saveFamilies(updated);
      setFamilies(updated);
      // If a guest registered from landing page, log them into their new citizen dashboard!
      if (!currentStaffUser) {
        setCurrentCitizen(savedRecord);
      }
    }
    setIsRegisteringOrEditing(false);
    setEditingFamily(null);
    saveStoredSession({
      isRegisteringOrEditing: false,
      editingFamilyId: null,
      citizenFamilyId: currentStaffUser ? null : savedRecord.id,
    });
  };

  // Delete Family (Admin Only)
  const handleDeleteFamily = (id: string) => {
    const updated = deleteFamilyRecord(id);
    setFamilies(updated);
    if (currentCitizen && currentCitizen.id === id) {
      handleLogout();
    }
  };

  // Add Supervisor (Admin Only)
  const handleAddSupervisor = (newSup: Omit<UserAccount, 'id' | 'createdAt' | 'role'>) => {
    const created = addSupervisor(newSup);
    const updated = getStoredUsers();
    setUsers(updated);
  };

  // Delete Supervisor (Admin Only)
  const handleDeleteSupervisor = (id: string) => {
    const updated = deleteSupervisor(id);
    setUsers(updated);
  };

  // Update Staff Password (Admin Only)
  const handleUpdateUserPassword = (userId: string, newPass: string) => {
    const updated = updateUserPassword(userId, newPass);
    setUsers(updated);
    if (currentStaffUser && currentStaffUser.id === userId) {
      setCurrentStaffUser((prev: UserAccount | null) => (prev ? { ...prev, password: newPass } : null));
    }
  };

  // Update Family / Citizen Password
  const handleUpdateFamilyPassword = (familyId: string, newPass: string) => {
    const updated = updateFamilyPassword(familyId, newPass);
    setFamilies(updated);
    if (currentCitizen && currentCitizen.id === familyId) {
      setCurrentCitizen((prev: FamilyRecord | null) => (prev ? { ...prev, password: newPass } : null));
    }
  };

  // Bulk import families from Excel file
  const handleImportFamilies = (importedFamilies: FamilyRecord[]) => {
    const { updatedList } = bulkUpsertFamilies(importedFamilies, true);
    setFamilies(updatedList);
  };

  // Render Registration Form view
  if (isRegisteringOrEditing) {
    return (
      <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900">
                {editingFamily
                  ? `تعديل واستكمال بيانات الأسرة: ${editingFamily.headName}`
                  : 'استمارة تسجيل أسرة جديدة - بيانات حكر الجامع'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                دير البلح | استيفاء كافة الحقول إلزامي لمنح صلاحية إنهاء التسجيل واعتماد الطلب
              </p>
            </div>

            <button
              onClick={() => {
                setIsRegisteringOrEditing(false);
                setEditingFamily(null);
                saveStoredSession({
                  isRegisteringOrEditing: false,
                  editingFamilyId: null,
                });
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>إلغاء والعودة</span>
            </button>
          </div>

          <RegistrationForm
            initialData={editingFamily}
            existingFamilies={families}
            onSaveSuccess={handleSaveSuccess}
            onCancel={() => {
              setIsRegisteringOrEditing(false);
              setEditingFamily(null);
              saveStoredSession({
                isRegisteringOrEditing: false,
                editingFamilyId: null,
              });
            }}
            onPrintPreview={(rec) => setPrintingFamily(rec)}
          />
        </div>

        {printingFamily && (
          <FamilyPrintCard
            family={printingFamily}
            onClose={() => setPrintingFamily(null)}
          />
        )}
      </div>
    );
  }

  // 1. ADMIN DASHBOARD (with side panel)
  if (currentStaffUser && currentStaffUser.role === 'admin') {
    return (
      <>
        <AdminSidebarLayout
          adminUser={currentStaffUser}
          families={families}
          users={users}
          onAddNewFamily={handleStartNewRegistration}
          onEditFamily={handleStartEditFamily}
          onViewFamily={(f) => setViewingFamily(f)}
          onPrintFamily={(f) => setPrintingFamily(f)}
          onDeleteFamily={handleDeleteFamily}
          onAddSupervisor={handleAddSupervisor}
          onDeleteSupervisor={handleDeleteSupervisor}
          onUpdateUserPassword={handleUpdateUserPassword}
          onUpdateFamilyPassword={handleUpdateFamilyPassword}
          onLogout={handleLogout}
          onImportFamilies={handleImportFamilies}
        />

        {viewingFamily && (
          <FamilyDetailModal
            family={viewingFamily}
            onClose={() => setViewingFamily(null)}
            onEdit={handleStartEditFamily}
            onPrint={(f) => setPrintingFamily(f)}
          />
        )}

        {printingFamily && (
          <FamilyPrintCard
            family={printingFamily}
            onClose={() => setPrintingFamily(null)}
          />
        )}
      </>
    );
  }

  // 2. SUPERVISOR DASHBOARD (edit, search, add, print)
  if (currentStaffUser && currentStaffUser.role === 'supervisor') {
    return (
      <>
        <SupervisorDashboard
          supervisor={currentStaffUser}
          families={families}
          onAddNewFamily={handleStartNewRegistration}
          onEditFamily={handleStartEditFamily}
          onViewFamily={(f) => setViewingFamily(f)}
          onPrintFamily={(f) => setPrintingFamily(f)}
          onLogout={handleLogout}
        />

        {viewingFamily && (
          <FamilyDetailModal
            family={viewingFamily}
            onClose={() => setViewingFamily(null)}
            onEdit={handleStartEditFamily}
            onPrint={(f) => setPrintingFamily(f)}
          />
        )}

        {printingFamily && (
          <FamilyPrintCard
            family={printingFamily}
            onClose={() => setPrintingFamily(null)}
          />
        )}
      </>
    );
  }

  // 3. CITIZEN DASHBOARD (own file view, complete missing data, print card)
  if (currentCitizen) {
    return (
      <>
        <CitizenDashboard
          family={currentCitizen}
          allFamilies={families}
          onEditFamily={handleStartEditFamily}
          onUpdateFamilyRecord={(updatedRecord) => handleSaveSuccess(updatedRecord)}
          onPrintCard={(f) => setPrintingFamily(f)}
          onUpdatePassword={handleUpdateFamilyPassword}
          onLogout={handleLogout}
        />

        {printingFamily && (
          <FamilyPrintCard
            family={printingFamily}
            onClose={() => setPrintingFamily(null)}
          />
        )}
      </>
    );
  }

  // 4. MAIN LANDING PAGE (Unified Citizen Portal: Query + New Registration in one board)
  return (
    <>
      <MainLandingPage
        families={families}
        onCitizenLoginSuccess={handleCitizenLoginSuccess}
        onSaveNewFamily={handleSaveSuccess}
        onOpenStaffLogin={() => setIsStaffModalOpen(true)}
        onPrintPreview={(f) => setPrintingFamily(f)}
      />

      <StaffLoginModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        users={users}
        onLoginSuccess={handleStaffLoginSuccess}
      />

      {printingFamily && (
        <FamilyPrintCard
          family={printingFamily}
          onClose={() => setPrintingFamily(null)}
        />
      )}
    </>
  );
}

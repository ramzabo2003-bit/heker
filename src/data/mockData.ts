import { FamilyRecord, UserAccount } from '../types';
import { normalizeArabicText } from '../utils/duplicateCheck';

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-admin-1',
    name: 'الأدمن الرئيسي (عمار)',
    username: 'Amaar',
    password: 'amaar1995',
    role: 'admin',
    phone: '0599000111',
    assignedArea: 'إدارة عامة - دير البلح وحكر الجامع',
    createdAt: '2026-01-01',
    isActive: true,
  },
  {
    id: 'user-sup-1',
    name: 'المشرف الميداني (عمار)',
    username: 'Amaar',
    password: '20002000',
    role: 'supervisor',
    phone: '0599112233',
    assignedArea: 'حكر الجامع - متابعة وتدقيق ميداني',
    createdAt: '2026-01-10',
    isActive: true,
  },
];

export const INITIAL_FAMILIES: FamilyRecord[] = [
  {
    id: 'HKR-2026-001',
    submissionDate: '2026-01-15',
    lastUpdated: '2026-03-10',
    status: 'مستوفي كامل البيانات',
    password: '123456',
    headName: 'أحمد محمود إسماعيل النجار',
    headIdNumber: '902145876',
    headBirthDate: '1982-04-12',
    maritalStatus: 'متزوج',
    headOccupation: 'عامل يومي (أجر يومي)',
    residencyStatus: 'نازح',
    wives: [
      {
        id: 'w-1',
        name: 'مريم خليل يوسف النجار',
        idNumber: '904587123',
        birthDate: '1986-08-25',
      },
    ],
    childrenCount: 4,
    children: [
      {
        id: 'c-1',
        name: 'محمود أحمد النجار',
        idNumber: '405128963',
        birthDate: '2007-03-14',
        gender: 'ذكر',
        grade: 'توجيهي (ثانوية عامة)',
        isTawjihiOrUniversity: true,
        academicAverage: '89.4%',
      },
      {
        id: 'c-2',
        name: 'سارة أحمد النجار',
        idNumber: '407852147',
        birthDate: '2012-07-20',
        gender: 'أنثى',
        grade: 'السابع الأساسي',
      },
      {
        id: 'c-3',
        name: 'يوسف أحمد النجار',
        idNumber: '410963258',
        birthDate: '2016-11-05',
        gender: 'ذكر',
        grade: 'الرابع الأساسي',
      },
      {
        id: 'c-4',
        name: 'جنى أحمد النجار',
        idNumber: '415789654',
        birthDate: '2020-02-18',
        gender: 'أنثى',
        grade: 'روضة أطفال',
      },
    ],
    isHeadSick: true,
    illnessType: 'انزلاق غضروفي بالفقرات القطنية',
    isChronic: true,
    chronicDetails: 'ارتفاع ضغط الدم المزمن ويحتاج علاجاً شهرياً',
    hasWarLoss: true,
    lostPersonName: 'محمود إسماعيل النجار (الوالد)',
    lostPersonStatus: 'شهيد',
    lostPersonRelation: 'والد رب الأسرة',
    lostPersonDate: '2023-11-18',
    hasWarInjury: false,
    housingType: 'خيمة / مركز إيواء',
    housingCondition: 'غير صالح للسكن',
    city: 'دير البلح',
    area: 'حكر الجامع',
    neighborhood: 'شارع البيئة - غرب المسجد القديم',
    nearestLandmark: 'مسجد حكر الجامع الكبير ومدرسة دير البلح الإعدادية',
    primaryPhone: '0599123456',
    secondaryPhone: '0568987654',
    whatsappPhone: '0599123456',
    walletType: 'محفظة بال باي (PalPay)',
    walletNumber: 'PAL-902145876',
    accountHolderName: 'أحمد محمود إسماعيل النجار',
    accountHolderRelationship: 'رب الأسرة نفسه',
    notes: 'تم فحص أوراق الهوية ومطابقتها من قبل لجنة الإغاثة الميدانية.',
  },
  {
    id: 'HKR-2026-002',
    submissionDate: '2026-02-01',
    lastUpdated: '2026-03-18',
    status: 'معتمد',
    headName: 'خالد سليم حسن قديح',
    headIdNumber: '921478523',
    headBirthDate: '1977-11-03',
    maritalStatus: 'متزوج',
    headOccupation: 'مهني / صاحب حرفة (نجار، حداد، خياط)',
    residencyStatus: 'مقيم',
    wives: [
      {
        id: 'w-2',
        name: 'فاطمة عبد الرحيم صيام',
        idNumber: '923654789',
        birthDate: '1981-05-19',
      },
    ],
    childrenCount: 3,
    children: [
      {
        id: 'c-5',
        name: 'إبراهيم خالد قديح',
        idNumber: '409632587',
        birthDate: '2005-09-10',
        gender: 'ذكر',
        grade: 'طالب جامعي',
        isTawjihiOrUniversity: true,
        isUniversityStudent: true,
        universityName: 'جامعة الأقصى',
        universityMajor: 'تمريض عام وطوارئ',
        universityGpa: '86.5%',
        universitySemester: 'الفصل الثاني - السنة الثالثة',
        hasAccumulatedFees: true,
        accumulatedFeesAmount: '1650 شيكل',
      },
      {
        id: 'c-6',
        name: 'نور خالد قديح',
        idNumber: '412365894',
        birthDate: '2014-04-22',
        gender: 'أنثى',
        grade: 'الخامس الأساسي',
      },
      {
        id: 'c-7',
        name: 'عمر خالد قديح',
        idNumber: '417852963',
        birthDate: '2018-12-30',
        gender: 'ذكر',
        grade: 'الثاني الأساسي',
      },
    ],
    isHeadSick: true,
    illnessType: 'إصابة بشظايا متعددة بالطرف السفلي الأيمن',
    isChronic: false,
    hasWarLoss: false,
    hasWarInjury: true,
    warInjuryType: 'شظايا متفرقة وكسر مضاعف في الساق اليمنى',
    warInjuryDate: '2024-02-14',
    warInjuryDetails: 'إصابة حرب بشظايا بالقدم وعجز حركي جزئي بنسبة 35%',
    housingType: 'منزل متضرر جزئياً',
    housingCondition: 'صالح جزئياً',
    city: 'دير البلح',
    area: 'حكر الجامع',
    neighborhood: 'حارة القدايحة',
    nearestLandmark: 'بجوار صيدلية النور ومحول الكهرباء الغربي',
    primaryPhone: '0569874123',
    secondaryPhone: '0598741236',
    whatsappPhone: '0569874123',
    walletType: 'حساب بنك فلسطين',
    walletNumber: '2541098/001',
    accountHolderName: 'خالد سليم حسن قديح',
    accountHolderRelationship: 'رب الأسرة نفسه',
    notes: 'الأسرة بحاجة ماسة لمساعدات طبية وترميم جزئي للغرف المتضررة ورسوم جامعية لابنهم.',
  },
  {
    id: 'HKR-2026-003',
    submissionDate: '2026-02-14',
    lastUpdated: '2026-03-22',
    status: 'مكتمل',
    headName: 'منى عبد الكريم إبراهيم أبو معيلق',
    headIdNumber: '915632478',
    headBirthDate: '1984-06-18',
    maritalStatus: 'أرمل',
    headOccupation: 'ربة منزل ومعيلة للأسرة',
    residencyStatus: 'نازح',
    wives: [],
    childrenCount: 2,
    children: [
      {
        id: 'c-8',
        name: 'بلال سمير أبو معيلق',
        idNumber: '408965412',
        birthDate: '2010-01-15',
        gender: 'ذكر',
        grade: 'التاسع الأساسي',
      },
      {
        id: 'c-9',
        name: 'آية سمير أبو معيلق',
        idNumber: '413258741',
        birthDate: '2015-08-08',
        gender: 'أنثى',
        grade: 'الرابع الأساسي',
      },
    ],
    isHeadSick: false,
    isChronic: true,
    chronicDetails: 'مرض السكري من النوع الثاني',
    hasWarLoss: true,
    lostPersonName: 'سمير خليل أبو معيلق (الزوج)',
    lostPersonStatus: 'شهيد',
    lostPersonRelation: 'زوج المعيلة',
    lostPersonDate: '2023-12-05',
    hasWarInjury: false,
    housingType: 'إيجار',
    housingCondition: 'صالح جزئياً',
    city: 'دير البلح',
    area: 'حكر الجامع',
    neighborhood: 'حي البصة - حكر الجامع',
    nearestLandmark: 'مقابل بقالة أبو طارق الشافعي',
    primaryPhone: '0592345678',
    whatsappPhone: '0592345678',
    walletType: 'محفظة جوال بي (Jawwal Pay)',
    walletNumber: '0592345678',
    accountHolderName: 'منى عبد الكريم إبراهيم أبو معيلق',
    accountHolderRelationship: 'رب الأسرة نفسها',
    notes: 'أسرة أرملة شهيد تعيل طفلين يتيمين.',
  },
  {
    id: 'HKR-2026-004',
    submissionDate: '2026-03-01',
    lastUpdated: '2026-03-24',
    status: 'معتمد',
    headName: 'طارق زياد عبد الفتاح شعت',
    headIdNumber: '908745632',
    headBirthDate: '1990-09-05',
    maritalStatus: 'متزوج',
    headOccupation: 'سائق (مركبة / شاحنة)',
    residencyStatus: 'نازح',
    wives: [
      {
        id: 'w-3',
        name: 'هناء محمد رفيق اللوح',
        idNumber: '912365478',
        birthDate: '1993-12-14',
      },
    ],
    childrenCount: 3,
    children: [
      {
        id: 'c-10',
        name: 'زياد طارق شعت',
        idNumber: '416541236',
        birthDate: '2019-06-11',
        gender: 'ذكر',
        grade: 'أول ابتدائي',
      },
      {
        id: 'c-11',
        name: 'ميرا طارق شعت',
        idNumber: '418965231',
        birthDate: '2021-10-02',
        gender: 'أنثى',
        grade: 'روضة أطفال',
      },
      {
        id: 'c-12',
        name: 'حمزة طارق شعت',
        idNumber: '420125896',
        birthDate: '2024-03-15',
        gender: 'ذكر',
        grade: 'دون سن الدراسة (رضيع)',
      },
    ],
    isHeadSick: false,
    isChronic: false,
    hasWarLoss: false,
    hasWarInjury: true,
    warInjuryType: 'شظايا ضغط انفجاري وثقب بطبلة الأذن وضعف سمعي',
    warInjuryDate: '2024-01-20',
    warInjuryDetails: 'إصابة بشظايا أدت إلى ضعف بالسمع بالأذن اليمنى',
    housingType: 'خيمة / مركز إيواء',
    housingCondition: 'غير صالح للسكن',
    city: 'دير البلح',
    area: 'حكر الجامع',
    neighborhood: 'منطقة الأراضي الغربية',
    nearestLandmark: 'قرب خزان مياه البلدية',
    primaryPhone: '0597112233',
    secondaryPhone: '0567223344',
    whatsappPhone: '0597112233',
    walletType: 'محفظة بال باي (PalPay)',
    walletNumber: 'PAL-908745632',
    accountHolderName: 'طارق زياد عبد الفتاح شعت',
    accountHolderRelationship: 'رب الأسرة نفسه',
    notes: 'الخيمة تحتاج لشادر وألواح نايلون عازلة للأمطار.',
  },
  {
    id: 'HKR-2026-005',
    submissionDate: '2026-03-05',
    lastUpdated: '2026-03-25',
    status: 'قيد المراجعة',
    headName: 'ماجد عوض الله محمود درويش',
    headIdNumber: '901254789',
    headBirthDate: '1972-02-28',
    maritalStatus: 'متزوج',
    headOccupation: 'غير قادر على العمل (مرض مزمن / إصابة / عجز)',
    residencyStatus: 'مقيم',
    wives: [
      {
        id: 'w-4',
        name: 'ابتسام سالم عبد الله درويش',
        idNumber: '905874125',
        birthDate: '1975-04-16',
      },
    ],
    childrenCount: 5,
    children: [
      {
        id: 'c-13',
        name: 'محمود ماجد درويش',
        idNumber: '401254789',
        birthDate: '2004-05-12',
        gender: 'ذكر',
        grade: 'طالب جامعي',
        isTawjihiOrUniversity: true,
        isUniversityStudent: true,
        universityName: 'الجامعة الإسلامية بغزة',
        universityMajor: 'هندسة حاسوب ونظم معلومات',
        universityGpa: '88.9%',
        universitySemester: 'الفصل الأول - السنة الرابعة',
        hasAccumulatedFees: true,
        accumulatedFeesAmount: '2400 دينار أردني',
      },
      {
        id: 'c-14',
        name: 'سلام ماجد درويش',
        idNumber: '404587123',
        birthDate: '2007-08-20',
        gender: 'أنثى',
        grade: 'توجيهي (ثانوية عامة)',
        isTawjihiOrUniversity: true,
        academicAverage: '93.2%',
      },
      {
        id: 'c-15',
        name: 'عبد الله ماجد درويش',
        idNumber: '407896541',
        birthDate: '2011-12-01',
        gender: 'ذكر',
        grade: 'الثامن الأساسي',
      },
      {
        id: 'c-16',
        name: 'شهد ماجد درويش',
        idNumber: '411254789',
        birthDate: '2014-03-14',
        gender: 'أنثى',
        grade: 'الخامس الأساسي',
      },
      {
        id: 'c-17',
        name: 'كريم ماجد درويش',
        idNumber: '415896321',
        birthDate: '2017-09-29',
        gender: 'ذكر',
        grade: 'الثالث الأساسي',
      },
    ],
    isHeadSick: true,
    illnessType: 'قصور في وظائف الكلى وضعف بعضلة القلب',
    isChronic: true,
    chronicDetails: 'فشل كلوي جزئي ومتابعة غسيل كلوي في مستشفى شهداء الأقصى',
    hasWarLoss: false,
    hasWarInjury: false,
    housingType: 'استضافة لدى أقارب',
    housingCondition: 'صالح جزئياً',
    city: 'دير البلح',
    area: 'حكر الجامع',
    neighborhood: 'شارع السلام - قرب ديوان عائلة درويش',
    nearestLandmark: 'ديوان عائلة درويش ومخبز البركة',
    primaryPhone: '0598855441',
    whatsappPhone: '0598855441',
    walletType: 'حساب بنك فلسطين',
    walletNumber: '1987542/002',
    accountHolderName: 'محمود ماجد درويش',
    accountHolderRelationship: 'الابن الأكبر لرب الأسرة',
    notes: 'حالة طبية حرجة تستوجب أولوية الدعم الصحي والنقدي ورسوم متراكمة بالجامعة.',
  },
];

const STORAGE_KEY = 'hekr_aljameh_family_records_v2';

export function getStoredFamilies(): FamilyRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FAMILIES));
      return INITIAL_FAMILIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_FAMILIES;
  } catch (err) {
    console.error('Error reading localStorage:', err);
    return INITIAL_FAMILIES;
  }
}

export function saveFamilies(families: FamilyRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(families));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}

export function addFamilyRecord(newRecord: Omit<FamilyRecord, 'id' | 'submissionDate' | 'lastUpdated'>): FamilyRecord {
  const families = getStoredFamilies();
  const dateStr = new Date().toISOString().split('T')[0];

  const cleanHeadId = newRecord.headIdNumber ? newRecord.headIdNumber.replace(/\D/g, '') : '';
  const normHeadName = normalizeArabicText(newRecord.headName);

  // Check if head National ID or identical full name already exists in database
  const existingIndex = families.findIndex((f) => {
    const idMatch = cleanHeadId && f.headIdNumber.replace(/\D/g, '') === cleanHeadId;
    const nameMatch = normHeadName && normalizeArabicText(f.headName) === normHeadName;
    return idMatch || nameMatch;
  });

  if (existingIndex >= 0) {
    // Prevent duplicate: Update existing record instead of creating duplicate!
    const existing = families[existingIndex];
    const updatedRecord: FamilyRecord = {
      ...existing,
      ...newRecord,
      id: existing.id,
      submissionDate: existing.submissionDate,
      lastUpdated: dateStr,
    };
    families[existingIndex] = updatedRecord;
    saveFamilies(families);
    return updatedRecord;
  }

  const nextNum = (families.length + 1).toString().padStart(3, '0');
  const createdRecord: FamilyRecord = {
    ...newRecord,
    id: `HKR-2026-${nextNum}`,
    submissionDate: dateStr,
    lastUpdated: dateStr,
  };
  const updated = [createdRecord, ...families];
  saveFamilies(updated);
  return createdRecord;
}

export function updateFamilyRecord(record: FamilyRecord): FamilyRecord[] {
  const families = getStoredFamilies();
  const dateStr = new Date().toISOString().split('T')[0];
  const updated = families.map((f) => (f.id === record.id ? { ...record, lastUpdated: dateStr } : f));
  saveFamilies(updated);
  return updated;
}

export function deleteFamilyRecord(id: string): FamilyRecord[] {
  const families = getStoredFamilies();
  const updated = families.filter((f) => f.id !== id);
  saveFamilies(updated);
  return updated;
}

const USERS_STORAGE_KEY = 'hekr_aljameh_users_v2';

export function getStoredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_USERS;
  } catch (err) {
    console.error('Error reading users from localStorage:', err);
    return INITIAL_USERS;
  }
}

export function saveUsers(users: UserAccount[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving users to localStorage:', err);
  }
}

export function addSupervisor(
  newSupervisor: Omit<UserAccount, 'id' | 'createdAt' | 'role'>
): UserAccount {
  const users = getStoredUsers();
  const dateStr = new Date().toISOString().split('T')[0];
  const newAccount: UserAccount = {
    ...newSupervisor,
    id: `user-sup-${Date.now()}`,
    role: 'supervisor',
    createdAt: dateStr,
    isActive: true,
  };
  const updated = [...users, newAccount];
  saveUsers(updated);
  return newAccount;
}

export function deleteSupervisor(id: string): UserAccount[] {
  const users = getStoredUsers();
  // Prevent deleting primary admin
  const updated = users.filter((u) => u.id !== id || u.role !== 'supervisor');
  saveUsers(updated);
  return updated;
}

export function updateUserPassword(userId: string, newPassword: string): UserAccount[] {
  const users = getStoredUsers();
  const updated = users.map((u) => (u.id === userId ? { ...u, password: newPassword } : u));
  saveUsers(updated);
  return updated;
}

export function updateFamilyPassword(familyId: string, newPassword: string): FamilyRecord[] {
  const families = getStoredFamilies();
  const dateStr = new Date().toISOString().split('T')[0];
  const updated = families.map((f) =>
    f.id === familyId ? { ...f, password: newPassword, lastUpdated: dateStr } : f
  );
  saveFamilies(updated);
  return updated;
}

export function bulkUpsertFamilies(
  importedRecords: FamilyRecord[],
  updateExisting: boolean = true
): { updatedList: FamilyRecord[]; addedCount: number; updatedCount: number } {
  const currentFamilies = getStoredFamilies();
  const dateStr = new Date().toISOString().split('T')[0];

  let addedCount = 0;
  let updatedCount = 0;
  const currentMap = new Map<string, FamilyRecord>();

  // Map by headIdNumber as well as id
  currentFamilies.forEach((f) => {
    currentMap.set(f.headIdNumber, f);
  });

  const finalRecords: FamilyRecord[] = [...currentFamilies];

  importedRecords.forEach((imported) => {
    const cleanImportedId = imported.headIdNumber ? imported.headIdNumber.replace(/\D/g, '') : '';
    const normImportedName = normalizeArabicText(imported.headName);

    const existingIndex = finalRecords.findIndex((f) => {
      const idMatch = cleanImportedId && f.headIdNumber.replace(/\D/g, '') === cleanImportedId;
      const codeMatch = imported.id && f.id.toLowerCase() === imported.id.toLowerCase();
      const nameMatch = normImportedName && normalizeArabicText(f.headName) === normImportedName;
      return idMatch || codeMatch || nameMatch;
    });

    if (existingIndex >= 0) {
      if (updateExisting) {
        // Merge records preserving existing detailed data unless imported has non-empty values
        const existing = finalRecords[existingIndex];
        const merged: FamilyRecord = {
          ...existing,
          ...imported,
          // preserve id and submissionDate of existing record
          id: existing.id,
          submissionDate: existing.submissionDate,
          lastUpdated: dateStr,
          isImportedFromExcel: true,
          // keep existing wives/children if imported doesn't provide them
          wives: (imported.wives && imported.wives.length > 0) ? imported.wives : existing.wives,
          children: (imported.children && imported.children.length > 0) ? imported.children : existing.children,
          childrenCount: imported.childrenCount || existing.childrenCount,
          password: existing.password || imported.password || imported.headIdNumber || '123456',
        };
        finalRecords[existingIndex] = merged;
        updatedCount++;
      }
    } else {
      // Add new record
      const nextNum = (finalRecords.length + 1).toString().padStart(3, '0');
      const newRec: FamilyRecord = {
        ...imported,
        id: imported.id || `HKR-2026-${nextNum}`,
        submissionDate: dateStr,
        lastUpdated: dateStr,
        isImportedFromExcel: true,
        password: imported.password || imported.headIdNumber || '123456',
      };
      finalRecords.unshift(newRec);
      addedCount++;
    }
  });

  saveFamilies(finalRecords);
  return { updatedList: finalRecords, addedCount, updatedCount };
}

export interface ActiveSession {
  staffUserId: string | null;
  citizenFamilyId: string | null;
  isRegisteringOrEditing: boolean;
  editingFamilyId: string | null;
}

const SESSION_STORAGE_KEY = 'hekr_aljameh_active_session_v3';

export function getStoredSession(): ActiveSession {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return {
        staffUserId: null,
        citizenFamilyId: null,
        isRegisteringOrEditing: false,
        editingFamilyId: null,
      };
    }
    const parsed = JSON.parse(raw);
    return {
      staffUserId: parsed.staffUserId || null,
      citizenFamilyId: parsed.citizenFamilyId || null,
      isRegisteringOrEditing: Boolean(parsed.isRegisteringOrEditing),
      editingFamilyId: parsed.editingFamilyId || null,
    };
  } catch {
    return {
      staffUserId: null,
      citizenFamilyId: null,
      isRegisteringOrEditing: false,
      editingFamilyId: null,
    };
  }
}

export function saveStoredSession(session: Partial<ActiveSession>): void {
  try {
    const current = getStoredSession();
    const updated = { ...current, ...session };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving session to localStorage:', err);
  }
}

export function clearStoredSession(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing session from localStorage:', err);
  }
}


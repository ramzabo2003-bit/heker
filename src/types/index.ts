export type ResidencyStatus = 'مقيم' | 'نازح';

export interface ChildRecord {
  id: string;
  name: string;
  idNumber: string; // رقم هوية الطفل / الابن
  birthDate: string; // تاريخ ميلاد الطفل
  gender: 'ذكر' | 'أنثى';
  grade: string; // الصف الدراسي
  
  // بيانات التوجيهي والجامعة
  isTawjihiOrUniversity?: boolean; // هل الابن/الابنة في توجيهي أو الجامعة
  academicAverage?: string; // تحديد المعدل (لتوجيهي أو المعدل العام)
  
  // في حال كان في الجامعة
  isUniversityStudent?: boolean; // هل هو طالب جامعي
  universityName?: string; // اسم الجامعة
  universityMajor?: string; // التخصص
  universityGpa?: string; // المعدل الجامعي
  universitySemester?: string; // الفصل الدراسي
  hasAccumulatedFees?: boolean; // هل يوجد رسوم متراكمة لم تستطع سدادها
  accumulatedFeesAmount?: string | number; // كم المبلغ المتراكم
}

export interface WifeRecord {
  id: string;
  name: string;
  idNumber: string; // رقم هوية الزوجة
  birthDate: string; // تاريخ ميلاد الزوجة
}

export type MaritalStatus = 'متزوج' | 'أعزب' | 'أرمل' | 'مطلق' | 'منفصل';

export type HousingType =
  | 'ملك'
  | 'إيجار'
  | 'خيمة / مركز إيواء'
  | 'كرفان'
  | 'استضافة لدى أقارب'
  | 'منزل متضرر جزئياً';

export type HousingCondition =
  | 'صالح للسكن'
  | 'صالح جزئياً'
  | 'غير صالح للسكن'
  | 'مدمر كلياً'
  | 'مدمر جزئياً';

export type WalletType =
  | 'محفظة بال باي (PalPay)'
  | 'محفظة جوال بي (Jawwal Pay)'
  | 'حساب بنك فلسطين'
  | 'محفظة كاش كابيتال'
  | 'حساب بنكي آخر'
  | 'لا يوجد محفظة';

export interface FamilyRecord {
  id: string; // معرف الملف مثل HKR-2026-104
  submissionDate: string;
  lastUpdated: string;
  status: 'مستوفي كامل البيانات' | 'معتمد' | 'قيد المراجعة' | 'مكتمل' | 'يحتاج استكمال';
  
  // 1. بيانات رب الأسرة
  headName: string; // اسم رب الاسرة
  headIdNumber: string; // رقم الهوية
  headBirthDate: string; // تاريخ الميلاد
  maritalStatus: MaritalStatus; // الحالة الاجتماعية
  headOccupation?: string; // عمل رب الأسرة / المهنة والوضع الوظيفي
  
  // حالة الإقامة
  residencyStatus: ResidencyStatus; // مقيم / نازح
  
  // 2. بيانات الزوجة
  wives: WifeRecord[]; // الزوجة أو الزوجات
  
  // 3. الأطفال
  childrenCount: number; // عدد الأطفال
  children: ChildRecord[]; // بيانات الأطفال
  
  // 4. الوضع الصحي وآثار الحرب والشهداء
  isHeadSick: boolean; // هل رب الاسرة مريض
  illnessType?: string; // يرجى تحديد نوع المرض
  isChronic: boolean; // مزمن
  chronicDetails?: string; // تفاصيل المرض المزمن
  
  // شهداء ومفقودو العائلة خلال الحرب
  hasWarLoss: boolean; // هل فقدت أحد أفراد العائلة خلال الحرب
  lostPersonName?: string; // اسم الشهيد او المفقود
  lostPersonStatus?: 'شهيد' | 'مفقود'; // صفة الفقد: شهيد / مفقود
  lostPersonRelation?: string; // صلة القرابة (ابن، ابنة، والد، والدة، زوجة، أخ...)
  lostPersonDate?: string; // تاريخ الاستشهاد او الفقد
  
  // إصابات الحرب
  hasWarInjury: boolean; // هل تعرضت لإصابة خلال الحرب
  warInjuryType?: string; // نوع الإصابة
  warInjuryDate?: string; // تاريخ الإصابة
  warInjuryDetails?: string; // تفاصيل إضافية عن الإصابة ونسبة العجز إن وجدت
  
  // 5. السكن والعنوان
  housingType: HousingType; // نوع السكن
  housingCondition: HousingCondition; // حالة السكن
  city: string; // المدينة
  area: string; // المنطقة
  neighborhood: string; // الحي
  nearestLandmark: string; // أقرب معلم
  
  // 6. بيانات الاتصال
  primaryPhone: string; // رقم جوال اساسي
  secondaryPhone?: string; // رقم جوال بديل
  whatsappPhone: string; // رقم واتس اب
  
  // 7. المحفظة والبيانات المالية
  walletType: WalletType; // نوع المحفظة / الحساب
  walletNumber: string; // رقم محفظة بال باي او جوال بي او بنك فلسطين
  accountHolderName: string; // اسم صاحب الحساب
  accountHolderRelationship: string; // صلة القرابة
  
  notes?: string;
  password?: string; // كلمة سر المواطن لمتابعة طلبه وتعديل بياناته
  
  // حقول خاصة باستيراد الكشوفات واستكمال البيانات الناقصة
  isImportedFromExcel?: boolean; // هل تم استيراد السجل من كشف إكسل للإدارة
  needsCompletion?: boolean; // هل السجل بحاجة لاستكمال من قبل المواطن
  importedAt?: string; // تاريخ ووقت الاستيراد
}

export interface UserAccount {
  id: string;
  name: string;
  username: string; // للمشرف أو الأدمن، وللمواطن يكون رقم الهوية
  password: string;
  role: 'admin' | 'supervisor' | 'citizen';
  phone?: string;
  assignedArea?: string; // منطقة الإشراف (حكر الجامع، إلخ)
  createdAt: string;
  isActive: boolean;
}

export interface AuthSession {
  user: UserAccount | null;
  citizenRecord?: FamilyRecord | null;
}

export interface ValidationErrorItem {
  id: string;
  field: string;
  label: string;
  stepIndex: number;
  message: string;
}

export interface FormValidationResult {
  isEligibleToFinalize: boolean;
  completionPercentage: number;
  totalRequiredFields: number;
  completedFieldsCount: number;
  missingItems: ValidationErrorItem[];
}

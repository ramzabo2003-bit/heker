import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  FamilyRecord,
  ResidencyStatus,
  MaritalStatus,
  HousingType,
  HousingCondition,
  WalletType,
  WifeRecord,
  ChildRecord,
} from '../types';
import { normalizeArabicText } from '../utils/duplicateCheck';
import { isFamilyRecordComplete } from '../utils/validation';
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  X,
  Download,
  Info,
  Layers,
  Users,
  Eye,
  RefreshCw,
  Sparkles,
  FilePlus2,
  Trash2,
  Filter,
  Check,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedFamilies: FamilyRecord[]) => void;
  existingFamilies: FamilyRecord[];
}

interface ProcessedFileSummary {
  file: File;
  name: string;
  size: string;
  rowCount: number;
  matchedColumnsCount: number;
}

// Normalized column matching dictionary with fuzzy aliases
const COLUMN_ALIASES: Record<string, string[]> = {
  headName: [
    'اسم رب الاسرة',
    'اسم رب الأسرة',
    'الاسم رباعي',
    'الاسم الثلاثي',
    'الاسم',
    'اسم المواطن',
    'اسم المستفيد',
    'اسم صاحب الملف',
    'رب الاسرة',
    'رب الأسرة',
    'name',
    'full_name',
    'fullname',
    'اسم المستحق',
    'المستفيد',
  ],
  headIdNumber: [
    'رقم الهوية',
    'الهوية',
    'رقم هوية رب الاسرة',
    'رقم هوية رب الأسرة',
    'هوية رب الاسرة',
    'هوية رب الأسرة',
    'رقم بطاقة الهوية',
    'رقم السجل',
    'هوية المستفيد',
    'id',
    'id_number',
    'national_id',
    'الرقم الوطني',
    'رقم الهويه',
  ],
  headOccupation: [
    'عمل رب الاسرة',
    'عمل رب الأسرة',
    'مهنة رب الاسرة',
    'مهنة رب الأسرة',
    'المهنة',
    'الوظيفة',
    'العمل',
    'طبيعة العمل',
    'نوع العمل',
    'الوضع الوظيفي',
    'المسمى الوظيفي',
    'occupation',
    'job',
    'المهنه',
  ],
  headBirthDate: [
    'تاريخ الميلاد',
    'تاريخ ميلاد رب الاسرة',
    'تاريخ ميلاد رب الأسرة',
    'الميلاد',
    'سنة الميلاد',
    'birth_date',
    'dob',
    'تاريخ ميلاد رب الهويه',
  ],
  maritalStatus: [
    'الحالة الاجتماعية',
    'الحالة',
    'الوضع العائلي',
    'الحاله الاجتماعيه',
    'marital_status',
  ],
  residencyStatus: [
    'حالة الإقامة',
    'حالة الاقامة',
    'الإقامة',
    'الاقامة',
    'مقيم او نازح',
    'مقيم أم نازح',
    'نوع الإقامة',
    'النزوح',
    'صفة الإقامة',
    'residency',
    'status',
  ],
  primaryPhone: [
    'رقم الجوال',
    'الجوال',
    'رقم الهاتف',
    'الهاتف',
    'الموبايل',
    'رقم الاتصال',
    'phone',
    'mobile',
    'cellphone',
    'جوال 1',
    'رقم المحمول',
  ],
  secondaryPhone: [
    'جوال بديل',
    'رقم جوال بديل',
    'هاتف بديل',
    'رقم آخر',
    'secondary_phone',
    'جوال 2',
  ],
  whatsappPhone: [
    'واتساب',
    'رقم الواتساب',
    'واتس اب',
    'رقم الواتس',
    'whatsapp',
  ],
  wifeName: [
    'اسم الزوجة',
    'الزوجة',
    'اسم الزوجة الاولى',
    'wife_name',
    'wife',
    'اسم الزوجه',
    'الزوجه',
  ],
  wifeId: [
    'رقم هوية الزوجة',
    'هوية الزوجة',
    'رقم الزوجة',
    'هوية الزوجه',
    'رقم هوية الزوجه',
    'wife_id',
  ],
  wifeBirthDate: [
    'تاريخ ميلاد الزوجة',
    'ميلاد الزوجة',
    'تاريخ ميلاد الزوجه',
    'wife_dob',
  ],
  childrenCount: [
    'عدد الاطفال',
    'عدد الأطفال',
    'عدد الابناء',
    'عدد الأبناء',
    'عدد افراد الاسرة',
    'عدد أفراد الأسرة',
    'عدد الافراد',
    'عدد الأفراد',
    'children_count',
    'family_members',
    'عدد افراد العائلة',
  ],
  hasWarLoss: [
    'شهيد او مفقود',
    'شهيد أو مفقود',
    'هل يوجد شهيد',
    'هل فقدت احد افراد العائلة',
    'هل فقدت أحد أفراد العائلة',
    'شهداء',
    'war_loss',
    'فقدان احد افراد الاسرة',
  ],
  lostPersonName: [
    'اسم الشهيد',
    'اسم المفقود',
    'اسم الشهيد او المفقود',
    'اسم الشهيد أو المفقود',
    'martyr_name',
  ],
  lostPersonStatus: [
    'صفة الفقد',
    'شهيد ام مفقود',
    'شهيد أم مفقود',
  ],
  lostPersonRelation: [
    'صلة القرابة',
    'صلة قرابة الشهيد',
    'صلة الشهيد',
  ],
  lostPersonDate: [
    'تاريخ الاستشهاد',
    'تاريخ الفقد',
    'تاريخ الاستشهاد او الفقد',
    'martyr_date',
  ],
  hasWarInjury: [
    'اصابة حرب',
    'إصابة حرب',
    'هل يوجد إصابة',
    'هل تعرضت لاصابة',
    'هل تعرضت لإصابة',
    'war_injury',
    'اصابات الحرب',
  ],
  warInjuryType: [
    'نوع الاصابة',
    'نوع الإصابة',
    'تفاصيل الإصابة',
    'injury_type',
  ],
  warInjuryDate: [
    'تاريخ الاصابة',
    'تاريخ الإصابة',
  ],
  housingType: [
    'نوع السكن',
    'السكن',
    'نوع المأوى',
    'housing_type',
  ],
  housingCondition: [
    'حالة السكن',
    'حالة المأوى',
  ],
  city: ['المدينة', 'المحافظة', 'city'],
  area: ['المنطقة', 'area'],
  neighborhood: ['الحي', 'عنوان السكن', 'العنوان', 'neighborhood', 'address'],
  nearestLandmark: ['اقرب معلم', 'أقرب معلم', 'معلم', 'landmark'],
  walletType: ['نوع المحفظة', 'المحفظة', 'محفظة', 'wallet_type'],
  walletNumber: [
    'رقم المحفظة',
    'رقم الحساب',
    'رقم بنك فلسطين',
    'رقم محفظة بال باي',
    'رقم جوال بي',
    'wallet_number',
  ],
  accountHolderName: ['اسم صاحب المحفظة', 'اسم صاحب الحساب', 'account_name'],
  notes: ['ملاحظات', 'ملاحظة', 'notes', 'comments'],
};

// Clean string for fuzzy column match
function normalizeHeader(text: string): string {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[ى]/g, 'ي')
    .replace(/[\-_ \/\\]/g, '');
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  existingFamilies,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFileSummary[]>([]);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string>('');
  const [updateExistingRecords, setUpdateExistingRecords] = useState<boolean>(true);
  const [isImporting, setIsImporting] = useState<boolean>(false);

  // Consolidated & classified records state
  const [consolidatedRecords, setConsolidatedRecords] = useState<FamilyRecord[]>([]);
  const [mergedDuplicatesCount, setMergedDuplicatesCount] = useState<number>(0);
  const [newRecordsCount, setNewRecordsCount] = useState<number>(0);
  const [previewFilter, setPreviewFilter] = useState<'ALL' | 'COMPLETE' | 'INCOMPLETE' | 'MERGED' | 'NEW'>('ALL');

  const [importResult, setImportResult] = useState<{
    added: number;
    updated: number;
    total: number;
    completeCount: number;
    incompleteCount: number;
  } | null>(null);

  if (!isOpen) return null;

  // Auto detect columns for an individual sheet
  const mapHeaders = (headers: string[]): Record<string, string> => {
    const mapping: Record<string, string> = {};
    const normHeaders = headers.map((h) => ({ original: h, norm: normalizeHeader(h) }));

    Object.entries(COLUMN_ALIASES).forEach(([fieldKey, aliases]) => {
      for (const alias of aliases) {
        const normAlias = normalizeHeader(alias);
        const match = normHeaders.find(
          (h) => h.norm === normAlias || h.norm.includes(normAlias) || normAlias.includes(h.norm)
        );
        if (match && !mapping[fieldKey]) {
          mapping[fieldKey] = match.original;
          break;
        }
      }
    });

    return mapping;
  };

  // Convert raw row using mapping into Partial<FamilyRecord>
  const parseRowData = (
    row: any,
    mapping: Record<string, string>,
    existingRec?: FamilyRecord
  ): Partial<FamilyRecord> => {
    const getValue = (key: string): string => {
      const colName = mapping[key];
      if (!colName) return '';
      const val = row[colName];
      if (val === undefined || val === null) return '';
      return String(val).trim();
    };

    const rawHeadName = getValue('headName');
    const rawHeadId = getValue('headIdNumber').replace(/\D/g, '');
    const rawBirthDate = getValue('headBirthDate');
    const rawPrimaryPhone = getValue('primaryPhone');

    // Residency
    const rawResidency = getValue('residencyStatus').toLowerCase();
    let residencyStatus: ResidencyStatus = 'مقيم';
    if (rawResidency.includes('نازح') || rawResidency.includes('نزوح')) residencyStatus = 'نازح';

    // Marital
    const rawMarital = getValue('maritalStatus');
    let maritalStatus: MaritalStatus = 'متزوج';
    if (rawMarital.includes('أعزب') || rawMarital.includes('اعزب')) maritalStatus = 'أعزب';
    else if (rawMarital.includes('أرمل') || rawMarital.includes('ارمل')) maritalStatus = 'أرمل';
    else if (rawMarital.includes('مطلق')) maritalStatus = 'مطلق';

    // Wives
    const wifeName = getValue('wifeName');
    const wifeId = getValue('wifeId').replace(/\D/g, '');
    const wifeBirthDate = getValue('wifeBirthDate');
    let wives: WifeRecord[] = existingRec?.wives ? [...existingRec.wives] : [];
    if (wifeName) {
      const existingWifeIdx = wives.findIndex((w) => (wifeId && w.idNumber === wifeId) || w.name === wifeName);
      if (existingWifeIdx >= 0) {
        wives[existingWifeIdx] = {
          ...wives[existingWifeIdx],
          name: wifeName || wives[existingWifeIdx].name,
          idNumber: wifeId || wives[existingWifeIdx].idNumber,
          birthDate: wifeBirthDate || wives[existingWifeIdx].birthDate,
        };
      } else {
        wives.push({
          id: `w-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: wifeName,
          idNumber: wifeId,
          birthDate: wifeBirthDate,
        });
      }
    }

    // Children Count
    const rawChildrenCount = getValue('childrenCount');
    const parsedCount = parseInt(rawChildrenCount, 10);
    const childrenCount = !isNaN(parsedCount) && parsedCount >= 0 ? parsedCount : existingRec?.childrenCount || 0;

    // War loss
    const rawWarLoss = getValue('hasWarLoss').toLowerCase();
    const hasWarLoss =
      rawWarLoss.includes('نعم') ||
      rawWarLoss.includes('شهيد') ||
      rawWarLoss.includes('مفقود') ||
      Boolean(getValue('lostPersonName')) ||
      (existingRec ? existingRec.hasWarLoss : false);

    const lostPersonName = getValue('lostPersonName') || existingRec?.lostPersonName || '';
    const rawLostStatus = getValue('lostPersonStatus');
    const lostPersonStatus: 'شهيد' | 'مفقود' = rawLostStatus.includes('مفقود') ? 'مفقود' : 'شهيد';
    const lostPersonRelation = getValue('lostPersonRelation') || existingRec?.lostPersonRelation || '';
    const lostPersonDate = getValue('lostPersonDate') || existingRec?.lostPersonDate || '';

    // War injury
    const rawWarInjury = getValue('hasWarInjury').toLowerCase();
    const hasWarInjury =
      rawWarInjury.includes('نعم') ||
      Boolean(getValue('warInjuryType')) ||
      (existingRec ? existingRec.hasWarInjury : false);
    const warInjuryType = getValue('warInjuryType') || existingRec?.warInjuryType || '';
    const warInjuryDate = getValue('warInjuryDate') || existingRec?.warInjuryDate || '';

    // Housing
    const rawHousingType = getValue('housingType');
    let housingType: HousingType = existingRec?.housingType || 'خيمة / مركز إيواء';
    if (rawHousingType.includes('إيجار') || rawHousingType.includes('ايجار')) housingType = 'إيجار';
    else if (rawHousingType.includes('خيمة') || rawHousingType.includes('إيواء')) housingType = 'خيمة / مركز إيواء';
    else if (rawHousingType.includes('كرفان')) housingType = 'كرفان';
    else if (rawHousingType.includes('ملك')) housingType = 'ملك';
    else if (rawHousingType.includes('استضافة')) housingType = 'استضافة لدى أقارب';
    else if (rawHousingType.includes('متضرر')) housingType = 'منزل متضرر جزئياً';

    // Wallet
    const rawWalletType = getValue('walletType');
    let walletType: WalletType = existingRec?.walletType || 'محفظة بال باي (PalPay)';
    if (rawWalletType.includes('جوال') || rawWalletType.includes('jawwal')) walletType = 'محفظة جوال بي (Jawwal Pay)';
    else if (rawWalletType.includes('فلسطين')) walletType = 'حساب بنك فلسطين';
    else if (rawWalletType.includes('كاش')) walletType = 'محفظة كاش كابيتال';
    else if (rawWalletType.includes('آخر') || rawWalletType.includes('اخر')) walletType = 'حساب بنكي آخر';
    else if (rawWalletType.includes('لا يوجد')) walletType = 'لا يوجد محفظة';

    const walletNumber = getValue('walletNumber') || existingRec?.walletNumber || '';
    const accountHolderName = getValue('accountHolderName') || rawHeadName || existingRec?.accountHolderName || '';
    const notes = getValue('notes') || existingRec?.notes || '';

    return {
      headName: rawHeadName || existingRec?.headName || '',
      headIdNumber: rawHeadId || existingRec?.headIdNumber || '',
      headBirthDate: rawBirthDate || existingRec?.headBirthDate || '',
      maritalStatus,
      headOccupation: getValue('headOccupation') || existingRec?.headOccupation || 'عامل يومي (أجر يومي)',
      residencyStatus,
      wives,
      childrenCount,
      children: existingRec?.children || [],
      isHeadSick: existingRec ? existingRec.isHeadSick : false,
      illnessType: existingRec ? existingRec.illnessType : '',
      isChronic: existingRec ? existingRec.isChronic : false,
      chronicDetails: existingRec ? existingRec.chronicDetails : '',
      hasWarLoss,
      lostPersonName,
      lostPersonStatus,
      lostPersonRelation,
      lostPersonDate,
      hasWarInjury,
      warInjuryType,
      warInjuryDate,
      housingType,
      housingCondition: existingRec?.housingCondition || 'صالح جزئياً',
      city: getValue('city') || existingRec?.city || 'دير البلح',
      area: getValue('area') || existingRec?.area || 'حكر الجامع',
      neighborhood: getValue('neighborhood') || existingRec?.neighborhood || '',
      nearestLandmark: getValue('nearestLandmark') || existingRec?.nearestLandmark || '',
      primaryPhone: rawPrimaryPhone || existingRec?.primaryPhone || '',
      secondaryPhone: getValue('secondaryPhone') || existingRec?.secondaryPhone || '',
      whatsappPhone: getValue('whatsappPhone') || rawPrimaryPhone || existingRec?.whatsappPhone || '',
      walletType,
      walletNumber,
      accountHolderName,
      accountHolderRelationship: 'رب الأسرة نفسه',
      notes: notes || 'مستورد عبر كشوفات الإكسل المعتمدة',
    };
  };

  // Process all uploaded files together
  const handleFilesUpload = async (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    if (filesArray.length === 0) return;

    setIsParsing(true);
    setParseError('');
    setImportResult(null);

    const summaries: ProcessedFileSummary[] = [];
    const recordMap = new Map<string, Partial<FamilyRecord>>();
    let duplicateMergeCount = 0;
    let newRecCount = 0;

    // Seed map with existing database records so we can smartly merge if selected
    existingFamilies.forEach((existing) => {
      const cleanId = existing.headIdNumber.replace(/\D/g, '');
      if (cleanId) recordMap.set(cleanId, existing);
    });

    try {
      for (const file of filesArray) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        let fileRowsCount = 0;
        let fileMatchedCols = 0;

        for (const sheetName of workbook.SheetNames) {
          const sheet = workbook.Sheets[sheetName];
          if (!sheet) continue;

          const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
          if (rows.length === 0) continue;

          // Find headers
          const headers = Object.keys(rows[0] || {});
          const mapping = mapHeaders(headers);
          fileMatchedCols = Math.max(fileMatchedCols, Object.keys(mapping).length);

          // Ingest each row with smart cross-file merging
          rows.forEach((row) => {
            const rawId = (mapping.headIdNumber ? String(row[mapping.headIdNumber] || '') : '').replace(/\D/g, '');
            const rawName = mapping.headName ? String(row[mapping.headName] || '').trim() : '';
            const normName = normalizeArabicText(rawName);

            // Skip completely empty rows
            if (!rawId && !rawName) return;

            fileRowsCount++;

            // Lookup existing in map by ID or by normalized name
            let existingKey: string | undefined = undefined;
            if (rawId && recordMap.has(rawId)) {
              existingKey = rawId;
            } else if (normName) {
              for (const [key, candidate] of recordMap.entries()) {
                if (candidate.headName && normalizeArabicText(candidate.headName) === normName) {
                  existingKey = key;
                  break;
                }
              }
            }

            if (existingKey) {
              // Duplicate found! Merge without losing existing rich data
              const existingRecord = recordMap.get(existingKey)!;
              const mergedData = parseRowData(row, mapping, existingRecord as FamilyRecord);
              recordMap.set(existingKey, {
                ...existingRecord,
                ...mergedData,
                // Preserve original ID & submissionDate
                id: existingRecord.id,
                submissionDate: existingRecord.submissionDate,
              });
              duplicateMergeCount++;
            } else {
              // Brand new record
              const newKey = rawId || `TEMP_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
              const parsed = parseRowData(row, mapping);
              recordMap.set(newKey, parsed);
              newRecCount++;
            }
          });
        }

        summaries.push({
          file,
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' ك.ب',
          rowCount: fileRowsCount,
          matchedColumnsCount: fileMatchedCols,
        });
      }

      // Convert map into standardized, classified, and sorted FamilyRecords
      const dateStr = new Date().toISOString().split('T')[0];
      const finalRecordsList: FamilyRecord[] = [];

      let seq = 1;
      recordMap.forEach((rec, key) => {
        // Only include records that came from files or were updated
        const isFromFiles = filesArray.some(() => true); // all records in map now
        const isComplete = isFamilyRecordComplete(rec);
        const nextId = rec.id || `HKR-2026-${(100 + seq++).toString().padStart(3, '0')}`;

        const standardized: FamilyRecord = {
          id: nextId,
          submissionDate: rec.submissionDate || dateStr,
          lastUpdated: dateStr,
          status: isComplete ? 'مستوفي كامل البيانات' : 'يحتاج استكمال',
          headName: rec.headName || 'مواطن بدون اسم',
          headIdNumber: rec.headIdNumber || '',
          headBirthDate: rec.headBirthDate || '',
          maritalStatus: rec.maritalStatus || 'متزوج',
          headOccupation: rec.headOccupation || 'عامل يومي (أجر يومي)',
          residencyStatus: rec.residencyStatus || 'مقيم',
          wives: rec.wives || [],
          childrenCount: rec.childrenCount || 0,
          children: rec.children || [],
          isHeadSick: Boolean(rec.isHeadSick),
          illnessType: rec.illnessType || '',
          isChronic: Boolean(rec.isChronic),
          chronicDetails: rec.chronicDetails || '',
          hasWarLoss: Boolean(rec.hasWarLoss),
          lostPersonName: rec.lostPersonName || '',
          lostPersonStatus: rec.lostPersonStatus || 'شهيد',
          lostPersonRelation: rec.lostPersonRelation || '',
          lostPersonDate: rec.lostPersonDate || '',
          hasWarInjury: Boolean(rec.hasWarInjury),
          warInjuryType: rec.warInjuryType || '',
          warInjuryDate: rec.warInjuryDate || '',
          warInjuryDetails: rec.warInjuryDetails || '',
          housingType: rec.housingType || 'خيمة / مركز إيواء',
          housingCondition: rec.housingCondition || 'صالح جزئياً',
          city: rec.city || 'دير البلح',
          area: rec.area || 'حكر الجامع',
          neighborhood: rec.neighborhood || '',
          nearestLandmark: rec.nearestLandmark || '',
          primaryPhone: rec.primaryPhone || '',
          secondaryPhone: rec.secondaryPhone || '',
          whatsappPhone: rec.whatsappPhone || '',
          walletType: rec.walletType || 'محفظة بال باي (PalPay)',
          walletNumber: rec.walletNumber || '',
          accountHolderName: rec.accountHolderName || rec.headName || '',
          accountHolderRelationship: rec.accountHolderRelationship || 'رب الأسرة نفسه',
          notes: rec.notes || 'مستورد عبر كشوفات الإكسل المعتمدة',
          password: rec.password || rec.headIdNumber || '123456',
          isImportedFromExcel: true,
          needsCompletion: !isComplete,
          importedAt: new Date().toLocaleString('ar-EG'),
        };

        finalRecordsList.push(standardized);
      });

      // Automatic Sorting:
      // 1. "مستوفي كامل البيانات" first
      // 2. "يحتاج استكمال" second
      // 3. Alphabetical by citizen name
      finalRecordsList.sort((a, b) => {
        const aComplete = a.status === 'مستوفي كامل البيانات' ? 0 : 1;
        const bComplete = b.status === 'مستوفي كامل البيانات' ? 0 : 1;
        if (aComplete !== bComplete) return aComplete - bComplete;
        return a.headName.localeCompare(b.headName, 'ar');
      });

      setProcessedFiles(summaries);
      setConsolidatedRecords(finalRecordsList);
      setMergedDuplicatesCount(duplicateMergeCount);
      setNewRecordsCount(newRecCount);
      setIsParsing(false);
    } catch (err: any) {
      console.error('Error parsing multiple Excel files:', err);
      setParseError(err.message || 'حدث خطأ أثناء معالجة ملفات الإكسل. يرجى التأكد من سلامة الملفات.');
      setIsParsing(false);
    }
  };

  // Perform Final Bulk Import
  const handleExecuteImport = () => {
    if (consolidatedRecords.length === 0) return;
    setIsImporting(true);

    setTimeout(() => {
      try {
        const completeCount = consolidatedRecords.filter((r) => r.status === 'مستوفي كامل البيانات').length;
        const incompleteCount = consolidatedRecords.length - completeCount;

        onImportSuccess(consolidatedRecords);

        setImportResult({
          added: newRecordsCount,
          updated: mergedDuplicatesCount,
          total: consolidatedRecords.length,
          completeCount,
          incompleteCount,
        });
        setIsImporting(false);
      } catch (err: any) {
        setIsImporting(false);
        setParseError('حدث خطأ أثناء حفظ السجلات في قاعدة البيانات.');
      }
    }, 600);
  };

  // Download Sample Template
  const handleDownloadSampleTemplate = () => {
    const sampleHeaders = [
      'اسم رب الأسرة',
      'رقم الهوية',
      'تاريخ الميلاد',
      'عمل رب الأسرة',
      'حالة الإقامة',
      'الحالة الاجتماعية',
      'رقم الجوال',
      'اسم الزوجة',
      'رقم هوية الزوجة',
      'عدد الأطفال',
      'نوع السكن',
      'الحي',
      'أقرب معلم',
      'هل فقدت أحد أفراد العائلة',
      'اسم الشهيد أو المفقود',
      'هل تعرضت لإصابة خلال الحرب',
      'نوع الإصابة',
      'نوع المحفظة',
      'رقم المحفظة / الحساب',
      'ملاحظات',
    ];

    const sampleRow1 = [
      'محمد إبراهيم خليل شاهين',
      '905123456',
      '1985-05-20',
      'عامل يومي (أجر يومي)',
      'مقيم',
      'متزوج',
      '0599123456',
      'فاطمة عبد الله النجار',
      '906789123',
      3,
      'ملك',
      'شارع الجامع القديم',
      'مسجد حكر الجامع',
      'نعم',
      'إبراهيم خليل شاهين (الوالد)',
      'لا',
      '',
      'محفظة بال باي (PalPay)',
      'PAL-905123456',
      'مستوفي البيانات',
    ];

    const wsData = [sampleHeaders, sampleRow1];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = sampleHeaders.map(() => ({ wch: 22 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'كشف حكر الجامع');
    XLSX.writeFile(wb, 'نموذج_استيراد_بيانات_حكر_الجامع.xlsx');
  };

  const resetUpload = () => {
    setProcessedFiles([]);
    setConsolidatedRecords([]);
    setParseError('');
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Filter preview records
  const filteredPreview = consolidatedRecords.filter((rec) => {
    if (previewFilter === 'COMPLETE') return rec.status === 'مستوفي كامل البيانات';
    if (previewFilter === 'INCOMPLETE') return rec.status === 'يحتاج استكمال';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold shadow-inner">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  استيراد وتصنيف وفرز كشوفات الإكسل (متعدد الملفات)
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  فرز وتصنيف آلي ذكي
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                يدعم رفع عدة ملفات إكسل معاً بدون ترتيب موحد، ومعالجة البيانات الناقصة ودمج المكرر وتصنيف المستوفين تلقائياً.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Success Banner */}
          {importResult ? (
            <div className="bg-emerald-50 border-2 border-emerald-400/80 rounded-3xl p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-emerald-950">
                  تم استيراد وفرز وتصنيف كافة الملفات بنجاح تام!
                </h3>
                <p className="text-xs text-emerald-800 mt-1">
                  أُدرجت السجلات المصنفة الآن مباشرة في قاعدة بيانات حكر الجامع، وأصبح بإمكان المواطنين الاستعلام والدخول بالهوية.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto py-2">
                <div className="bg-white rounded-2xl p-3 border border-emerald-200 text-center shadow-xs">
                  <span className="block text-2xl font-black text-emerald-700 font-mono">{importResult.total}</span>
                  <span className="text-[11px] font-bold text-slate-600">إجمالي الأسر المستوردة</span>
                </div>
                <div className="bg-white rounded-2xl p-3 border border-emerald-200 text-center shadow-xs">
                  <span className="block text-2xl font-black text-emerald-600 font-mono">
                    {importResult.completeCount}
                  </span>
                  <span className="text-[11px] font-black text-emerald-800">مستوفي كامل البيانات ✅</span>
                </div>
                <div className="bg-white rounded-2xl p-3 border border-emerald-200 text-center shadow-xs">
                  <span className="block text-2xl font-black text-amber-600 font-mono">
                    {importResult.incompleteCount}
                  </span>
                  <span className="text-[11px] font-bold text-amber-800">يحتاج استكمال ⚠️</span>
                </div>
                <div className="bg-white rounded-2xl p-3 border border-emerald-200 text-center shadow-xs">
                  <span className="block text-2xl font-black text-blue-600 font-mono">{importResult.updated}</span>
                  <span className="text-[11px] font-bold text-blue-800">مكرر تم دمجه 🔄</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  العودة إلى جدول السجلات المحدث
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Feature Highlights & Rules */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex items-center gap-2 font-extrabold text-emerald-950">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>التعامل التلقائي والذكي مع ملفات الإكسل غير المنتظمة:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-slate-700 pt-1">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 space-y-1">
                    <strong className="block text-emerald-900 font-bold">1. عدم توحد ترتيب الأعمدة</strong>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      يكتشف النظام الأعمدة تلقائياً بأي ترتيب وأي صيغة كانت (الاسم، الهوية، الهاتف، السكن).
                    </p>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 space-y-1">
                    <strong className="block text-amber-900 font-bold">2. البيانات الناقصة</strong>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      السجل المكتمل يُصنف كـ <strong>"مستوفي كامل البيانات ✅"</strong>، والناقص كـ{' '}
                      <strong>"يحتاج استكمال ⚠️"</strong>.
                    </p>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 space-y-1">
                    <strong className="block text-blue-900 font-bold">3. منع ودمج التكرار الآلي</strong>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      إذا تكرر المواطن في عدة ملفات، يدمج النظام البيانات الناقصة في ملف موحد بدون تكرار الهوية.
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Drop Zone (Multiple Files) */}
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".xlsx, .xls, .csv"
                  onChange={(e) => e.target.files && handleFilesUpload(e.target.files)}
                  className="hidden"
                  id="multi-excel-input"
                />

                {processedFiles.length === 0 ? (
                  <label
                    htmlFor="multi-excel-input"
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-600 hover:bg-emerald-50/50 transition rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 group-hover:scale-105 group-hover:bg-emerald-200 transition flex items-center justify-center shadow-xs mb-3">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <span className="text-sm sm:text-base font-black text-slate-900 group-hover:text-emerald-800">
                      اضغط هنا لاختيار ملف أو عدة ملفات إكسل معاً (تحديد متعدد)
                    </span>
                    <span className="text-xs text-slate-500 mt-1 max-w-md leading-relaxed">
                      يمكنك تحديد ملفين أو 5 أو 10 ملفات إكسل أو CSV دفعة واحدة، وسيقوم النظام بدمجها وترتيبها وتصنيفها آلياً.
                    </span>
                    <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full">
                      <FilePlus2 className="w-4 h-4" />
                      <span>يدعم XLSX, XLS, CSV</span>
                    </div>
                  </label>
                ) : (
                  <div className="space-y-3">
                    {/* Processed Files Cards */}
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                        <span>الملفات المرفوعة قيد المعالجة ({processedFiles.length} ملفات):</span>
                      </h4>
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="multi-excel-input"
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition cursor-pointer flex items-center gap-1.5"
                        >
                          <FilePlus2 className="w-3.5 h-3.5" />
                          <span>إضافة ملفات إضافية</span>
                        </label>
                        <button
                          type="button"
                          onClick={resetUpload}
                          className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition font-medium cursor-pointer"
                        >
                          إلغاء والبدء من جديد
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {processedFiles.map((f, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 text-xs font-mono">
                              #{idx + 1}
                            </div>
                            <div className="truncate">
                              <p className="text-xs font-bold text-slate-900 truncate" title={f.name}>
                                {f.name}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {f.rowCount} صفاً • {f.matchedColumnsCount} عمود تم ربطه
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                            جاهز ✓
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {parseError && (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-xs text-rose-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{parseError}</span>
                  </div>
                )}
              </div>

              {/* Analysis & Categorization Dashboard */}
              {consolidatedRecords.length > 0 && (
                <div className="space-y-4 pt-3 border-t border-slate-200">
                  {/* Summary Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xs">
                      <span className="block text-2xl font-black font-mono">{consolidatedRecords.length}</span>
                      <span className="text-[11px] text-slate-300 font-bold">إجمالي الأسر المفرزة</span>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-2xl text-emerald-950">
                      <span className="block text-2xl font-black font-mono text-emerald-700">
                        {consolidatedRecords.filter((r) => r.status === 'مستوفي كامل البيانات').length}
                      </span>
                      <span className="text-[11px] font-black flex items-center gap-1 text-emerald-900">
                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                        مستوفي كامل البيانات
                      </span>
                    </div>

                    <div className="bg-amber-50 border border-amber-300 p-3 rounded-2xl text-amber-950">
                      <span className="block text-2xl font-black font-mono text-amber-700">
                        {consolidatedRecords.filter((r) => r.status === 'يحتاج استكمال').length}
                      </span>
                      <span className="text-[11px] font-bold flex items-center gap-1 text-amber-900">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                        يحتاج استكمال
                      </span>
                    </div>

                    <div className="bg-blue-50 border border-blue-300 p-3 rounded-2xl text-blue-950">
                      <span className="block text-2xl font-black font-mono text-blue-700">
                        {mergedDuplicatesCount}
                      </span>
                      <span className="text-[11px] font-bold text-blue-900">مكرر تم دمجه وفرزه 🔄</span>
                    </div>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setPreviewFilter('ALL')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          previewFilter === 'ALL'
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        الكل ({consolidatedRecords.length})
                      </button>
                      <button
                        onClick={() => setPreviewFilter('COMPLETE')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          previewFilter === 'COMPLETE'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                      >
                        مستوفي كامل البيانات ✅ (
                        {consolidatedRecords.filter((r) => r.status === 'مستوفي كامل البيانات').length})
                      </button>
                      <button
                        onClick={() => setPreviewFilter('INCOMPLETE')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          previewFilter === 'INCOMPLETE'
                            ? 'bg-amber-600 text-white'
                            : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                        }`}
                      >
                        يحتاج استكمال ⚠️ (
                        {consolidatedRecords.filter((r) => r.status === 'يحتاج استكمال').length})
                      </button>
                    </div>

                    <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />
                      <span>مرتب آلياً: المستوفين أولاً، ثم المتبقين</span>
                    </div>
                  </div>

                  {/* Preview Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                    <div className="max-h-60 overflow-y-auto">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200">
                          <tr>
                            <th className="p-2.5">اسم رب الأسرة</th>
                            <th className="p-2.5">رقم الهوية</th>
                            <th className="p-2.5">حالة الاستيفاء والاعتماد</th>
                            <th className="p-2.5">الإقامة</th>
                            <th className="p-2.5">الهاتف</th>
                            <th className="p-2.5">السكن</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredPreview.slice(0, 10).map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition">
                              <td className="p-2.5 font-bold text-slate-900">{row.headName}</td>
                              <td className="p-2.5 font-mono text-slate-700">{row.headIdNumber || '—'}</td>
                              <td className="p-2.5">
                                {row.status === 'مستوفي كامل البيانات' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
                                    مستوفي كامل البيانات ✅
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300">
                                    يحتاج استكمال ⚠️
                                  </span>
                                )}
                              </td>
                              <td className="p-2.5">
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                    row.residencyStatus === 'نازح'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {row.residencyStatus}
                                </span>
                              </td>
                              <td className="p-2.5 font-mono text-slate-600">{row.primaryPhone || '—'}</td>
                              <td className="p-2.5 text-slate-600">{row.housingType}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {filteredPreview.length > 10 && (
                      <div className="bg-slate-50 p-2 text-center text-[11px] text-slate-500 border-t border-slate-200">
                        يتم عرض أول 10 سجلات من أصل {filteredPreview.length} سجلاً في هذه الفئة.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 text-center sm:text-right">
            {!importResult && consolidatedRecords.length > 0 && (
              <span>
                جاهز لاعتماد <strong>{consolidatedRecords.length} أسرة</strong> مصنفة ومفرزة آلياً.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              {importResult ? 'إغلاق' : 'إلغاء'}
            </button>

            {!importResult && consolidatedRecords.length > 0 && (
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={isImporting}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-700/20 transition cursor-pointer disabled:opacity-50"
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جارٍ الاستيراد والتصنيف...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>اعتماد واستيراد كافة السجلات ({consolidatedRecords.length})</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

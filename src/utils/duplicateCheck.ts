import { FamilyRecord } from '../types';

/**
 * Normalizes Arabic text for strict anti-duplicate comparison
 * - Unifies Alef variations (أ, إ, آ, ٱ -> ا)
 * - Unifies Taa Marbuta (ة -> ه)
 * - Unifies Yaa / Alef Maksura (ى -> ي)
 * - Removes Arabic Tashkeel / Harakat
 * - Collapses spaces and trims
 * - Unifies "عبد ال..." into "عبدال..."
 */
export function normalizeArabicText(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove harakat/tashkeel
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/عبد\s+/g, 'عبد')
    .replace(/[\s\-_]+/g, ' ')
    .toLowerCase();
}

/**
 * Checks if a head national ID is already registered in another family
 */
export function findDuplicateHeadId(
  idNumber: string,
  currentFamilyId: string | null | undefined,
  allFamilies: FamilyRecord[]
): FamilyRecord | null {
  if (!idNumber) return null;
  const cleanId = idNumber.replace(/\D/g, '');
  if (cleanId.length < 9) return null;

  return (
    allFamilies.find((f) => {
      if (currentFamilyId && f.id === currentFamilyId) return false;
      return f.headIdNumber === cleanId;
    }) || null
  );
}

/**
 * Checks if an identical head full name is already registered in another family
 */
export function findDuplicateHeadName(
  headName: string,
  currentFamilyId: string | null | undefined,
  allFamilies: FamilyRecord[]
): FamilyRecord | null {
  if (!headName) return null;
  const normInput = normalizeArabicText(headName);
  const inputWords = normInput.split(' ').filter(Boolean);
  // Only trigger on full names with at least 3 parts to avoid false positives on single first names
  if (inputWords.length < 3) return null;

  return (
    allFamilies.find((f) => {
      if (currentFamilyId && f.id === currentFamilyId) return false;
      const normExisting = normalizeArabicText(f.headName);
      return normExisting === normInput;
    }) || null
  );
}

/**
 * Checks if a national ID is already used anywhere across the system
 * (by any head, any wife, or any child)
 */
export function findDuplicateIdAnywhere(
  idNumber: string,
  currentFamilyId: string | null | undefined,
  allFamilies: FamilyRecord[]
): {
  isDuplicate: boolean;
  role?: 'رب أسرة' | 'زوجة' | 'طفل/ابن';
  family?: FamilyRecord;
  personName?: string;
} {
  if (!idNumber) return { isDuplicate: false };
  const cleanId = idNumber.replace(/\D/g, '');
  if (cleanId.length < 9) return { isDuplicate: false };

  for (const family of allFamilies) {
    const isSameFamily = currentFamilyId && family.id === currentFamilyId;

    // Check head
    if (family.headIdNumber === cleanId) {
      if (!isSameFamily) {
        return {
          isDuplicate: true,
          role: 'رب أسرة',
          family,
          personName: family.headName,
        };
      }
    }

    // Check wives
    if (family.wives && family.wives.length > 0) {
      for (const wife of family.wives) {
        if (wife.idNumber === cleanId) {
          if (!isSameFamily) {
            return {
              isDuplicate: true,
              role: 'زوجة',
              family,
              personName: wife.name,
            };
          }
        }
      }
    }

    // Check children
    if (family.children && family.children.length > 0) {
      for (const child of family.children) {
        if (child.idNumber === cleanId) {
          if (!isSameFamily) {
            return {
              isDuplicate: true,
              role: 'طفل/ابن',
              family,
              personName: child.name,
            };
          }
        }
      }
    }
  }

  return { isDuplicate: false };
}

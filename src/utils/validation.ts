import { FamilyRecord, FormValidationResult, ValidationErrorItem } from '../types';

export function isValidIdNumber(id: string): boolean {
  if (!id) return false;
  const cleaned = id.replace(/\s+/g, '');
  return /^\d{9}$/.test(cleaned);
}

export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-+]/g, '');
  return /^05[69]\d{7}$/.test(cleaned) || /^5[69]\d{7}$/.test(cleaned) || /^\d{9,10}$/.test(cleaned);
}

export function validateFamilyForm(data: Partial<FamilyRecord>): FormValidationResult {
  const missingItems: ValidationErrorItem[] = [];
  let totalRules = 0;
  let passedRules = 0;

  const check = (
    condition: boolean,
    item: { field: string; label: string; stepIndex: number; message: string }
  ) => {
    totalRules++;
    if (condition) {
      passedRules++;
    } else {
      missingItems.push({
        id: `${item.field}-${item.stepIndex}`,
        ...item,
      });
    }
  };

  // 1. بيانات رب الأسرة (الخطوة 1)
  const headNameWords = (data.headName || '').trim().split(/\s+/).filter(Boolean);
  check(headNameWords.length >= 3, {
    field: 'headName',
    label: 'اسم رب الأسرة',
    stepIndex: 1,
    message: 'يرجى إدخال اسم رب الأسرة ثلاثياً أو رباعياً على الأقل.',
  });

  check(isValidIdNumber(data.headIdNumber || ''), {
    field: 'headIdNumber',
    label: 'رقم هوية رب الأسرة',
    stepIndex: 1,
    message: 'رقم الهوية يجب أن يتكون من 9 أرقام صحيحة.',
  });

  check(Boolean(data.headBirthDate), {
    field: 'headBirthDate',
    label: 'تاريخ ميلاد رب الأسرة',
    stepIndex: 1,
    message: 'يرجى تحديد تاريخ ميلاد رب الأسرة.',
  });

  check(Boolean(data.maritalStatus), {
    field: 'maritalStatus',
    label: 'الحالة الاجتماعية',
    stepIndex: 1,
    message: 'يرجى اختيار الحالة الاجتماعية.',
  });

  check(Boolean(data.headOccupation && data.headOccupation.trim().length > 0), {
    field: 'headOccupation',
    label: 'عمل رب الأسرة',
    stepIndex: 1,
    message: 'يرجى تحديد ما هو عمل رب الأسرة والوضع الوظيفي.',
  });

  // 2. بيانات الزوجة (الخطوة 2)
  if (data.maritalStatus === 'متزوج') {
    const wives = data.wives || [];
    check(wives.length > 0, {
      field: 'wives',
      label: 'بيانات الزوجة',
      stepIndex: 2,
      message: 'يجب إضافة بيانات الزوجة بما أن الحالة الاجتماعية "متزوج".',
    });

    wives.forEach((wife, idx) => {
      const wifeNameWords = (wife.name || '').trim().split(/\s+/).filter(Boolean);
      check(wifeNameWords.length >= 2, {
        field: `wife-${idx}-name`,
        label: `اسم الزوجة (${idx + 1})`,
        stepIndex: 2,
        message: `يرجى إدخال الاسم الكامل للزوجة رقم ${idx + 1}.`,
      });

      check(isValidIdNumber(wife.idNumber || ''), {
        field: `wife-${idx}-idNumber`,
        label: `رقم هوية الزوجة (${idx + 1})`,
        stepIndex: 2,
        message: `رقم هوية الزوجة رقم ${idx + 1} يجب أن يتكون من 9 أرقام.`,
      });

      check(Boolean(wife.birthDate), {
        field: `wife-${idx}-birthDate`,
        label: `تاريخ ميلاد الزوجة (${idx + 1})`,
        stepIndex: 2,
        message: `يرجى تحديد تاريخ ميلاد الزوجة رقم ${idx + 1}.`,
      });
    });
  }

  // 3. بيانات الأطفال (الخطوة 3)
  const childrenCount = Number(data.childrenCount ?? 0);
  check(childrenCount >= 0, {
    field: 'childrenCount',
    label: 'عدد الأطفال',
    stepIndex: 3,
    message: 'يرجى تحديد عدد الأطفال بدقة.',
  });

  if (childrenCount > 0) {
    const children = data.children || [];
    check(children.length === childrenCount, {
      field: 'childrenListCount',
      label: 'قائمة الأطفال المسجلين',
      stepIndex: 3,
      message: `عدد الأطفال المسجلين في القائمة (${children.length}) لا يطابق العدد المدخل (${childrenCount}).`,
    });

    children.forEach((child, idx) => {
      check(Boolean(child.name && child.name.trim().length >= 2), {
        field: `child-${idx}-name`,
        label: `اسم الطفل (${idx + 1})`,
        stepIndex: 3,
        message: `يرجى إدخال اسم الطفل رقم ${idx + 1}.`,
      });

      check(isValidIdNumber(child.idNumber || ''), {
        field: `child-${idx}-idNumber`,
        label: `رقم هوية الطفل (${idx + 1})`,
        stepIndex: 3,
        message: `رقم هوية الطفل رقم ${idx + 1} يجب أن يتكون من 9 أرقام.`,
      });

      check(Boolean(child.birthDate), {
        field: `child-${idx}-birthDate`,
        label: `تاريخ ميلاد الطفل (${idx + 1})`,
        stepIndex: 3,
        message: `يرجى تحديد تاريخ ميلاد الطفل رقم ${idx + 1}.`,
      });

      check(Boolean(child.grade && child.grade.trim().length > 0), {
        field: `child-${idx}-grade`,
        label: `الصف الدراسي للطفل (${idx + 1})`,
        stepIndex: 3,
        message: `يرجى تحديد الصف الدراسي للطفل رقم ${idx + 1}.`,
      });

      // التحقق من بيانات التوجيهي
      const isTawjihi = child.grade === 'توجيهي (ثانوية عامة)' || (child.isTawjihiOrUniversity && !child.isUniversityStudent && child.grade !== 'طالب جامعي');
      if (isTawjihi) {
        check(Boolean(child.academicAverage && child.academicAverage.trim().length > 0), {
          field: `child-${idx}-academicAverage`,
          label: `معدل التوجيهي للابن/الابنة (${child.name || idx + 1})`,
          stepIndex: 3,
          message: `يرجى تحديد معدل الثانوية العامة / التوجيهي للابن/الابنة رقم ${idx + 1}.`,
        });
      }

      // التحقق من بيانات الجامعة
      const isUniversity = child.grade === 'طالب جامعي' || Boolean(child.isUniversityStudent);
      if (isUniversity) {
        check(Boolean(child.universityName && child.universityName.trim().length > 0), {
          field: `child-${idx}-universityName`,
          label: `اسم الجامعة (${child.name || idx + 1})`,
          stepIndex: 3,
          message: `يرجى إدخال اسم الجامعة للابن/الابنة رقم ${idx + 1}.`,
        });

        check(Boolean(child.universityMajor && child.universityMajor.trim().length > 0), {
          field: `child-${idx}-universityMajor`,
          label: `التخصص الجامعي (${child.name || idx + 1})`,
          stepIndex: 3,
          message: `يرجى تحديد التخصص الدراسي للابن/الابنة رقم ${idx + 1}.`,
        });

        check(Boolean(child.universityGpa && child.universityGpa.trim().length > 0), {
          field: `child-${idx}-universityGpa`,
          label: `المعدل الجامعي (${child.name || idx + 1})`,
          stepIndex: 3,
          message: `يرجى تحديد المعدل الجامعي للابن/الابنة رقم ${idx + 1}.`,
        });

        check(Boolean(child.universitySemester && child.universitySemester.trim().length > 0), {
          field: `child-${idx}-universitySemester`,
          label: `الفصل الدراسي الجامعي (${child.name || idx + 1})`,
          stepIndex: 3,
          message: `يرجى تحديد الفصل الدراسي للابن/الابنة رقم ${idx + 1}.`,
        });

        if (child.hasAccumulatedFees) {
          check(Boolean(child.accumulatedFeesAmount && String(child.accumulatedFeesAmount).trim().length > 0), {
            field: `child-${idx}-accumulatedFeesAmount`,
            label: `مبلغ الرسوم الجامعية المتراكمة (${child.name || idx + 1})`,
            stepIndex: 3,
            message: `يرجى إدخال كم المبلغ المتراكم من الرسوم الجامعية للابن/الابنة رقم ${idx + 1}.`,
          });
        }
      }
    });
  }

  // 4. الوضع الصحي وآثار الحرب والشهداء (الخطوة 4)
  if (data.isHeadSick) {
    check(Boolean(data.illnessType && data.illnessType.trim().length >= 2), {
      field: 'illnessType',
      label: 'نوع المرض',
      stepIndex: 4,
      message: 'تم تحديد أن رب الأسرة مريض، يرجى كتابة وتحديد نوع المرض.',
    });
  }

  if (data.isChronic) {
    check(Boolean(data.chronicDetails && data.chronicDetails.trim().length >= 2), {
      field: 'chronicDetails',
      label: 'تفاصيل المرض المزمن',
      stepIndex: 4,
      message: 'تم تحديد وجود مرض مزمن، يرجى كتابة تفاصيل الأمراض المزمنة.',
    });
  }

  // التحقق من شهداء ومفقودي الحرب
  if (data.hasWarLoss) {
    check(Boolean(data.lostPersonName && data.lostPersonName.trim().length >= 2), {
      field: 'lostPersonName',
      label: 'اسم الشهيد أو المفقود',
      stepIndex: 4,
      message: 'تم الإشارة إلى فقدان أحد أفراد العائلة، يرجى إدخال اسم الشهيد أو المفقود كاملاً.',
    });

    check(Boolean(data.lostPersonDate && data.lostPersonDate.trim().length >= 4), {
      field: 'lostPersonDate',
      label: 'تاريخ الاستشهاد أو الفقد',
      stepIndex: 4,
      message: 'يرجى تحديد تاريخ الاستشهاد أو الفقد خلال الحرب.',
    });
  }

  // التحقق من إصابات الحرب
  if (data.hasWarInjury) {
    check(Boolean(data.warInjuryType && data.warInjuryType.trim().length >= 2), {
      field: 'warInjuryType',
      label: 'نوع الإصابة',
      stepIndex: 4,
      message: 'تم تحديد وجود إصابة حرب، يرجى تحديد نوع الإصابة.',
    });

    check(Boolean(data.warInjuryDate && data.warInjuryDate.trim().length >= 4), {
      field: 'warInjuryDate',
      label: 'تاريخ الإصابة',
      stepIndex: 4,
      message: 'يرجى إدخال تاريخ الإصابة خلال الحرب.',
    });
  }

  // 5. السكن والعنوان وحالة الإقامة (الخطوة 5)
  check(Boolean(data.residencyStatus), {
    field: 'residencyStatus',
    label: 'حالة الإقامة (مقيم / نازح)',
    stepIndex: 5,
    message: 'يرجى اختيار حالة الإقامة (مقيم أو نازح).',
  });

  check(Boolean(data.housingType), {
    field: 'housingType',
    label: 'نوع السكن',
    stepIndex: 5,
    message: 'يرجى اختيار نوع السكن (ملك، إيجار، خيمة، إلخ).',
  });

  check(Boolean(data.housingCondition), {
    field: 'housingCondition',
    label: 'حالة السكن',
    stepIndex: 5,
    message: 'يرجى اختيار حالة السكن الحالي.',
  });

  check(Boolean(data.city && data.city.trim().length >= 2), {
    field: 'city',
    label: 'المدينة',
    stepIndex: 5,
    message: 'يرجى تحديد المدينة (مثل دير البلح، غزة، إلخ).',
  });

  check(Boolean(data.area && data.area.trim().length >= 2), {
    field: 'area',
    label: 'المنطقة',
    stepIndex: 5,
    message: 'يرجى تحديد المنطقة (حكر الجامع، إلخ).',
  });

  check(Boolean(data.neighborhood && data.neighborhood.trim().length >= 2), {
    field: 'neighborhood',
    label: 'الحي',
    stepIndex: 5,
    message: 'يرجى إدخال اسم الحي.',
  });

  check(Boolean(data.nearestLandmark && data.nearestLandmark.trim().length >= 3), {
    field: 'nearestLandmark',
    label: 'أقرب معلم',
    stepIndex: 5,
    message: 'يرجى تحديد أقرب معلم معروف (مسجد، مدرسة، مفترق، إلخ).',
  });

  // 6. الاتصال والمحفظة (الخطوة 6)
  check(isValidPhoneNumber(data.primaryPhone || ''), {
    field: 'primaryPhone',
    label: 'رقم الجوال الأساسي',
    stepIndex: 6,
    message: 'يرجى إدخال رقم جوال أساسي صحيح (059xxxxxxx أو 056xxxxxxx).',
  });

  check(isValidPhoneNumber(data.whatsappPhone || ''), {
    field: 'whatsappPhone',
    label: 'رقم الواتس اب',
    stepIndex: 6,
    message: 'يرجى إدخال رقم واتس اب نشط للتواصل المباشر وإرسال الإشعارات.',
  });

  check(Boolean(data.walletType), {
    field: 'walletType',
    label: 'نوع المحفظة أو الحساب البنكي',
    stepIndex: 6,
    message: 'يرجى تحديد جهة الاستلام المالي (بال باي، جوال بي، بنك فلسطين).',
  });

  if (data.walletType && data.walletType !== 'لا يوجد محفظة') {
    check(Boolean(data.walletNumber && data.walletNumber.trim().length >= 5), {
      field: 'walletNumber',
      label: 'رقم المحفظة أو الحساب البنكي',
      stepIndex: 6,
      message: 'يرجى إدخال رقم المحفظة أو رقم الحساب البنكي المعتمد.',
    });

    const holderWords = (data.accountHolderName || '').trim().split(/\s+/).filter(Boolean);
    check(holderWords.length >= 2, {
      field: 'accountHolderName',
      label: 'اسم صاحب الحساب',
      stepIndex: 6,
      message: 'يرجى إدخال اسم صاحب الحساب كما هو مسجل لدى البنك أو المحفظة.',
    });

    check(Boolean(data.accountHolderRelationship && data.accountHolderRelationship.trim().length >= 2), {
      field: 'accountHolderRelationship',
      label: 'صلة القرابة بصاحب الحساب',
      stepIndex: 6,
      message: 'يرجى تحديد صلة القرابة بصاحب الحساب (مثلاً: رب الأسرة نفسه، الزوجة، الابن).',
    });
  }

  const completionPercentage = totalRules > 0 ? Math.round((passedRules / totalRules) * 100) : 0;
  const isEligibleToFinalize = missingItems.length === 0;

  return {
    isEligibleToFinalize,
    completionPercentage,
    totalRequiredFields: totalRules,
    completedFieldsCount: passedRules,
    missingItems,
  };
}

/**
 * Checks whether a citizen family record has completed all required fields.
 */
export function isFamilyRecordComplete(data: Partial<FamilyRecord>): boolean {
  if (data.status === 'مستوفي كامل البيانات' && !data.needsCompletion) {
    return true;
  }
  const result = validateFamilyForm(data);
  return result.isEligibleToFinalize;
}

/**
 * Returns the exact status label requested by the user:
 * "مستوفي كامل البيانات" for those who completed all data,
 * and keeps "يحتاج استكمال" for those who haven't completed yet.
 */
export function getFamilyStatusBadge(data: Partial<FamilyRecord>): {
  label: 'مستوفي كامل البيانات' | 'يحتاج استكمال';
  isComplete: boolean;
  className: string;
} {
  const complete = isFamilyRecordComplete(data);
  if (complete) {
    return {
      label: 'مستوفي كامل البيانات',
      isComplete: true,
      className: 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-black',
    };
  }
  return {
    label: 'يحتاج استكمال',
    isComplete: false,
    className: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
  };
}


import type { z } from 'zod';
import { assessmentSchema } from './schema';

type AssessmentInput = z.input<typeof assessmentSchema>;

// Fields rendered with pickers that report a cleared value as null.
type PickerField = 'dateOfBirth' | 'assessmentDate' | 'followUpDate' | 'mobility';

export type AssessmentFormValues = {
  [K in keyof AssessmentInput]: K extends PickerField
    ? AssessmentInput[K] | null
    : AssessmentInput[K] extends number
      ? number | string
      : AssessmentInput[K] extends true
        ? boolean
        : AssessmentInput[K];
};

export const emptyAssessment: AssessmentFormValues = {
  mrn: '',
  patientName: '',
  dateOfBirth: null,
  assessmentDate: null,
  mobility: null,
  barthelIndex: '',
  medicationCount: '',
  pharmacistReviewRequested: false,
  followUpDate: null,
  consentObtained: false,
};

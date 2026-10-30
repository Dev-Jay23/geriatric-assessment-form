import { samplePatient } from './sample-patient';
import { assessmentSchema } from './schema';

describe('assessmentSchema', () => {
  it('accepts a patient who turns 60 on the assessment date and rejects one a day younger', () => {
    // samplePatient.assessmentDate is 2026-08-07
    const turns60 = assessmentSchema.safeParse({ ...samplePatient, dateOfBirth: '1966-08-07' });
    const dayShort = assessmentSchema.safeParse({ ...samplePatient, dateOfBirth: '1966-08-08' });

    expect(turns60.success).toBe(true);
    expect(dayShort.success).toBe(false);
    expect(dayShort.error?.issues).toEqual([
      expect.objectContaining({
        path: ['dateOfBirth'],
        message: 'This pathway is for patients aged 60 and over',
      }),
    ]);
  });
});

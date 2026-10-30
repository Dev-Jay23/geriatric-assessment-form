import dayjs from 'dayjs';
import { useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Code,
  Container,
  Group,
  Input,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { schemaResolver, useForm } from '@mantine/form';
import { emptyAssessment, type AssessmentFormValues } from './form-values';
import { mobilityOptions } from './mobility-options';
import { samplePatient } from './sample-patient';
import { assessmentSchema, type Assessment } from './schema';

const DATE_FORMAT = 'YYYY-MM-DD';

const fakeSave = () => new Promise<void>((resolve) => setTimeout(resolve, 800));

interface AssessmentFormProps {
  onSave?: (assessment: Assessment) => Promise<void>;
}

export function AssessmentForm({ onSave = fakeSave }: AssessmentFormProps) {
  const [saved, setSaved] = useState<Assessment | null>(null);

  const form = useForm<AssessmentFormValues, Assessment>({
    initialValues: emptyAssessment,
    validate: schemaResolver(assessmentSchema),
    validateInputOnBlur: true,
    // Only runs after the resolver has passed, so this hands the submit handler Zod's parsed output.
    transformValues: (values) => assessmentSchema.parse(values),
  });

  const handleSubmit = async (assessment: Assessment) => {
    setSaved(null);
    await onSave(assessment);
    setSaved(assessment);
  };

  const loadSamplePatient = () => {
    form.setValues(samplePatient);
    form.clearErrors();
    setSaved(null);
  };

  return (
    <Container size="sm" my="xl">
      <Paper withBorder shadow="sm" p="xl" radius="md">
        <Stack>
          <Title order={1}>Geriatric Care Assessment</Title>

          <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
            <Stack>
              <TextInput
                label="Medical record number"
                placeholder="MRN-004821"
                withAsterisk
                {...form.getInputProps('mrn')}
              />
              <TextInput label="Patient name" withAsterisk {...form.getInputProps('patientName')} />
              <DateInput
                label="Date of birth"
                valueFormat={DATE_FORMAT}
                placeholder={DATE_FORMAT}
                withAsterisk
                {...form.getInputProps('dateOfBirth')}
              />
              <DateInput
                label="Assessment date"
                valueFormat={DATE_FORMAT}
                placeholder={DATE_FORMAT}
                maxDate={dayjs().format(DATE_FORMAT)}
                withAsterisk
                {...form.getInputProps('assessmentDate')}
              />
              <Select
                label="Mobility"
                data={mobilityOptions}
                withAsterisk
                {...form.getInputProps('mobility')}
              />
              <NumberInput
                label="Barthel Index"
                step={5}
                min={0}
                max={100}
                clampBehavior="none"
                withAsterisk
                {...form.getInputProps('barthelIndex')}
              />
              <NumberInput
                label="Regular medications"
                min={0}
                max={30}
                clampBehavior="none"
                withAsterisk
                {...form.getInputProps('medicationCount')}
              />
              <Checkbox
                label="Pharmacist review requested"
                {...form.getInputProps('pharmacistReviewRequested', { type: 'checkbox' })}
              />
              <DateInput
                label="Next review date"
                valueFormat={DATE_FORMAT}
                placeholder={DATE_FORMAT}
                withAsterisk
                {...form.getInputProps('followUpDate')}
              />
              <Input.Wrapper label="Consent" labelElement="div" withAsterisk>
                <Checkbox
                  label="Patient or representative has given consent"
                  {...form.getInputProps('consentObtained', { type: 'checkbox' })}
                />
              </Input.Wrapper>

              <Group justify="space-between" mt="md">
                <Button variant="default" onClick={loadSamplePatient} disabled={form.submitting}>
                  Load sample patient
                </Button>
                <Button type="submit" loading={form.submitting}>
                  Save assessment
                </Button>
              </Group>
            </Stack>
          </form>

          {saved && (
            <Alert color="teal" title="Assessment saved">
              <Code block>{JSON.stringify(saved, null, 2)}</Code>
            </Alert>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}

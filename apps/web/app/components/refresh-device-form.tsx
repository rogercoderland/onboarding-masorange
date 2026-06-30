'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@onboarding-nx/ui';
import styles from './refresh-device-form.module.css';

export interface RefreshDeviceFormProps {
  /** Server action that revalidates the device tag read from the form. */
  action: (formData: FormData) => void | Promise<void>;
  /** Submitted as a hidden field and validated server-side. */
  slug: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="secondary" loading={pending}>
      {pending ? 'Revalidando…' : 'Refrescar datos'}
    </Button>
  );
}

export function RefreshDeviceForm({ action, slug }: RefreshDeviceFormProps) {
  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="slug" value={slug} />
      <SubmitButton />
    </form>
  );
}

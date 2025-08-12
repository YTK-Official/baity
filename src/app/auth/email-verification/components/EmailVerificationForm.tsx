'use client';

import { Button, Form, Input, addToast } from '@/components/heroui';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useTranslations } from '@/lib/translates';
import { forgetPasswordAction } from '../action';

export const EmailVerificationForm = () => {
  const t = useTranslations('auth');
  const { handleSubmit, control, formState } = useForm();
  const [error, setError] = useState<Record<string, string[]> | null>();

  const onSubmit = async (data: unknown) => {
    const { error } = await forgetPasswordAction(data);

    if (error) {
      setError(error);
      return;
    }

    addToast({
      title: t('messages.email-verification-toast'),
      description: t('messages.description'),
      color: 'success',
    });
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      validationErrors={error ?? {}}
      validationBehavior='aria'
      className='space-y-8'
    >
      {error?.form && (
        <div className='mx-auto mt-4'>
          {error.form.map((error) => (
            <p key={error} className='text-center text-red-600'>
              {error}
            </p>
          ))}
        </div>
      )}

      <Controller
        control={control}
        name='email'
        render={({ field }) => (
          <Input size='sm' type='email' label={t('shared.email')} fullWidth {...field} />
        )}
      />

      <Button
        color='primary'
        className='font-semibold text-medium'
        variant='solid'
        fullWidth
        size='lg'
        type='submit'
        isLoading={formState.isSubmitting}
      >
        {t('forgot-password.button')}
      </Button>
    </Form>
  );
};

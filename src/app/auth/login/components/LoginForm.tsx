'use client';

import { Button, Checkbox, Form, Input, addToast } from '@/components/heroui';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { PasswordInput } from '@/components/shared/PasswordInput';

import { useTranslations } from '@/lib/translates';
import { getAuth } from '@/services/user';
import { loginAction } from '../action';

export const LoginForm = () => {
  const {
    handleSubmit,
    control,
    formState: { isLoading, isSubmitting },
  } = useForm();
  const [error, setError] = useState<Record<string, string[]> | null>(null);

  const onSubmit = async (data: unknown) => {
    const { error } = await loginAction(data);

    if (error) {
      setError(error);
      return;
    }

    const user = await getAuth();

    addToast({ title: 'Logged in successfully', color: 'success' });
    redirect(user.role === 'admin' ? '/admin' : user.role === 'chef' ? '/chef' : '/');
  };
  const t = useTranslations('auth');
  return (
    <Form onSubmit={handleSubmit(onSubmit)} className='space-y-8' validationErrors={error ?? {}}>
      {error?.form && (
        <div className='mx-auto mt-4'>
          {error.form.map((error) => (
            <p key={error} className='text-center text-red-600'>
              {error}
            </p>
          ))}
        </div>
      )}
      <div className='mb-3 flex w-full flex-col gap-4'>
        <Controller
          control={control}
          name='email'
          render={({ field }) => (
            <Input size='sm' type='email' label={t('shared.email')} {...field} />
          )}
        />
        <Controller
          control={control}
          name='password'
          render={({ field }) => (
            <PasswordInput isRequired label={t('shared.password')} {...field} />
          )}
        />
      </div>
      <div className='mb-2 flex w-full items-center justify-between gap-4'>
        <Controller
          control={control}
          name='rememberMe'
          render={({ field }) => (
            <Checkbox size='sm' {...field}>
              {t('login.remember-me')}
            </Checkbox>
          )}
        />
        <Link href='/auth/email-verification?query=forgot-password' className='text-primary'>
          {t('login.forgot-password')}
        </Link>
      </div>

      <Button
        color='primary'
        className='font-semibold text-medium uppercase'
        fullWidth
        variant='solid'
        size='lg'
        type='submit'
        isLoading={isLoading || isSubmitting}
        isDisabled={isLoading || isSubmitting}
      >
        {t('login.button')}
      </Button>
    </Form>
  );
};

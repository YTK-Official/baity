'use client';

import { Button, Card, Form, Image, Input, addToast } from '@/components/heroui';

import { useTranslations } from '@/lib/translates';
import type { User } from '@/types/user';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaCamera } from 'react-icons/fa';
import { updateProfileAction } from '../action';
import { VerifyEmail } from './VerifyEmail';

type ProfileFormProps = {
  user: User;
};

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const t = useTranslations('auth');
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image,
    },
  });
  const [image, setImage] = useState<File | string | null>(user.image);
  const [error, setError] = useState<Record<string, string[]> | null>(null);
  const router = useRouter();

  const onSubmit = async (data: object) => {
    const { error, data: result } = await updateProfileAction({
      ...data,
      image,
    });

    if (error) {
      setError(error);
      return;
    }

    if (result.email !== user.email) {
      addToast({
        title: t('messages.email-updated'),
        description: t('messages.email-description'),
        color: 'success',
      });
    }

    addToast({
      title: t('messages.profile-updated'),
      description: t('messages.profile-updated-successfully'),
      color: 'success',
    });

    router.refresh();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    setImage(file);
  };

  return (
    <Card className='w-full rounded-2xl bg-white p-6 shadow-lg'>
      <div className='mb-6'>
        <Button variant='light' className='font-medium' onPress={() => router.back()}>
          ← {t('shared.back-button')}
        </Button>
      </div>

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

        <div className='group relative mx-auto'>
          <Image
            src={
              typeof image === 'string'
                ? image
                : image instanceof File
                  ? URL.createObjectURL(image)
                  : ''
            }
            alt={user.name || 'User'}
            width={120}
            height={120}
            className='size-32 rounded-full border-4 border-primary bg-gray-100 object-cover shadow-lg'
          />
          <label
            htmlFor='profile-image'
            className='absolute right-2 bottom-2 z-10 flex cursor-pointer items-center justify-center rounded-full bg-primary p-2 text-white shadow transition hover:bg-primary/80'
          >
            <Controller
              control={control}
              name='image'
              render={({ field: { value, onChange, ...field } }) => (
                <input
                  id='profile-image'
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={onFileChange}
                  {...field}
                />
              )}
            />
            <FaCamera size={16} />
          </label>
        </div>

        <Controller
          control={control}
          name='name'
          render={({ field }) => (
            <Input size='sm' type='text' label={t('shared.name')} {...field} />
          )}
        />
        <Controller
          control={control}
          name='phone'
          render={({ field }) => (
            <Input size='sm' type='tel' label={t('shared.phone')} {...field} />
          )}
        />
        <Controller
          control={control}
          name='email'
          render={({ field }) => (
            <Input size='sm' type='email' label={t('shared.email')} {...field} />
          )}
        />

        <div className='w-full space-y-4'>
          <Button
            type='submit'
            color='primary'
            className='mt-2 w-full font-semibold'
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          >
            {t('profile.update-profile')}
          </Button>
          <VerifyEmail emailVerified={user.emailVerified} />
        </div>
      </Form>
    </Card>
  );
};

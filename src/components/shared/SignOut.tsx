'use client';

import { Button, addToast } from '@/components/heroui';
import { authClient } from '@/lib/auth/client';
import { useTranslations } from '@/lib/translates';
import { tryCatch } from '@/utils/tryCatch';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const SignOut = () => {
  const t = useTranslations('auth');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const signOut = async () => {
    setIsLoading(true);
    const [error] = await tryCatch(authClient.signOut());
    setIsLoading(false);

    if (error) {
      addToast({ title: t('messages.error-signing-out'), color: 'danger' });
      return;
    }

    addToast({ title: t('messages.signed-out-successfully'), color: 'success' });
    router.refresh();
    router.replace('/');
  };

  return (
    <Button
      color='danger'
      variant='light'
      onPress={signOut}
      isLoading={isLoading}
      isDisabled={isLoading}
    >
      {t('profile.sign-out')}
    </Button>
  );
};

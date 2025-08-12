'use client';

import { Button, Card, CardBody, Input, Textarea, addToast } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import { useRequest } from 'ahooks';
import { useRouter } from 'next/navigation';
import { sendContactEmail } from './actions';

export default function ContactUsPage() {
  const t = useTranslations('contact-us');
  const router = useRouter();
  const { loading, runAsync } = useRequest(sendContactEmail, {
    manual: true,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = Object.fromEntries(formData);

    const { success, error } = await runAsync(form);
    if (!success) {
      addToast({
        title: t('error-message'),
        description: error ?? 'Unknown error',
        color: 'danger',
      });
      return;
    }
    addToast({
      title: t('success-message'),
      description: t('success-message-description'),
      color: 'success',
    });
  };

  return (
    <main className='container flex min-h-screen w-full items-center justify-center'>
      <Card className='mx-auto w-full max-w-lg'>
        <CardBody>
          <h1 className='mb-6 text-center font-bold text-3xl'>{t('title')}</h1>
          <form className='space-y-4' onSubmit={handleSubmit}>
            <Input label={t('name')} name='name' isRequired />
            <Input label={t('email')} name='email' type='email' isRequired />
            <Textarea label={t('message')} name='message' isRequired minRows={4} />
            <div className='flex gap-2'>
              <Button
                type='button'
                variant='flat'
                color='default'
                onPress={() => router.back()}
                fullWidth
              >
                {t('back')}
              </Button>
              <Button
                type='submit'
                color='primary'
                fullWidth
                isDisabled={loading}
                isLoading={loading}
              >
                {t('send-message')}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}

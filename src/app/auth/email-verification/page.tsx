import { getTranslations } from 'next-intl/server';
import { AuthContainer } from '../components/AuthContainer';
import { BackButton } from './components/BackButton';
import { EmailVerificationForm } from './components/EmailVerificationForm';

const EmailVerification = async () => {
  const t = await getTranslations('auth');
  return (
    <AuthContainer>
      <AuthContainer.Header>
        <BackButton />
        <AuthContainer.Title>{t('forgot-password.title')}</AuthContainer.Title>
      </AuthContainer.Header>
      <EmailVerificationForm />
    </AuthContainer>
  );
};

export default EmailVerification;

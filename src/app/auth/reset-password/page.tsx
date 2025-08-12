import { getTranslations } from 'next-intl/server';
import { AuthContainer } from '../components/AuthContainer';
import { ResetPasswordForm } from './components/ResetPasswordForm';

const ResetPassword = async () => {
  const t = await getTranslations('auth');
  return (
    <AuthContainer>
      <AuthContainer.Header>
        <AuthContainer.Title>{t('reset-password.title')}</AuthContainer.Title>
      </AuthContainer.Header>
      <ResetPasswordForm />
    </AuthContainer>
  );
};

export default ResetPassword;

import { getTranslations } from 'next-intl/server';
import { AuthContainer } from '../components/AuthContainer';
import { RegisterForm } from './components/RegisterForm';

const Register = async () => {
  const t = await getTranslations('auth');
  return (
    <AuthContainer>
      <AuthContainer.Header>
        <AuthContainer.Title>{t('register.title')}</AuthContainer.Title>
      </AuthContainer.Header>
      <AuthContainer.Content>
        <RegisterForm />
      </AuthContainer.Content>
      <AuthContainer.Footer>
        <AuthContainer.Link href='/auth/login' description={t('register.have-account')}>
          {t('register.login')}
        </AuthContainer.Link>
      </AuthContainer.Footer>
    </AuthContainer>
  );
};

export default Register;

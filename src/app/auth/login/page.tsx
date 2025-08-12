import { getTranslations } from 'next-intl/server';
import { AuthContainer } from '../components/AuthContainer';
import { LoginForm } from './components/LoginForm';
import { OAuth } from './components/OAuth';

const Login = async () => {
  const t = await getTranslations('auth');
  return (
    <AuthContainer>
      <AuthContainer.Header>
        <AuthContainer.Title>{t('login.title')}</AuthContainer.Title>
      </AuthContainer.Header>
      <AuthContainer.Content>
        <OAuth />
        <div className='mb-2 flex items-center justify-between gap-2 md:mb-3'>
          <div className='h-[1px] flex-1 bg-gray-200' />
          <p className='text-gray-400'>{t('login.or')}</p>
          <div className='h-[1px] flex-1 bg-gray-200' />
        </div>
        <LoginForm />
      </AuthContainer.Content>
      <AuthContainer.Footer>
        <AuthContainer.Link href='/auth/register' description={t('login.no-account')}>
          {t('register.button')}
        </AuthContainer.Link>
      </AuthContainer.Footer>
    </AuthContainer>
  );
};

export default Login;

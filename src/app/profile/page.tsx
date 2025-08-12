import { SignOut } from '@/components/shared/SignOut';
import { getAuth } from '@/services/user';
import { tryCatch } from '@/utils/tryCatch';
import { notFound } from 'next/navigation';
import { ProfileForm } from './components/ProfileForm';

export default async function ProfilePage() {
  const [authError, user] = await tryCatch(getAuth());

  if (authError) {
    return notFound();
  }

  return (
    <main className='container mx-auto max-w-xl py-10'>
      <section className='flex flex-col items-center gap-6 rounded-2xl bg-white p-8'>
        <ProfileForm user={user} />
        <div className='mt-6 flex w-full flex-col items-center gap-2 border-t pt-6'>
          <SignOut />
        </div>
      </section>
    </main>
  );
}

import { Spinner } from '@/components/heroui';

export default function Loading() {
  return (
    <main className='flex h-screen items-center justify-center'>
      <Spinner size='lg' />
    </main>
  );
}

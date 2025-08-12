import { Button } from '@/components/heroui';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className='flex h-screen flex-col items-center justify-center bg-background px-4 text-center'>
      <h1 className='font-bold text-6xl text-primary'>404</h1>
      <p className='mt-4 text-gray-500 text-xl'>
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button href='/' color='primary' className='mt-6' as={Link}>
        Go Back Home
      </Button>
    </div>
  );
};

export default NotFound;

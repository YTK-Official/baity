import { getTranslations } from '@/lib/translates';
import { getChefs } from '@/services/user';
import { tryCatch } from '@/utils/tryCatch';
import { notFound } from 'next/navigation';
import { ChefCard } from './components/ChefCard';
import { ChefsPagination } from './components/ChefsPagination';

export default async function ChefsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: paramsPage } = await searchParams;
  const t = await getTranslations('chefs');
  const page = paramsPage ? Number.parseInt(paramsPage) : 1;
  const [error, data] = await tryCatch(getChefs(page));

  if (error) {
    notFound();
  }

  if (!data || data.chefs.length === 0) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <p className='text-center text-2xl text-muted-foreground'>{t('no-chefs')}</p>
      </div>
    );
  }

  const { chefs, totalPages, currentPage } = data;

  return (
    <main className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 text-center font-bold text-3xl'>{t('title')}</h1>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {chefs.map((chef) => (
          <ChefCard key={chef.id} {...chef} />
        ))}
      </div>

      <ChefsPagination totalPages={totalPages} currentPage={currentPage} />
    </main>
  );
}

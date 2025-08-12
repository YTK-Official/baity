import { getTranslations } from '@/lib/translates';
import { getNewArrival } from '@/services/product';
import ProductCard from '../components/ProductCard';

export default async function NewArrivalsPage() {
  const products = await getNewArrival();
  const t = await getTranslations('products');

  // Check if there are any products to display, if no
  if (products.length === 0) {
    return <h1 className='text-center font-bold text-3xl'>{t('no-products')}</h1>;
  }

  return (
    <main className='container py-8'>
      <h1 className='mb-8 text-center font-bold text-4xl'>{t('new-arrivals')}</h1>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}

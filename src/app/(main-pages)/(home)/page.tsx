import { getTranslations } from '@/lib/translates';
import { getNewArrival, getProducts } from '@/services/product';
import { getBestSellers } from '@/services/user';
import { AllProductsCard } from './components/Cards/AllProducts';
import { BestSellerCard } from './components/Cards/BestSeller';
import { NewArrivalCard } from './components/Cards/NewArrival';
import { CardsContainer } from './components/CardsContainer';
import { Hero } from './components/Hero';

const Home = async () => {
  const [bestSellers, newArrival, allProducts] = await Promise.all([
    getBestSellers(),
    getNewArrival({ limit: 10 }),
    getProducts({ limit: 10, status: ['active', 'inactive'] }),
  ]);
  const t = await getTranslations('titles');

  return (
    <main className='space-y-16 py-4'>
      <Hero />
      <CardsContainer
        title={t('best-chefs')}
        data={bestSellers}
        Item={BestSellerCard}
        viewAllLink='/chefs'
      />
      <CardsContainer
        title={t('new-arrivals')}
        data={newArrival}
        Item={NewArrivalCard}
        viewAllLink='/products/new-arrival'
      />
      <CardsContainer
        title={t('all-products')}
        data={allProducts}
        Item={AllProductsCard}
        viewAllLink='/products'
      />
    </main>
  );
};

export default Home;

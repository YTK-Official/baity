import { Spinner } from '@/components/heroui';
import { getProductById } from '@/services/product';
import { getAuth } from '@/services/user';
import { tryCatch } from '@/utils/tryCatch';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ProductFeedbacks from '../components/ProductFeedbacks';
import ProductImagesGallery from '../components/ProductImagesGallery';
import ProductInfo from '../components/ProductInfo';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function Product({ params }: ProductPageProps) {
  const { id } = await params;
  const [prodError, prod] = await tryCatch(getProductById(id));

  if (prodError || !prod) return notFound();

  // Extract user and orders from prod
  const { orders = [], feedbacks = [] } = prod;

  const [userError, user] = await tryCatch(getAuth());

  const isOwner = userError || user.id === prod.userId;
  const userHasFeedback =
    userError || feedbacks.find((feedback) => feedback.user.id === user.id) !== undefined;
  const canAddFeedback = !isOwner && !userHasFeedback;
  const feedbacksWithoutOwner = feedbacks.filter((feedback) => feedback.user.id !== prod.userId);

  return (
    <main className='container mx-auto max-w-3xl overflow-x-hidden py-10'>
      <section className='flex flex-col gap-8 md:flex-row'>
        {Array.isArray(prod.images) && prod.images.length > 0 && (
          <ProductImagesGallery images={prod.images} name={prod.name} />
        )}
        <ProductInfo {...prod} totalOrders={orders.length} />
      </section>

      <Suspense fallback={<Spinner size='lg' />}>
        <ProductFeedbacks
          feedbacks={feedbacksWithoutOwner}
          userId={user?.id}
          productId={id}
          canAddFeedback={canAddFeedback}
        />
      </Suspense>
    </main>
  );
}

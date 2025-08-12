'use client';

import { Button, addToast } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import { createFeedback } from '@/services/feedback';
import type { getProductById } from '@/services/product';
import { tryCatch } from '@/utils/tryCatch';
import { useRequest } from 'ahooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AddFeedbackForm } from './AddFeedbackForm';

interface ProductFeedbacksProps {
  feedbacks: Awaited<ReturnType<typeof getProductById>>['feedbacks'];
  userId?: string;
  productId: string;
  canAddFeedback: boolean;
}

const ProductFeedbacks: React.FC<ProductFeedbacksProps> = ({
  feedbacks,
  userId,
  productId,
  canAddFeedback,
}) => {
  const t = useTranslations('products');
  const router = useRouter();
  const [isAddingFeedback, setIsAddingFeedback] = useState(false);
  const { loading, runAsync } = useRequest(createFeedback, {
    manual: true,
  });

  const handleSubmitFeedback = async (rating: number, comment: string) => {
    if (!userId) {
      return;
    }

    setIsAddingFeedback(true);
    const [err] = await tryCatch(
      runAsync({
        productId,
        rating,
        comment,
        userId,
      })
    );
    setIsAddingFeedback(false);

    if (err) {
      addToast({
        title: t('feedback.error-submitting-feedback'),
        color: 'danger',
      });
      console.error(t('feedback.error-submitting-feedback'), err);
      return;
    }

    router.refresh();
  };

  return (
    <section className="container mx-auto mt-10 max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-2xl">{t('feedback.title')}</h2>
        {canAddFeedback && userId && (
          <Button
            variant="shadow"
            onPress={() => setIsAddingFeedback(true)}
            className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            {t('feedback.add-feedback')}
          </Button>
        )}
      </div>

      {isAddingFeedback && canAddFeedback && (
        <AddFeedbackForm
          onSubmit={handleSubmitFeedback}
          onCancel={() => setIsAddingFeedback(false)}
          isLoading={loading}
        />
      )}

      <div className="flex flex-row flex-wrap gap-4">
        {feedbacks.map((fb, idx) => (
          <div
            key={fb.id || idx}
            className="min-w-[220px] max-w-xs flex-1 rounded-lg bg-gray-50 p-4 shadow"
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="font-semibold text-primary">
                {t('labels.rating')}:
              </span>
              <span className="font-bold">{fb.rating} / 5</span>
            </div>
            <p className="text-gray-700">{fb.comment}</p>
            {fb.user && (
              <p className="mt-2 text-gray-500 text-xs">
                {t('feedback.by')}:{' '}
                <span className="font-semibold">{fb.user.name}</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductFeedbacks;

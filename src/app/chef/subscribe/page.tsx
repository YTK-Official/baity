'use client';

import { Button, Card, CardBody, Spinner } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import { getCurrency } from '@/utils/price';
import { useRequest } from 'ahooks';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import { cancelSubscriptionAction, getSubscriptionAction, subscribeAction } from './action';

// Mock subscription plans - in a real app, these would come from an API
const SUBSCRIPTION_PLANS = [
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 499.99,
    features: ['Chef badge', 'Advanced analytics', 'Priority support', 'Featured products'],
    recommended: true,
  },
];

// Mock function to subscribe - in a real app, this would be an API call
const subscribeToChefPlan = async (planId: string) => {
  const { url } = await subscribeAction(planId);

  if (url) {
    redirect(url);
  }
};

const cancelSubscription = async () => {
  const { url } = await cancelSubscriptionAction();

  if (url) {
    redirect(url);
  }
};

export default function ChefSubscribePage() {
  const t = useTranslations('chefs-profile');
  const [selectedPlan, setSelectedPlan] = useState(SUBSCRIPTION_PLANS[0].id); // Default to Pro plan

  const { loading: subscribeLoading, data: subscriptionData } = useRequest(getSubscriptionAction);
  const { loading: cancelLoading, runAsync: cancelAsync } = useRequest(cancelSubscription, {
    manual: true,
  });
  const { loading: subscribeRunLoading, runAsync: subscribeRunAsync } = useRequest(
    subscribeToChefPlan,
    {
      manual: true,
    },
  );

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    subscribeRunAsync(selectedPlan);
  };

  const handleCancelSubscription = () => {
    cancelAsync();
  };

  if (subscribeLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );
  }

  const { success, data: subscribe } = subscriptionData || {};

  if (success && subscribe?.status === 'active') {
    const features = SUBSCRIPTION_PLANS.find((plan) => plan.id === subscribe.plan)?.features;

    return (
      <div className='container mx-auto max-w-5xl px-4 py-8'>
        <h1 className='mb-8 font-bold text-3xl'>{t('subscription.your-subscription')}</h1>
        <p className='mb-8 text-gray-600'>
          {t('subscription.subscription-description-p1')} {subscribe?.plan}{' '}
          {t('subscription.subscription-description-p2')}
        </p>
        <p className='text-gray-600'>{t('subscription.features.features-included-title')}:</p>
        <ul className='mb-6 space-y-2'>
          {features?.map((feature: string) => (
            <li key={feature} className='flex items-center gap-2'>
              <FiCheck className='text-green-500' />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        {!subscribe.cancelAtPeriodEnd && (
          <Button
            color='danger'
            variant='solid'
            isDisabled={cancelLoading}
            isLoading={cancelLoading}
            onPress={handleCancelSubscription}
          >
            {t('subscription.cancel-subscription-button')}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className='container mx-auto max-w-5xl px-4 py-8'>
      <h1 className='mb-8 font-bold text-3xl'>{t('subscription.title')}</h1>

      <p className='mb-8 text-gray-600'>{t('subscription.description')}</p>

      <div className='mb-8 flex justify-center gap-6'>
        {SUBSCRIPTION_PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`relative w-1/3 overflow-hidden transition-all ${
              selectedPlan === plan.id
                ? 'border-2 border-blue-500 shadow-lg'
                : 'border border-gray-200 shadow'
            } ${plan.recommended ? 'scale-105 transform' : ''}`}
          >
            {plan.recommended && (
              <div className='absolute top-0 right-0 bg-blue-500 px-3 py-1 text-white'>
                {t('subscription.recommended')}
              </div>
            )}
            <CardBody className='flex flex-col justify-between p-6'>
              <h3 className='mb-2 font-bold text-xl'>{plan.name}</h3>
              <p className='mb-4 font-bold text-2xl text-blue-600'>
                {getCurrency(plan.price)}
                <span className='font-normal text-gray-500 text-sm'>/month</span>
              </p>
              <ul className='mb-6 space-y-2'>
                {plan.features.map((feature) => (
                  <li key={feature} className='flex items-center gap-2'>
                    <FiCheck className='text-green-500' />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                color={selectedPlan === plan.id ? 'primary' : 'default'}
                variant={selectedPlan === plan.id ? 'solid' : 'light'}
                className='w-full'
                isDisabled={subscribeRunLoading}
                isLoading={subscribeRunLoading}
                onPress={() => handlePlanSelect(plan.id)}
              >
                {selectedPlan === plan.id
                  ? t('subscription.selected')
                  : t('subscription.selecte-plan')}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
      <div className='mt-16 flex justify-center'>
        <Button
          color='primary'
          variant='solid'
          className='w-1/3'
          isDisabled={!selectedPlan || subscribeRunLoading}
          isLoading={subscribeRunLoading}
          onPress={handleSubscribe}
        >
          {t('subscription.subscribe-button')}
        </Button>
      </div>
    </div>
  );
}

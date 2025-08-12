'use client';

import type { RadioProps } from '@/components/heroui';
import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Radio,
  RadioGroup,
  Textarea,
  addToast,
  useDisclosure,
} from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import { cn } from '@/lib/utils';
import { getChefByProductId } from '@/services/user';
import { useRequest } from 'ahooks';
import { redirect } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { checkoutAction } from '../action';

interface BuyProductProps {
  productId: string;
}

export default function CheckoutButton({ productId }: BuyProductProps) {
  const { control, handleSubmit } = useForm();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const t = useTranslations('products');
  const { data: chef } = useRequest(getChefByProductId, {
    refreshDeps: [productId],
    refreshOnWindowFocus: true,
    defaultParams: [productId],
    onSuccess: (data) => {
      if (!data.online) {
        addToast({ title: t('chef-offline-toast'), color: 'danger' });
        return;
      }
    },
  });
  const { loading: checkoutLoading, runAsync: checkoutActionAsync } = useRequest(checkoutAction, {
    manual: true,
    onSuccess: (data) => {
      if (!data.success) {
        addToast({ title: data.message, color: 'danger' });
        return;
      }

      addToast({ title: data.message, color: 'success' });
      if (data.data) {
        redirect(data.data);
      }

      redirect('/checkout/success');
    },
  });

  const onSubmit = async (data: Record<string, string>) => {
    const orderData = {
      ...data,
      quantity: Number(data.quantity || 1),
      productId,
    };

    await checkoutActionAsync(orderData);
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='xl'>
        <ModalContent>
          {(onClose) => (
            <Form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader>Checkout</ModalHeader>
              <ModalBody className='w-full'>
                <Controller
                  control={control}
                  name='paymentMethod'
                  defaultValue='cash'
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      description='Select payment method'
                      orientation='horizontal'
                      label='Payment Method'
                    >
                      <CustomRadio value='cash'>Cash on Delivery</CustomRadio>
                      <CustomRadio value='visa'>Pay Now</CustomRadio>
                    </RadioGroup>
                  )}
                />
                <Controller
                  control={control}
                  name='quantity'
                  defaultValue={1}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      label='quantity'
                      minValue={1}
                      maxValue={10}
                      isRequired
                      className='mb-4'
                    />
                  )}
                />
                <Controller
                  control={control}
                  name='address'
                  render={({ field }) => (
                    <Input
                      {...field}
                      label='address'
                      placeholder='e.g., 123 Main St, Minya, Egypt'
                      isRequired
                      className='mb-4'
                    />
                  )}
                />
                <Controller
                  control={control}
                  name='note'
                  render={({ field }) => (
                    <Textarea {...field} label='Note' placeholder='Add your note' />
                  )}
                />
              </ModalBody>
              <ModalFooter className='w-full'>
                <Button
                  fullWidth
                  type='reset'
                  color='danger'
                  variant='light'
                  onPress={onClose}
                  isDisabled={checkoutLoading}
                >
                  Close
                </Button>
                <Button
                  fullWidth
                  type='submit'
                  color='primary'
                  isDisabled={checkoutLoading}
                  isLoading={checkoutLoading}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>

      <Button
        color={chef?.online ? 'primary' : 'danger'}
        variant={chef?.online ? 'solid' : 'flat'}
        fullWidth
        onPress={onOpen}
        isDisabled={checkoutLoading || !chef?.online}
        isLoading={checkoutLoading}
      >
        {chef?.online ? t('buy-button') : t('buy-button-offline')}
      </Button>
    </>
  );
}

export const CustomRadio = ({ children, ...otherProps }: RadioProps) => {
  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          'inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between',
          'flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent',
          'data-[selected=true]:border-primary',
        ),
      }}
    >
      {children}
    </Radio>
  );
};

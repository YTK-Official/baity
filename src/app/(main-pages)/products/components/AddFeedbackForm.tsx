import { Button, Select, SelectItem, Textarea } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import { useState } from 'react';

interface FeedbackFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AddFeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit, onCancel, isLoading }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const t = useTranslations('products');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(rating, comment);
    setRating(5);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className='mb-6 rounded-lg bg-gray-50 p-4'>
      <div className='mb-4'>
        <Select
          label={t('labels.rating')}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className='w-full rounded-lg border p-2'
        >
          {[5, 4, 3, 2, 1].map((num) => (
            <SelectItem key={num} textValue={num.toString()}>
              {num} stars
            </SelectItem>
          ))}
        </Select>
      </div>
      <div className='mb-4'>
        <Textarea
          label={t('labels.comment')}
          placeholder={t('feedback.write-feedback')}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className='w-full rounded-lg border p-2'
          rows={3}
          required
        />
      </div>
      <div className='flex gap-2'>
        <Button
          type='submit'
          className='rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90'
          isLoading={isLoading}
        >
          {t('feedback.submit-button')}
        </Button>
        <button
          type='reset'
          onClick={onCancel}
          className='rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300'
        >
          {t('feedback.reset-button')}
        </button>
      </div>
    </form>
  );
};

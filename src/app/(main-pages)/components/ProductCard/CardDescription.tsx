export type CardDescriptionProps = {
  description: string;
};

export const CardDescription = ({ description }: CardDescriptionProps) => (
  <div className='h-0 rounded-b-xl px-3 opacity-0 duration-300 group-hover:visible group-hover:h-auto group-hover:pb-2 group-hover:opacity-100'>
    <div className='mb-1 h-px w-full bg-gray-300' />
    <p className='line-clamp-4 overflow-y-auto text-default-500 text-xs'>{description}</p>
  </div>
);

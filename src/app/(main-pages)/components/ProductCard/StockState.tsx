import { GoDotFill } from 'react-icons/go';

type StockStateProps = {
  color: string;
  text: string;
};

export const StockState = ({ color, text }: StockStateProps) => {
  return (
    <>
      <GoDotFill className={`mr-1 inline text-sm ${color}`} />
      <span className={`font-semibold text-xs capitalize ${color}`}>{text}</span>
    </>
  );
};

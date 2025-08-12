import { MenubarTaps } from './MenubarTaps';

export function MenubarDesktop() {
  return (
    <div className='container mt-4 flex items-center justify-start gap-4 max-sm:hidden'>
      <MenubarTaps />
    </div>
  );
}

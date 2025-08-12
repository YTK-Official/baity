'use client';

import { Button } from '@/components/heroui';
import Link from 'next/link';
import { FiMenu } from 'react-icons/fi';

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useTranslations } from '@/lib/translates';

const MainPagesMobileSheet = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const t = useTranslations('common');

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="space-x-2 rounded-xl bg-gradient-to-tr from-customBlue to-customLightBlue font-semibold text-md text-white"
          isIconOnly
        >
          <FiMenu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col items-center justify-between">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-5 flex w-full flex-col gap-3">
          <Button
            variant="flat"
            className="font-semibold uppercase"
            as={Link}
            href="/chefs"
          >
            chefs
          </Button>
          <Button
            variant="flat"
            className="font-semibold uppercase"
            as={Link}
            href="/products/new-arrival"
          >
            new arrival
          </Button>
          <Button
            variant="flat"
            className="font-semibold uppercase"
            as={Link}
            href="/products"
          >
            all products
          </Button>
          <Button
            variant="flat"
            className="font-semibold uppercase"
            as={Link}
            href="/contact"
          >
            contact us
          </Button>
        </div>
        <SheetFooter className="w-full">
          <Button
            variant="flat"
            className="font-semibold uppercase"
            as={Link}
            href={isLoggedIn ? '/profile' : '/auth/login'}
            fullWidth
            color={isLoggedIn ? 'default' : 'primary'}
          >
            {isLoggedIn ? 'Profile' : 'Login'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MainPagesMobileSheet;

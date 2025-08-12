import Link from 'next/link';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

type AuthContainerProps = ComponentProps<'section'>;
export const AuthContainer = ({ className, ...props }: AuthContainerProps) => {
  return (
    <section
      className={cn(
        'mx-auto mt-24 w-[90%] rounded-[12px] p-3 shadow-xl md:max-w-md md:p-5',
        className,
      )}
      {...props}
    />
  );
};

type AuthContainerTitleProps = ComponentProps<'h1'>;
export const AuthContainerTitle = ({ className, ...props }: AuthContainerTitleProps) => {
  return (
    <h1 className={cn('mb-3 text-center font-semibold text-3xl md:mb-5', className)} {...props} />
  );
};

type AuthContainerFooterProps = ComponentProps<'div'>;
export const AuthContainerFooter = ({ className, ...props }: AuthContainerFooterProps) => {
  return (
    <div className={cn('mt-2 flex w-full flex-col gap-2 md:mb-2 md:gap-4', className)} {...props} />
  );
};

type AuthContainerLinkProps = ComponentProps<typeof Link> & {
  description?: string;
};
export const AuthContainerLink = ({ className, description, ...props }: AuthContainerLinkProps) => {
  return (
    <div className='flex items-center gap-2'>
      {description && <p>{description}</p>}
      <Link {...props} className={cn('text-[#2252a7]', className)} />
    </div>
  );
};

type AuthContainerContentProps = ComponentProps<'div'>;
export const AuthContainerContent = (props: AuthContainerContentProps) => {
  return <div {...props} />;
};

type AuthContainerHeaderProps = ComponentProps<'div'>;
export const AuthContainerHeader = (props: AuthContainerHeaderProps) => {
  return <div {...props} />;
};

AuthContainer.Header = AuthContainerHeader;
AuthContainer.Content = AuthContainerContent;
AuthContainer.Title = AuthContainerTitle;
AuthContainer.Footer = AuthContainerFooter;
AuthContainer.Link = AuthContainerLink;

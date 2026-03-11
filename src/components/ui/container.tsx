import { ReactNode } from 'react';
import clsx from 'clsx';

interface IContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container = ({ children, className }: IContainerProps) => {
  return <div className={clsx('mx-auto max-w-7xl px-4 sm:px-6', className)}>{children}</div>;
};

import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

const baseStyles = 'rounded-lg font-medium transition cursor-pointer px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm';

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400',
} as const;

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
}

export const Button = ({ variant = 'primary', className, children, ...props }: IButtonProps) => {
  return (
    <button className={clsx(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

const baseStyles =
  'inline-flex items-center justify-center rounded-lg font-medium transition cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed';

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 px-4 py-2',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 px-4 py-2',
  helper: 'bg-white text-gray-700 shadow-sm border border-gray-100 hover:bg-gray-50 px-3 py-1.5 text-xs gap-2',
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
}

export const Button = ({ variant = 'primary', className, children, ...props }: ButtonProps) => {
  return (
    <button className={clsx(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

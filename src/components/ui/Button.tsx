'use client';

import React from 'react';
import styles from './Button.module.css';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, className, ...props }: ButtonProps) => {
  return (
    <button 
      className={cn(styles.button, styles[variant], className)} 
      {...props}
    >
      {children}
    </button>
  );
};

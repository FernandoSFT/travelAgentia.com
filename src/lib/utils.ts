import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge class names. 
 * Even though we use Vanilla CSS, we might use some conditional classes.
 * twMerge is mostly for tailwind, but keeping it for consistency if we add tailwind later.
 * For now, clsx is enough.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

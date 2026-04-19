import styles from './SectionHeader.module.css';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader = ({ label, title, subtitle, align = 'center', className }: SectionHeaderProps) => {
  return (
    <div className={cn(styles.header, styles[align], className)}>
      {label && <span className="label">{label}</span>}
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

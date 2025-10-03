import type { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: 'article' | 'section' | 'div';
}

export const Card = ({ children, className, as: Component = 'article' }: CardProps) => (
  <Component className={clsx('rounded-3xl bg-white shadow-subtle/40 ring-1 ring-black/5', className)}>
    {children}
  </Component>
);

interface CardMediaProps {
  imageUrl: string;
  alt: string;
  ratio?: '16/9' | '16/10' | '4/3' | '1/1';
}

export const CardMedia = ({ imageUrl, alt, ratio = '16/9' }: CardMediaProps) => (
  <div className="overflow-hidden rounded-3xl">
    <div className="relative" style={{ aspectRatio: ratio }}>
      <img
        src={imageUrl}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        loading="lazy"
      />
    </div>
  </div>
);

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent = ({ children, className }: CardContentProps) => (
  <div className={clsx('space-y-3 p-6 md:p-8', className)}>{children}</div>
);

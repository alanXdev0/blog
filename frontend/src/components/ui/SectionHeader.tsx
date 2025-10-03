import type { ReactNode } from 'react';
import clsx from 'clsx';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const SectionHeader = ({ eyebrow, title, description, action, className }: SectionHeaderProps) => (
  <header className={clsx('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
    <div className="space-y-2">
      {eyebrow ? (
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">{eyebrow}</span>
      ) : null}
      <div>
        <h2 className="text-3xl font-semibold text-neutral-950 md:text-4xl">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-base text-neutral-600">{description}</p> : null}
      </div>
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </header>
);

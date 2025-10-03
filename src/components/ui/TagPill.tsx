import clsx from 'clsx';

interface TagPillProps {
  label: string;
  tone?: 'accent' | 'neutral' | 'success' | 'warning';
  className?: string;
  color?: string;
}

const toneStyles: Record<NonNullable<TagPillProps['tone']>, string> = {
  accent: 'bg-accent-soft/30 text-accent border border-accent-soft/40',
  neutral: 'bg-white text-neutral-700 border border-neutral-200',
  success: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  warning: 'bg-amber-50 text-amber-600 border border-amber-100',
};

export const TagPill = ({ label, tone = 'neutral', className, color }: TagPillProps) => {
  const inlineStyle = color
    ? {
        backgroundColor: color,
        borderColor: color,
        color: '#1f1f1f',
      }
    : undefined;

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-tight shadow-sm transition-colors',
        color ? 'text-neutral-800' : toneStyles[tone],
        className,
      )}
      style={inlineStyle}
    >
      {label}
    </span>
  );
};

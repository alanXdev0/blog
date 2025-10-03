import clsx from 'clsx';

interface PostFilterBarProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const PostFilterBar = ({ filters, activeFilter, onFilterChange }: PostFilterBarProps) => (
  <div className="flex flex-wrap gap-3">
    {filters.map((filter) => (
      <button
        key={filter}
        onClick={() => onFilterChange(filter)}
        type="button"
        className={clsx(
          'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
          activeFilter === filter
            ? 'border-accent bg-accent text-white shadow-subtle'
            : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900',
        )}
      >
        {filter}
      </button>
    ))}
  </div>
);

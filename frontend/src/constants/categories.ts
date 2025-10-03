export const DEFAULT_POST_CATEGORIES = ['Mobile', 'Apple', 'Projects', 'Reflections'] as const;

export const DEFAULT_POST_FILTERS = ['All', ...DEFAULT_POST_CATEGORIES] as const;

export type PostFilter = string;

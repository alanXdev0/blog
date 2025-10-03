export interface NavItem {
  label: string;
  to: string;
  external?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: 'https://alananaya.dev', external: true },
];

import { Container } from './Container';

const footerLinks = [
  { label: 'GitHub', href: 'https://github.com/alananaya' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alananaya' },
  { label: 'Twitter', href: 'https://twitter.com/alananaya' },
];

export const Footer = () => (
  <footer className="mt-20 border-t border-neutral-100 bg-neutral-50 transition-colors dark:border-neutral-800 dark:bg-neutral-950">
    <Container className="flex flex-col items-center justify-between gap-6 py-12 md:flex-row">
      <div className="space-y-1 text-center md:text-left">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-neutral-500 dark:text-neutral-400">alananaya.dev</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          © {new Date().getFullYear()} Alan Anaya. Building great software.
        </p>
      </div>
      <nav className="flex gap-6 text-sm text-neutral-500 dark:text-neutral-400">
        {footerLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </Container>
  </footer>
);

import { Container } from './Container';

const footerLinks = [
  { label: 'GitHub', href: 'https://github.com/alanxdev0' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alanxdev' },
  { label: 'X', href: 'https://x.com/alananayaa' },
];

export const Footer = () => (
  <footer className="mt-20 border-t border-neutral-100 bg-neutral-50 transition-colors">
    <Container className="flex flex-col items-center justify-between gap-6 py-12 md:flex-row">
      <div className="space-y-1 text-center md:text-left">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-neutral-500">alananaya.dev</p>
        <p className="text-sm text-neutral-500">
          © {new Date().getFullYear()} Alan Anaya. Building great software.
        </p>
      </div>
      <nav className="flex gap-6 text-sm text-neutral-500">
        {footerLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-neutral-900"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </Container>
  </footer>
);

import { Container } from '@/components/layout/Container';
import { Seo } from '@/components/seo/Seo';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export const NotFoundPage = () => (
  <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
    <Seo title="404 — Page not found" canonical="/404" noIndex />
    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">404</span>
    <h1 className="text-4xl font-semibold text-neutral-950">The page you're looking for has taken a detour.</h1>
    <p className="max-w-lg text-sm text-neutral-600">
      The blog is still under active development. Try heading back to the homepage or explore the highlights curated for
      mobile development and Apple craftsmanship.
    </p>
    <Link
      to="/"
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white shadow-subtle transition-colors hover:bg-accent-soft hover:text-neutral-900',
      )}
    >
      Return home
    </Link>
  </Container>
);

export default NotFoundPage;

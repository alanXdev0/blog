import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '@/constants/navigation';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Container } from './Container';

const primaryLinkClasses = (isActive: boolean) =>
  clsx(
    'text-sm font-medium transition-colors',
    isActive ? 'text-accent' : 'text-neutral-600 hover:text-neutral-900',
  );

export const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="text-xl font-semibold tracking-tight text-neutral-900">
          alananaya.dev
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) =>
            item.external ? (
              <a
                key={item.to}
                href={item.to}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
              >
                {item.label}
              </a>
            ) : (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => primaryLinkClasses(isActive)}>
                {item.label}
              </NavLink>
            ),
          )}
          {isAuthenticated ? (
            <Link to="/admin/dashboard">
              <Button size="sm" className="bg-accent text-white hover:bg-accent-soft hover:text-neutral-900">
                Admin
              </Button>
            </Link>
          ) : null}
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-neutral-200 p-2 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {mobileOpen ? (
        <div className="border-t border-neutral-100 bg-white md:hidden">
          <Container className="flex flex-col gap-3 py-4">
            {NAV_ITEMS.map((item) =>
              item.external ? (
                <a
                  key={item.to}
                  href={item.to}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      'rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-neutral-100 text-neutral-900'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}
            {isAuthenticated ? (
              <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)}>
                <Button fullWidth size="sm" className="bg-accent text-white hover:bg-accent-soft hover:text-neutral-900">
                  Admin
                </Button>
              </Link>
            ) : null}
          </Container>
        </div>
      ) : null}
    </header>
  );
};

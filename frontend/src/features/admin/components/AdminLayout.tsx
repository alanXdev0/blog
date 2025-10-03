import { Link, NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { Home, FileText, Image as ImageIcon, Tag, FolderOpen } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

const adminNav = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: Home },
  { label: 'Posts', to: '/admin/posts', icon: FileText },
  { label: 'Projects', to: '/admin/projects', icon: FolderOpen },
  { label: 'Media', to: '/admin/media', icon: ImageIcon },
  { label: 'Taxonomy', to: '/admin/taxonomy', icon: Tag },
];

export const AdminLayout = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent to-accent-soft" />
              <span className="text-lg font-semibold text-neutral-900">Admin</span>
            </Link>
            <div className="hidden gap-4 md:flex">
              {adminNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-accent-soft/30 text-accent'
                        : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900',
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="outline" size="sm">
                View site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2 border-b border-neutral-200 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-500">Content workspace</p>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-semibold text-neutral-900">Create, publish, and measure</h1>
              <p className="text-sm text-neutral-500">Keep your editorial calendar aligned with product momentum.</p>
            </div>
            {user ? (
              <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-xs text-neutral-500">
                <p className="font-semibold text-neutral-700">Signed in as</p>
                <p className="truncate text-neutral-700">{user.name}</p>
                <p className="truncate">{user.email}</p>
              </div>
            ) : null}
          </div>
        </header>

        <div className="pb-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

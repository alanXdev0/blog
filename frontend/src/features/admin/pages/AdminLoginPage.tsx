import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { useAuth } from '@/context/AuthContext';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname ?? '/admin/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await login({ email, password });
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      console.error(error);
      setErrorMessage('Unable to sign in with those credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="flex min-h-[calc(100vh-200px)] items-center justify-center py-24">
      <div className="w-full max-w-md rounded-3xl border border-neutral-200/80 bg-white p-10 shadow-subtle/40">
        <div className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Admin</p>
          <h1 className="text-2xl font-semibold text-neutral-950">Sign in to your workspace</h1>
          <p className="text-sm text-neutral-600">Enter your admin credentials to manage posts and projects.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@alananaya.dev"
              required
              className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="********"
              required
              className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400"
            />
          </div>
          {errorMessage ? <p className="text-xs text-red-500">{errorMessage}</p> : null}
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default AdminLoginPage;

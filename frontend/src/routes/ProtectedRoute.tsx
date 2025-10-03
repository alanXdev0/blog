import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  redirectTo?: string;
}

export const ProtectedRoute = ({ redirectTo = '/admin/login' }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

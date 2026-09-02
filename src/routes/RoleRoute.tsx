import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/auth';

type RoleRouteProps = {
  roles: UserRole[];
};

function RoleRoute({ roles }: RoleRouteProps) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/posts" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;

import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout/AppLayout';
import HomePage from '@/pages/HomePage/HomePage';
import LoginPage from '@/pages/LoginPage/LoginPage';
import NewPostPage from '@/pages/NewPostPage/NewPostPage';
import PostsPage from '@/pages/PostsPage/PostsPage';
import RegisterPage from '@/pages/RegisterPage/RegisterPage';
import UsersPage from '@/pages/UsersPage/UsersPage';
import GuestRoute from '@/routes/GuestRoute';
import ProtectedRoute from '@/routes/ProtectedRoute';
import RoleRoute from '@/routes/RoleRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostsPage />} />

          <Route element={<RoleRoute roles={['ADMIN']} />}>
            <Route path="/posts/new" element={<NewPostPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;

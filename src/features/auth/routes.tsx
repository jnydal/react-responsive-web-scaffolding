import { RouteObject } from 'react-router-dom';
import { AuthLayout } from '../../layouts/auth-layout';
import { LoginPage } from './pages/login-page';

export const LOGIN_ROUTE = '/login';

export const authRoutes: RouteObject[] = [
  {
    path: LOGIN_ROUTE,
    element: (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
  },
];


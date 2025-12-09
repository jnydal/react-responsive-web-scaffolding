import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { authRoutes } from '../features/auth/routes';

const routes: RouteObject[] = [
  ...authRoutes,
  {
    path: '/',
    element: <div>Home (placeholder)</div>,
  },
];

export const router = createBrowserRouter(routes);


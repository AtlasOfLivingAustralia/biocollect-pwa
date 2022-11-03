import { useRef } from 'react';
import { Text } from '@mantine/core';
import {
  RouterProvider,
  RouteObject,
  redirect,
  createBrowserRouter,
} from 'react-router-dom';

// App views
import { Home, SignIn, Debug } from 'views';
import Layout from 'layout';

const children: RouteObject[] = [
  {
    path: '',
    element: <Home />,
  },
];

if (import.meta.env.DEV) {
  children.push({
    path: '/debug',
    element: <Debug />,
  });
}

interface RoutesProps {
  isAuthenticated: boolean;
}

export default function Routes({ isAuthenticated }: RoutesProps) {
  const router = useRef<ReturnType<typeof createBrowserRouter>>(
    createBrowserRouter([
      {
        path: '/',
        element: <Layout />,
        errorElement: <Text>404 yall</Text>,
        loader: () => (isAuthenticated ? null : redirect('/signin')),
        children,
      },
      {
        path: '/signin',
        element: <SignIn />,
        loader: () => (isAuthenticated ? redirect('/') : null),
      },
    ])
  );

  return <RouterProvider router={router.current} />;
}

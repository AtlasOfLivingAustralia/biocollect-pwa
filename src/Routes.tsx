import { Text } from '@mantine/core';
import {
  RouterProvider,
  RouteObject,
  createBrowserRouter,
} from 'react-router-dom';

// App views
import { Home, Debug } from 'views';
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <Text>404 yall</Text>,
    children,
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}

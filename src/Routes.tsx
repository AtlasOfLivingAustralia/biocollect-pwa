import { Text } from '@mantine/core';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// App views
import { Home } from 'views';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: 'test',
    element: <Text>testing route</Text>,
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}

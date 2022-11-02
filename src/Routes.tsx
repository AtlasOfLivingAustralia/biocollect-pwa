import { Text } from '@mantine/core';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Text>MODE: {import.meta.env.MODE}!</Text>,
  },
  {
    path: 'test',
    element: <Text>testing route</Text>,
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}

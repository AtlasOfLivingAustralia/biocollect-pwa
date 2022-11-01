import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>MODE: {import.meta.env.MODE}!</div>,
  },
  {
    path: 'test',
    element: <div>testing route</div>,
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}

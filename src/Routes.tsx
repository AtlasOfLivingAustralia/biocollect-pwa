import { useContext, useRef } from 'react';
import { Text } from '@mantine/core';
import {
  RouterProvider,
  redirect,
  createBrowserRouter,
} from 'react-router-dom';

// App views
import { Home, Project, SignIn, Debug } from 'views';
import Logger from 'helpers/logger';
import Layout from 'layout';
import { APIContext } from 'helpers/api';

interface RoutesProps {
  isAuthenticated: boolean;
}

const isDev = import.meta.env.DEV;

export default function Routes({ isAuthenticated }: RoutesProps) {
  const api = useContext(APIContext);
  Logger.log(`[Routes] isAuthenticated = ${isAuthenticated}`);

  const router = useRef<ReturnType<typeof createBrowserRouter>>(
    createBrowserRouter([
      {
        path: '/',
        element: <Layout />,
        errorElement: <Text>404 yall</Text>,
        loader: () => (isAuthenticated ? null : redirect('/signin')),
        children: [
          {
            path: '',
            element: <Home />,
          },
          {
            path: 'project/:projectId',
            element: <Project />,
            loader: ({ params }) => {
              return api.biocollect.listSurveys(params.projectId || '');
            },
          },
          ...(isDev
            ? [
                {
                  path: '/debug',
                  element: <Debug />,
                },
              ]
            : []),
        ],
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

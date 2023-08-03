import { useContext, useRef } from 'react';
import { Text } from '@mantine/core';
import {
  RouterProvider,
  redirect,
  createBrowserRouter,
} from 'react-router-dom';

// App views
import { Home, Project, SignIn, Error, Debug } from 'views';
import { useAuth } from 'react-oidc-context';
import { APIContext } from 'helpers/api';
import Layout from 'layout';

const isDev = import.meta.env.DEV;

export default function Routes() {
  const { isAuthenticated } = useAuth();
  const api = useContext(APIContext);

  const router = useRef<ReturnType<typeof createBrowserRouter>>(
    createBrowserRouter([
      {
        path: '/',
        element: <Layout />,
        errorElement: <Error />,
        loader: () => (isAuthenticated ? null : redirect('/signin')),
        children: [
          {
            path: '',
            element: <Home />,
          },
          {
            path: 'project/:projectId',
            element: <Project />,
            loader: async ({ params, ...rest }) => {
              const [project, surveys] = await Promise.all([
                api.biocollect.getProject(params.projectId || ''),
                api.biocollect.listSurveys(params.projectId || ''),
              ]);
              return { project, surveys };
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

import { useContext, useRef } from 'react';
import {
  RouterProvider,
  redirect,
  createBrowserRouter,
  defer,
} from 'react-router-dom';

// App views
import { Home, Project, SignIn, Error, Debug, Welcome } from 'views';
import { useAuth } from 'react-oidc-context';
import { APIContext } from 'helpers/api';
import Layout from 'layout';

const isDev = import.meta.env.DEV;

export default function Routes() {
  const auth = useAuth();
  const api = useContext(APIContext);
  const isInitialRouteProject = useRef(
    window.location.pathname.startsWith('/project/')
  );

  const router = useRef<ReturnType<typeof createBrowserRouter>>(
    createBrowserRouter([
      {
        path: '/',
        element: <Layout />,
        errorElement: <Error />,
        loader: () => {
          if (auth.isAuthenticated) {
            // If we haven't seen the welcome screen yet, show it
            if (!Boolean(localStorage.getItem('pwa-welcome')))
              return redirect('/welcome');

            // Otherwise, stay on the home route
            return null;
          }

          return redirect('/signin');
        },
        children: [
          {
            path: '',
            element: <Home />,
          },
          {
            path: 'project/:projectId',
            element: <Project />,
            loader: async ({ params, ...rest }) => {
              const initialProject = isInitialRouteProject.current;
              if (isInitialRouteProject.current)
                isInitialRouteProject.current = false;

              // Create an array of requests to send
              const requests = [
                api.biocollect.getProject(params.projectId || ''),
                api.biocollect.listSurveys(params.projectId || ''),
              ];

              // Defer based on whether the initial route is the project route
              return defer({
                data: initialProject
                  ? Promise.all(requests)
                  : await Promise.all(requests),
              });
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
        path: '/welcome',
        element: <Welcome />,
      },
      {
        path: '/signin',
        element: <SignIn />,
        loader: () => (auth.isAuthenticated ? redirect('/') : null),
      },
    ])
  );

  return <RouterProvider router={router.current} />;
}

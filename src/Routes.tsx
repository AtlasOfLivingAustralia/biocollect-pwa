import { useRef } from 'react';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router';
import { jwtDecode } from 'jwt-decode';

// Helpers
import { Debug, ErrorView, Home, Project, SignIn, Welcome } from '#/views';
import { userManager } from '#/helpers/auth';
import { biocollect } from '#/helpers/api';

// Layout component
import Layout from '#/layout';

const isDev = import.meta.env.DEV;

export default function Routes() {
  const isInitialRouteProject = useRef(window.location.pathname.startsWith('/project/'));

  const router = useRef<ReturnType<typeof createBrowserRouter>>(
    createBrowserRouter(
      [
        {
          path: '/',
          element: <Layout />,
          errorElement: <ErrorView />,
          loader: async () => {
            const user = await userManager.getUser();
            if (user) {
              // If we haven't seen the welcome screen yet, show it
              if (!localStorage.getItem('pwa-welcome')) return redirect('/welcome');

              // Otherwise, stay on the home route
              return null;
            }

            return redirect('/signin');
          },
          children: [
            {
              path: '',
              loader: async () => {
                const user = await userManager.getUser();
                if (user) {
                  // If the given_name is supplied, return that
                  if (user.profile.given_name) {
                    return user.profile.given_name;
                  }

                  // If not, decode the access token & get it from that
                  const decoded = jwtDecode(user.access_token);
                  return (decoded as { given_name: string } | null)?.given_name || 'User';
                }

                return redirect('/signin');
              },
              element: <Home />,
            },
            {
              path: 'project/:projectId',
              element: <Project />,
              loader: async ({ params }) => {
                const pid = params.projectId || '';
                const initialProject = isInitialRouteProject.current;
                if (isInitialRouteProject.current) isInitialRouteProject.current = false;

                // Fetch the project first
                const project = await biocollect.getProject(pid);
                const userIsProjectMember = project?.userIsProjectMember === true;

                // Then fetch surveys using the member flag
                const surveys = await biocollect.listSurveys(pid, userIsProjectMember);

                return {
                  data: initialProject ? Promise.all([project, surveys]) : [project, surveys],
                };
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
          loader: async () => {
            const user = await userManager.getUser();
            if (user) return redirect('/')
          },
        },
      ],
      {
        basename: '/mobile-app',
      },
    ),
  );

  return <RouterProvider router={router.current} />;
}

import { useContext, useState, useEffect } from 'react';
import {
  Grid,
  Center,
  Box,
  Text,
  Title,
  Group,
  Stack,
  Pagination,
  useMantineTheme,
} from '@mantine/core';
import { IconArchive } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

// Helper functions / components
import { APIContext } from 'helpers/api';
import { getBool, getNumber, getString } from 'helpers/params';

// Local components
import { ProjectItem } from './components/ProjectItem';
import { BioCollectProjectSearch } from 'types';
import { useMediaQuery } from '@mantine/hooks';
import { Wave } from 'components/Wave';
import { SearchControls } from './components/SearchControls';
import { useOnLine } from 'helpers/funcs';

const range = (max: number) => (max > 0 ? [...Array(max).keys()] : []);

export function Home() {
  const onLine = useOnLine();

  // URL parameters & state
  const [params, setParams] = useSearchParams();
  const paramMax = getNumber('max', 30, params);
  const paramPage = getNumber('page', 1, params);
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const highlight =
    theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2];

  // API data state
  const [projectSearch, setProjectSearch] =
    useState<BioCollectProjectSearch | null>(null);
  const [lastTotal, setLastTotal] = useState<number>(30);

  // API Context
  const auth = useAuth();
  const api = useContext(APIContext);

  // Effect hook to fetch project data
  useEffect(() => {
    async function fetchProjects() {
      setProjectSearch(null);
      try {
        const paramMax = getNumber('max', 30, params);
        const data = await api.biocollect.projectSearch(
          (getNumber('page', 1, params) - 1) * paramMax,
          paramMax,
          getString('pSort', 'dateCreatedSort', params),
          getBool('isUserPage', false, params),
          getString('search', undefined, params),
          getBool('offline', !onLine, params)
        );
        setProjectSearch(data);
        setLastTotal(data.total);
      } catch (error) {
        // TODO: Error handling
        console.error(error);
      }
    }

    fetchProjects();
  }, [params, onLine]);

  // Handle for updating the pagination
  const handleChangePage = (page: number) => {
    params.set('page', page.toString());
    setParams(params);
  };

  return (
    <>
      {mobile ? (
        <Stack py="xl" px={mobile ? 22 : 36}>
          <Group position={mobile ? 'center' : 'apart'}>
            <Stack spacing={0} align={mobile ? 'center' : 'flex-start'}>
              <Text color="dimmed">Welcome back,</Text>
              <Title m={0}>{auth.user?.profile.given_name}</Title>
            </Stack>
          </Group>
          <SearchControls params={params} setParams={setParams} />
        </Stack>
      ) : (
        <Box py="xl" px={mobile ? 22 : 36}>
          <Group position={mobile ? 'center' : 'apart'}>
            <Stack spacing={0} align={mobile ? 'center' : 'flex-start'}>
              <Text color="dimmed">Welcome back,</Text>
              <Title m={0}>{auth.user?.profile.given_name}</Title>
            </Stack>
            <SearchControls params={params} setParams={setParams} />
          </Group>
        </Box>
      )}
      <Wave
        preserveAspectRatio="none"
        waveColour={highlight}
        waveType={mobile ? 'body' : 'bodyFull'}
        height={75}
        width="100%"
      />
      <Box
        sx={(theme) => ({
          background: highlight,
          marginTop: -8,
          padding: 32,
          paddingTop: 0,
          [theme.fn.smallerThan('md')]: {
            padding: 22,
            paddingTop: 0,
          },
        })}
      >
        <Grid>
          {(() => {
            if (projectSearch) {
              return projectSearch.total > 0 ? (
                projectSearch.projects.map((project) => (
                  <ProjectItem key={project.projectId} project={project} />
                ))
              ) : (
                <Grid.Col span={12}>
                  <Stack align="center" spacing={8}>
                    <IconArchive size="4rem" />
                    <Text
                      mt="md"
                      sx={(theme) => ({
                        fontFamily: theme.headings.fontFamily,
                      })}
                      size="xl"
                    >
                      No projects found
                    </Text>
                    <Text color="dimmed">
                      Try refining your search criteria
                    </Text>
                  </Stack>
                </Grid.Col>
              );
            }

            return range(paramMax).map((id) => (
              <ProjectItem key={id} project={null} />
            ));
          })()}
        </Grid>
      </Box>
      <Wave
        preserveAspectRatio="none"
        waveColour={highlight}
        waveType={mobile ? 'bodyBottom' : 'bodyBottomFull'}
        height={75}
        width="100%"
      />
      {lastTotal !== null && (
        <Center pb="xl">
          <Pagination
            mb="md"
            value={paramPage}
            total={Math.floor(lastTotal / paramMax)}
            onChange={handleChangePage}
          />
        </Center>
      )}
    </>
  );
}

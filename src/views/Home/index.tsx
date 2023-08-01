import { useContext, useState, useEffect } from 'react';
import {
  Grid,
  Center,
  TextInput,
  Box,
  Text,
  Title,
  Group,
  Stack,
  Select,
  Pagination,
  Checkbox,
  Paper,
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { IconSearch } from '@tabler/icons';
import { useAuth } from 'react-oidc-context';

// Helper functions / components
import { APIContext } from 'helpers/api';
import { getBool, getNumber, getString } from 'helpers/params';

import Logger from 'helpers/logger';

// Local components
import { ProjectItem } from './components/ProjectItem';
import { BioCollectProjectSearch } from 'types';
import { useDebouncedState } from '@mantine/hooks';

const range = (max: number) => (max > 0 ? [...Array(max).keys()] : []);

export function Home() {
  // URL parameters & state
  const [params, setParams] = useSearchParams();
  const paramMax = getNumber('max', 30, params);
  const paramPage = getNumber('page', 1, params);
  const paramSearch = getString('search', undefined, params);
  const paramOffline = getBool('offline', true, params);

  // API data state
  const [projectSearch, setProjectSearch] =
    useState<BioCollectProjectSearch | null>(null);
  const [lastTotal, setLastTotal] = useState<number>(30);
  const [searchQuery, setSearchQuery] = useDebouncedState('', 350);

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
          paramOffline
        );
        setProjectSearch(data);
        setLastTotal(data.total);
      } catch (error) {
        // TODO: Error handling
        Logger.error(error);
      }
    }

    fetchProjects();
  }, [params]);

  // Handle for updating the max result count
  const handleChangeMax = (newMax: number) => {
    params.set('page', '1');
    params.set('max', newMax.toString());
    setParams(params);
  };

  // Handle for updating the pagination
  const handleChangePage = (page: number) => {
    params.set('page', page.toString());
    setParams(params);
  };

  // Handle for updating the sort parameter
  const handleChangeSort = (pSort: string) => {
    setParams({ ...params, pSort });
  };

  // Handle for updating the sort parameter
  const handleChangeOffline = (offline: boolean) => {
    params.set('offline', offline.toString());
    setParams(params);
  };

  // Handling search querying
  useEffect(() => {
    if (searchQuery !== null && searchQuery.length > 0) {
      params.delete('page');
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }

    setParams(params);
  }, [searchQuery]);

  return (
    <Box
      sx={(theme) => ({
        padding: 32,
        [theme.fn.smallerThan('md')]: {
          padding: 22,
        },
      })}
    >
      <Group mb="lg">
        <Stack spacing={0}>
          <Text color="dimmed">Welcome,</Text>
          <Title m={0}>{auth.user?.profile.given_name}</Title>
        </Stack>
      </Group>
      <Box
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
          },
        })}
        mb="lg"
      >
        <TextInput
          sx={(theme) => ({
            flexGrow: 1,
            maxWidth: 300,
            marginRight: theme.spacing.xs,
            [theme.fn.smallerThan('xs')]: {
              width: '100%',
              maxWidth: '100%',
              marginBottom: theme.spacing.sm,
              marginRight: 0,
            },
          })}
          icon={<IconSearch />}
          placeholder="Project Name"
          defaultValue={paramSearch}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          label={
            <Text size="xs" weight="bold" color="dimmed">
              Project Search
            </Text>
          }
        />
        <Group
          sx={(theme) => ({
            [theme.fn.smallerThan('xs')]: {
              width: '100%',
            },
          })}
          spacing="xs"
          align="flex-end"
        >
          {navigator.onLine ? (
            <Select
              w={140}
              style={{ flexGrow: 1 }}
              value={params.get('pSort') || 'dateCreatedSort'}
              label={
                <Text size="xs" weight="bold" color="dimmed">
                  Sort By
                </Text>
              }
              data={[
                { value: 'dateCreatedSort', label: 'Most Recent' },
                { value: 'nameSort', label: 'Name' },
                { value: '_score', label: 'Relevance' },
                { value: 'organisationSort', label: 'Organisation' },
              ]}
              onChange={(sort) => handleChangeSort(sort || 'dateCreatedSort')}
            />
          ) : (
            <Paper py={7} px="xs" w={150} style={{ flexGrow: 1 }} withBorder>
              <Checkbox
                label="Offline Surveys"
                checked={paramOffline}
                onClick={(e) => handleChangeOffline(!paramOffline)}
              />
            </Paper>
          )}
          <Select
            w={140}
            style={{ flexGrow: 1 }}
            value={params.get('max') || '30'}
            data={['10', '20', '30', '50'].map((max) => ({
              value: max,
              label: `${max} items`,
            }))}
            onChange={(max) => handleChangeMax(parseInt(max || '20', 10))}
            label={
              <Text size="xs" weight="bold" color="dimmed">
                Result Count
              </Text>
            }
          />
        </Group>
      </Box>
      <Grid>
        {(() => {
          if (projectSearch) {
            return projectSearch.total > 0 ? (
              projectSearch.projects.map((project) => (
                <ProjectItem key={project.projectId} project={project} />
              ))
            ) : (
              <Text>No projects</Text>
            );
          }

          return range(paramMax).map((id) => (
            <ProjectItem key={id} project={null} />
          ));
        })()}
      </Grid>
      {lastTotal !== null && (
        <Center mt="xl">
          <Pagination
            value={paramPage}
            total={Math.floor(lastTotal / paramMax)}
            onChange={handleChangePage}
          />
        </Center>
      )}
    </Box>
  );
}

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
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { IconSearch } from '@tabler/icons';
import { useAuth } from 'react-oidc-context';

// Helper functions / components
import { APIContext } from 'helpers/api';
import { getBool, getNumber, getString } from 'helpers/params';

import Logger from 'helpers/logger';

// Local components
import { ProjectListItem } from './components/ProjectListItem';
import { BioCollectProjectSearch } from 'types';

const range = (max: number) => (max > 0 ? [...Array(max).keys()] : []);

export function Home() {
  const [projectSearch, setProjectSearch] =
    useState<BioCollectProjectSearch | null>(null);
  const [lastTotal, setLastTotal] = useState<number>(30);
  const [params, setParams] = useSearchParams();

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
          getString('search', undefined, params)
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

  const paramMax = getNumber('max', 30, params);
  const paramPage = getNumber('page', 1, params);

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

  // Handle for updating the search parameter
  const handleSearch = (query: string) => {
    if (query !== null && query.length > 0) {
      params.set('search', query);
    } else {
      params.delete('search');
    }

    setParams(params);
  };

  // Handle for updating the sort parameter
  // const handleChangeSort = (newSort: string) => {
  //   setParams({ ...params, pSort: newSort });
  // };

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
          <Title m={0}>Welcome, {auth.user?.profile.given_name}</Title>
          <Text>This is the home page</Text>
        </Stack>
      </Group>
      <Group position="apart" mb="lg">
        <Group mt="auto">
          <TextInput
            radius="md"
            icon={<IconSearch />}
            placeholder="Search Projects"
            onKeyDown={(e) => {
              console.log('search', e.currentTarget.value);
              if (e.key === 'Enter') handleSearch(e.currentTarget.value);
            }}
          />
        </Group>
        <Group spacing="xs">
          {/* <Select
            style={{ maxWidth: 130 }}
            value={params.get('pSort') || 'dateCreatedSort'}
            label="Sort By"
            data={[
              { value: 'dateCreatedSort', label: 'Most Recent' },
              { value: 'nameSort', label: 'Name' },
              { value: '_score', label: 'Relevance' },
              { value: 'organisationSort', label: 'Organisation' },
            ]}
            onChange={(sort) => handleChangeSort(sort || 'dateCreatedSort')}
          /> */}
          <Select
            radius="md"
            style={{ maxWidth: 110 }}
            value={params.get('max') || '30'}
            data={['10', '20', '30', '50', '100'].map((max) => ({
              value: max,
              label: `${max} items`,
            }))}
            onChange={(max) => handleChangeMax(parseInt(max || '20', 10))}
          />
        </Group>
      </Group>
      <Grid>
        {(() => {
          if (projectSearch) {
            return projectSearch.total > 0 ? (
              projectSearch.projects.map((project) => (
                <ProjectListItem key={project.projectId} project={project} />
              ))
            ) : (
              <Text>No projects</Text>
            );
          }

          return range(paramMax).map((id) => (
            <ProjectListItem key={id} project={null} />
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

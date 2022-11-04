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
  SegmentedControl,
  MediaQuery,
  Pagination,
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { IconSearch, IconLayoutGrid, IconListDetails } from '@tabler/icons';
import { useAuth } from 'react-oidc-context';

// Helper functions / components
import { APIContext } from 'helpers/api';
import { getBool, getNumber, getString } from 'helpers/params';

// Local components
import ProjectCard from './components/ProjectCard';
import { BioCollectProjectSearch } from 'types';

const range = (max: number) => (max > 0 ? [...Array(max).keys()] : []);

export default function Home() {
  const [projectSearch, setProjectSearch] =
    useState<BioCollectProjectSearch | null>(null);
  const [params, setParams] = useSearchParams();

  // API Context
  const auth = useAuth();
  const api = useContext(APIContext);

  // Effect hook to fetch project data
  useEffect(() => {
    async function fetchProjects() {
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
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchProjects();
  }, [params]);

  const paramMax = getNumber('max', 30, params);
  const paramPage = getNumber('page', 1, params);

  // Handle for updating the max result count
  const handleChangeMax = (newMax: number) => {
    const newParams: { [key: string]: string } = {
      ...Object.fromEntries(params.entries()),
      max: newMax.toString(),
    };

    // Ensure our page value is also updated
    if (params.get('page') && projectSearch) {
      newParams.page = Math.min(
        paramPage,
        Math.floor(projectSearch.total / newMax)
      ).toString();
    }

    setParams(newParams);

    // Update the project search data to immediately reflect the changes
    // if the max result count has been decreased
    if (newMax < paramMax && projectSearch) {
      setProjectSearch({
        ...projectSearch,
        projects: projectSearch.projects.slice(0, newMax),
      });
    }
  };

  // Handle for updating the pagination
  const handleChangePage = (page: number) => {
    setProjectSearch(null);
    setParams({
      ...Object.fromEntries(params.entries()),
      page: page.toString(),
    });
  };

  // Handle for updating the sort parameter
  // const handleChangeSort = (newSort: string) => {
  //   setProjectSearch(null);
  //   setParams({ ...params, pSort: newSort });
  // };

  return (
    <Box p="xl">
      <Group mb="lg">
        <Stack spacing={0}>
          <Title m={0}>Welcome, {auth.user?.profile.given_name}</Title>
          <Text>This is the home page</Text>
        </Stack>
      </Group>
      <Group position="apart" mb="lg">
        <Group mt="auto">
          <TextInput icon={<IconSearch />} placeholder="Search Projects" />
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
          <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            <SegmentedControl
              data={[
                {
                  value: 'gridView',
                  label: (
                    <Center>
                      <IconLayoutGrid size={18} />
                    </Center>
                  ),
                },
                {
                  value: 'listView',
                  label: (
                    <Center>
                      <IconListDetails size={18} />
                    </Center>
                  ),
                },
              ]}
            />
          </MediaQuery>
          <Select
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
        {projectSearch &&
          projectSearch.projects.map((project) => (
            <ProjectCard key={project.projectId} project={project} />
          ))}
        {range(paramMax - (projectSearch?.projects.length || 0)).map((id) => (
          <ProjectCard key={id} project={null} />
        ))}
      </Grid>
      <Center mt="xl">
        <Pagination
          disabled={!Boolean(projectSearch)}
          total={
            projectSearch
              ? Math.floor(projectSearch.total / projectSearch.projects.length)
              : 0
          }
          onChange={handleChangePage}
        />
      </Center>
    </Box>
  );
}

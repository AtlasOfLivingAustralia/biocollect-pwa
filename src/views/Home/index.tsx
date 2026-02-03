import { Wave } from '#/components/Wave';
import {
  Box,
  Center,
  Grid,
  Pagination,
  Space,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconArchive } from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';

// Helper functions / components
import { biocollect } from '#/helpers/api';
import type { BioCollectProjectSearch } from '#/types';

// Local components
import { dexie } from '#/helpers/api/dexie';
import { useLiveQuery } from 'dexie-react-hooks';
import { useLoaderData } from 'react-router';
import { ProjectItem } from './components/ProjectItem';
import { DEFAULTS, SearchControls, type SearchState } from './components/SearchControls';
import classes from './index.module.css';

const range = (max: number) => (max > 0 ? [...new Array(max).keys()] : []);

type SurveyDownloads = { [project: string]: { [survey: string]: true } };

function HomeLoading({ max }: { max: number }) {
  return range(max).map((id) => <ProjectItem key={id} project={null} />)
}

function areProjectsDifferent(old: BioCollectProjectSearch | null, updated: BioCollectProjectSearch) {
  // If the reference is the same, nothing changed
  if (old === updated) return false;

  // Going from null -> data is a change
  if (old === null) return true;

  // If the totals differ, it's definitely changed
  if (old.total !== updated.total) return true;

  // Compare projectId lists in a robust way
  const oldIds = old.projects.map(({ projectId }) => projectId);
  const updatedIds = updated.projects.map(({ projectId }) => projectId);

  if (oldIds.length !== updatedIds.length) return true;

  oldIds.sort();
  updatedIds.sort();

  for (let i = 0; i < oldIds.length; i++) {
    if (oldIds[i] !== updatedIds[i]) return true;
  }

  return false;
}

const waveColour = 'light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-6))';

export function Home() {
  const givenName = useLoaderData<string>();
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  // API data state
  const [projectSearch, setProjectSearch] = useState<BioCollectProjectSearch | null>(null);
  const [page, setPage] = useState<number>(1)
  const [searchState, setSearchState] = useState<SearchState>(DEFAULTS);
  const lastTotal = useRef<number>(null);

  // Watch for changes to the downloaded surveys
  const downloadedSurveys = useLiveQuery<SurveyDownloads>(async () => (await dexie.cached.toArray()).reduce((prev, cur) => ({
    ...prev, [cur.projectId]: {
      ...((prev as SurveyDownloads)[cur.projectId] || {}),
      [cur.surveyId]: true
    }
  }), {}));

  const fetch = useCallback(async () => {
    if (projectSearch !== null) setProjectSearch(null);

    try {
      const data = await biocollect.projectSearch(
        (page - 1) * searchState.max,
        searchState.max,
        searchState.sort,
        searchState.userPage,
        searchState.search,
        searchState.offline,
      );

      if (areProjectsDifferent(projectSearch, data)) {
        setProjectSearch(data);
      }

      // Update the last total ref
      lastTotal.current = data.total;
    } catch (error) {
      console.error(error);
    }
  }, [searchState, projectSearch, page])

  // Effect hook to fetch project data
  useEffect(() => { fetch() }, [searchState, page]);

  return (
    <>
      <div className={classes.header}>
        <Stack className={classes.name} gap={0}>
          <Text c='dimmed'>Welcome back,</Text>
          <Title m={0}>
            {givenName}
          </Title>
        </Stack>
        <SearchControls onUpdate={setSearchState} setPage={setPage} />
      </div>
      <Wave
        preserveAspectRatio='none'
        waveColour={waveColour}
        waveType={mobile ? 'body' : 'bodyFull'}
        height={75}
        width='100%'
      />
      <Box
        style={{
          background: waveColour,
          marginTop: -8,
          padding: mobile ? 22 : 32,
        }}
      >
        <Grid>
          {(projectSearch?.total || 0) > 0 && projectSearch?.projects.map((project) => (
            <ProjectItem key={project.projectId} project={project} downloaded={downloadedSurveys?.[project.projectId]} />
          ))}
          {projectSearch && projectSearch.total === 0 && ((<Grid.Col span={12}>
            <Stack align='center' gap={8}>
              <IconArchive size='4rem' />
              <Text mt='md' ff='heading' size='xl'>
                No projects found
              </Text>
              <Text c='dimmed'>Try refining your search criteria</Text>
            </Stack>
          </Grid.Col>))}
          {!projectSearch && <HomeLoading max={searchState.max} />}
        </Grid>
        <Space h={25} />
      </Box>
      <Wave
        preserveAspectRatio='none'
        waveColour={waveColour}
        waveType={mobile ? 'bodyBottom' : 'bodyBottomFull'}
        height={75}
        width='100%'
      />
      {lastTotal.current && (
        <Center pb='xl'>
          <Pagination
            mb='md'
            value={page}
            total={Math.floor(lastTotal.current / searchState.max)}
            onChange={setPage}
          />
        </Center>
      )}
    </>
  );
}

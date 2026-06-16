import {
  Alert,
  Drawer,
  Group,
  Paper,
  Stack,
  Tabs,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { type PropsWithChildren, type ReactElement, useState } from 'react';

// Helpers
import type { BioCollectBioActivityView, FilterQueries } from '#/types';

// Local components
import RecordsDrawerContext from './context';
import { PublishedRecords } from './components/PublishedRecords';
import { useUnpublished } from '../pwa';
import { UnpublishedRecords } from './components/UnpublishedRecords';
import { useOnLine } from '../funcs';
import { IconDatabaseExclamation } from '@tabler/icons-react';

const viewToHeader: { [key: string]: string } = {
  myrecords: 'My Records',
  project: 'Project',
  projectrecords: 'Project Records',
  myprojectrecords: 'My Records',
  userprojectactivityrecords: 'My Records',
  allrecords: 'Records',
  projectactivityrecords: 'Project Records',
};

const RecordsDrawerProvider = (props: PropsWithChildren): ReactElement => {
  const [recordsFor, setRecordsFor] = useState<string | null>(null);
  const [view, setView] = useState<BioCollectBioActivityView | null>(null);
  const [filters, setFilters] = useState<FilterQueries>({});
  const [opened, { open: openDrawer, close }] = useDisclosure(false);

  // Unpublished state helpers
  const [initialUnpublished, setInitialUnpublished] = useState<boolean>(false);

  const [publishedRefreshKey, setPublishedRefreshKey] = useState(0);

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const { refresh: refreshAllUnpublished, unpublishedMap } = useUnpublished({
    refreshOnMount: false,
  });
  const isOnline = useOnLine();

  const projectActivityId = filters.projectActivityId as string | undefined;
  const unpublishedCount = projectActivityId
    ? unpublishedMap.projectActivity[projectActivityId] || 0
    : 0;


  // Callback function to open the records drawer
  const open = async (
    newView: BioCollectBioActivityView,
    newFilters?: FilterQueries,
    newRecordsFor?: string,
    showUnpublished?: boolean,
  ) => {
    if (newView) setView(newView);
    if (newFilters) setFilters(newFilters);
    if (newRecordsFor) setRecordsFor(newRecordsFor);

    if (newFilters?.projectActivityId) {
      const newUnpublishedCount = newFilters?.projectActivityId
        ? unpublishedMap.projectActivity[newFilters?.projectActivityId as string] || 0
        : 0;

      setInitialUnpublished(showUnpublished || newUnpublishedCount > 0);
      await refreshAllUnpublished();
    }

    openDrawer();
  };

  const handleMutation = () => {
    setPublishedRefreshKey((current) => current + 1);
  };

  return (
    <RecordsDrawerContext.Provider value={{ open, close }}>
      <Drawer.Root opened={opened} onClose={close} position={mobile ? 'bottom' : 'right'}>
        <Drawer.Overlay
          blur={3}
          opacity={0.55}
          color='light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-6))'
        />
        <Drawer.Content>
          <Drawer.Header>
            <Group gap='md'>
              <Stack gap={0}>
                <Title order={3}>{viewToHeader[view || ''] || 'Records'}</Title>
                {recordsFor && (
                  <Text size='sm' c='dimmed'>
                    For {recordsFor}
                  </Text>
                )}
              </Stack>
            </Group>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body mt='xs'>
            {unpublishedCount > 0 && (
              <Alert
                mb='xs'
                color='yellow'
                icon={<IconDatabaseExclamation />}
                title={`${unpublishedCount} unpublished record${unpublishedCount > 1 ? 's' : ''}`}
                p='xs'
              >
                These are currently <b>saved only on your device</b>, please upload them when
                completed
              </Alert>
            )}
            <Tabs
              defaultValue={!isOnline || initialUnpublished ? 'unpublished' : 'published'}
              variant='pills'
            >
              <Paper withBorder mb='sm' p={4} radius='xl' shadow='md'>
                <Tabs.List grow>
                  <Tabs.Tab
                    id='unpublishedTab'
                    value='unpublished'
                  >
                    Unpublished
                  </Tabs.Tab>
                  <Tabs.Tab id='publishedTab' value='published' disabled={!isOnline}>
                    Published
                  </Tabs.Tab>
                </Tabs.List>
              </Paper>
              <Tabs.Panel value='unpublished'>
                <UnpublishedRecords view={view} filters={filters} onMutation={handleMutation} />
              </Tabs.Panel>
              <Tabs.Panel value='published'>
                <PublishedRecords
                  publishedRefreshKey={publishedRefreshKey}
                  view={view}
                  filters={filters}
                />
              </Tabs.Panel>
            </Tabs>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
      {props.children}
    </RecordsDrawerContext.Provider>
  );
};

export default RecordsDrawerProvider;

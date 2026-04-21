import { Drawer, Group, Paper, Stack, Tabs, Text, Title, useMantineTheme } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { type PropsWithChildren, type ReactElement, useState } from 'react';

// Helpers
import type { BioCollectBioActivityView, FilterQueries } from '#/types';

// Local components
import RecordsDrawerContext from './context';
import { PublishedRecords } from './components/PublishedRecords';
import { usePWA } from '../pwa';
import { UnpublishedRecords } from './components/UnpublishedRecords';
import type { OfflineProjectActivities } from '../pwa/context';
import { useOnLine } from '../funcs';

const RecordsDrawerProvider = (props: PropsWithChildren): ReactElement => {
  const PAGE_SIZE = 20;

  const [recordsFor, setRecordsFor] = useState<string | null>(null);
  const [view, setView] = useState<BioCollectBioActivityView | null>(null);
  const [filters, setFilters] = useState<FilterQueries>({});
  const [opened, { open: openDrawer, close }] = useDisclosure(false);

  const [unpublished, setUnpublished] = useState<OfflineProjectActivities | null>(null);
  const [unpublishedError, setUnpublishedError] = useState<string | null>(null);
  const [publishedRefreshKey, setPublishedRefreshKey] = useState(0);

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const pwa = usePWA();
  const isOnline = useOnLine();

  // Callback function to open the records drawer
  const open = async (
    newView: BioCollectBioActivityView,
    newFilters?: FilterQueries,
    newRecordsFor?: string,
  ) => {
    if (newView) setView(newView);
    if (newFilters) setFilters(newFilters);
    if (newRecordsFor) setRecordsFor(newRecordsFor);

    if (newFilters?.projectActivityId) {
      try {
        const fetched = await pwa.getOfflineProjectActivityActivities(
          newFilters.projectActivityId as string,
          PAGE_SIZE,
          0,
        );
        setUnpublished(fetched);
        setUnpublishedError(null);
      } catch (error) {
        setUnpublished({ activities: [], total: 0 });
        setUnpublishedError(
          error instanceof Error ? error.message : 'Failed to load unpublished records.',
        );
      }
    } else {
      setUnpublished({ activities: [], total: 0 });
      setUnpublishedError(null);
    }

    openDrawer();
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
                <Title order={3}>Records</Title>
                {recordsFor && (
                  <Text size='sm' c='dimmed'>
                    For {recordsFor}
                  </Text>
                )}
              </Stack>
            </Group>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body mt='lg'>
            <Tabs
              defaultValue={
                !isOnline || (unpublished?.total || 0) > 0 ? 'unpublished' : 'published'
              }
              variant='pills'
            >
              <Paper withBorder mb='sm' p={4} radius='xl' shadow='md'>
                <Tabs.List grow>
                  <Tabs.Tab value='unpublished'>Unpublished</Tabs.Tab>
                  <Tabs.Tab value='published' disabled={!isOnline}>
                    Published
                  </Tabs.Tab>
                </Tabs.List>
              </Paper>
              <Tabs.Panel value='unpublished'>
                <UnpublishedRecords
                  initialActivities={unpublished}
                  initialError={unpublishedError}
                  view={view}
                  filters={filters}
                  onPublishedMutation={() => setPublishedRefreshKey((current) => current + 1)}
                />
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

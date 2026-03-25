import {
  ActionIcon,
  Button,
  Center,
  Divider,
  Drawer,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { shallowEqual, useDebouncedValue, useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconExternalLink, IconFiles, IconSearch, IconX } from '@tabler/icons-react';
import {
  Fragment,
  type PropsWithChildren,
  type ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import { biocollect } from '#/helpers/api';

// Helpers
import { FrameContext } from '#/helpers/frame';
import type {
  BioCollectBioActivity,
  BioCollectBioActivitySearch,
  BioCollectBioActivityView,
  FilterQueries,
} from '#/types';
import { ActivityItem } from './components/ActivityItem';

// Local components
import RecordsDrawerContext from './context';

const RecordsDrawerProvider = (props: PropsWithChildren): ReactElement => {
  const [recordsFor, setRecordsFor] = useState<string | null>(null);
  const [view, setView] = useState<BioCollectBioActivityView | null>(null);
  const [filters, setFilters] = useState<FilterQueries>({});
  const [opened, { open: openDrawer, close }] = useDisclosure(false);
  const [search, setSearch] = useState<BioCollectBioActivitySearch | null>(null);

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const frame = useContext(FrameContext);

  // search state hooks
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearchTerm] = useDebouncedValue(searchInput, 300);

  // paging/loading more hooks
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<BioCollectBioActivity[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Callback function to open the records drawer
  const open = (
    newView: BioCollectBioActivityView,
    newFilters?: FilterQueries,
    newRecordsFor?: string,
  ) => {
    if (newView) setView(newView);
    if (newFilters) setFilters(newFilters);
    if (newRecordsFor) setRecordsFor(newRecordsFor);

    // reset paging when the inputs change
    setPage(0);
    setItems([]);
    setHasMore(true);

    // reset the search input state
    setSearchInput('');

    // Equality check to reset UI state to loading
    if (view !== newView || !shallowEqual(filters, newFilters || {})) setSearch(null);

    openDrawer();
  };

  // load next page
  const loadMore = () => {
    if (!loadingMore && hasMore) setPage((p) => p + 1);
  };

  useEffect(() => {
    async function getActivities() {
      if (!view) return;

      setLoadingMore(true);

      const pagedFilters: FilterQueries = {
        ...(filters || {}),
        ...(debouncedSearchTerm ? { searchTerm: debouncedSearchTerm } : {}),
        offset: String(page * PAGE_SIZE),
        max: String(PAGE_SIZE),
        sort: 'dateCreatedSort',
      };

      const resp = await biocollect.searchActivities(view, pagedFilters);

      setSearch(resp);
      setItems((prev) => (page === 0 ? resp.activities : [...prev, ...resp.activities]));
      setHasMore(resp.activities.length === PAGE_SIZE);
      setLoadingMore(false);
    }

    getActivities();
  }, [view, filters, debouncedSearchTerm, page]);

  function clearSearch() {
    setSearchInput('');
    setPage(0);
    setItems([]);
    setHasMore(true);
  }

  return (
    <RecordsDrawerContext.Provider value={{ open, close }}>
      <Drawer.Root
        opened={opened}
        onClose={close}
        position={mobile ? 'bottom' : 'right'}
        keepMounted
      >
        <Drawer.Overlay
          blur={3}
          opacity={0.55}
          color='light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-6))'
        />
        <Drawer.Content>
          <Drawer.Header>
            <Group gap='md'>
              <IconFiles />
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
            <Stack pb='sm'>
              {filters.projectActivityId && (
                <Button
                  id={`${filters.projectActivityId}UnpublishedRecords`}
                  leftSection={<IconExternalLink size='1rem' />}
                  mb='xs'
                  variant='light'
                  onClick={() => {
                    close();
                    frame.open(
                      `${import.meta.env.VITE_API_BIOCOLLECT}/pwa/offlineList?projectActivityId=${filters.projectActivityId
                      }`,
                      'Unpublished Records',
                    );
                  }}
                >
                  View unpublished records
                </Button>
              )}
              <Text size='sm' tt='uppercase' c='dimmed' fw='bold'>
                Published
              </Text>
              <TextInput
                value={searchInput}
                onChange={(e) => setSearchInput(e.currentTarget.value)}
                placeholder='Search activities…'
                leftSection={<IconSearch size={16} />}
                rightSection={
                  (() => {
                    if (loadingMore) {
                      return <Loader size='xs' />
                    } else if (searchInput) {
                      return (
                        <ActionIcon
                          aria-label='Clear search'
                          onClick={clearSearch}
                          onMouseDown={(e) => e.preventDefault()}
                          variant='subtle'
                        >
                          <IconX size={16} />
                        </ActionIcon>
                      );
                    }
                    return null;
                  })()
                }
                rightSectionWidth={36}
                w='100%'
                mb='sm'
                aria-label='Search published activities'
              />

              {(() => {
                if (search) {
                  return items.length > 0 ? (
                    <>
                      {items.map((activity, index) => (
                        <Fragment key={activity.activityId}>
                          <ActivityItem activity={activity} />
                          {index + 1 < items.length && <Divider />}
                        </Fragment>
                      ))}

                      {hasMore && (
                        <Button
                          mt='md'
                          onClick={loadMore}
                          fullWidth
                          loading={loadingMore}
                          variant='light'
                        >
                          Load more
                        </Button>
                      )}
                    </>
                  ) : (
                    <Center h='100%'>
                      <Text c='dimmed'>No records found</Text>
                    </Center>
                  );
                }

                return [0, 1, 2, 3, 4, 5, 6].map((num) => (
                  <Fragment key={num}>
                    <ActivityItem />
                    {num !== 6 && <Divider />}
                  </Fragment>
                ));
              })()}
            </Stack>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
      {props.children}
    </RecordsDrawerContext.Provider>
  );
};

export default RecordsDrawerProvider;

import {
  ReactElement,
  PropsWithChildren,
  useEffect,
  useState,
  useContext,
  Fragment,
} from 'react';
import { shallowEqual, useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  BioCollectBioActivitySearch,
  BioCollectBioActivityView,
  FilterQueries,
  BioCollectBioActivity
} from 'types';

// Contexts
import RecordsDrawerContext from './context';
import {
  Button,
  Center,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { FrameContext } from 'helpers/frame';

import { IconExternalLink, IconFiles } from '@tabler/icons-react';
import { APIContext } from 'helpers/api';
import { ActivityItem } from './components/ActivityItem';

const RecordsDrawerProvider = (props: PropsWithChildren<{}>): ReactElement => {
  const [recordsFor, setRecordsFor] = useState<string | null>(null);
  const [view, setView] = useState<BioCollectBioActivityView | null>(null);
  const [filters, setFilters] = useState<FilterQueries>({});
  const [opened, { open: openDrawer, close }] = useDisclosure(false);
  const [search, setSearch] = useState<BioCollectBioActivitySearch | null>(
    null
  );

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const api = useContext(APIContext);
  const frame = useContext(FrameContext);

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
    newRecordsFor?: string
  ) => {
    if (newView) setView(newView);
    if (newFilters) setFilters(newFilters);
    if (newRecordsFor) setRecordsFor(newRecordsFor);

    // reset paging when the inputs change
    setPage(0);
    setItems([]);
    setHasMore(true);

    // Equality check to reset UI state to loading
    if (view !== newView || !shallowEqual(filters, newFilters || {}))
      setSearch(null);

    openDrawer();
  };

  // load next page
  const loadMore = () => {
    if (!loadingMore && hasMore) setPage(p => p + 1);
  };

  useEffect(() => {
  async function getActivities() {
    if (!view) return;

    setLoadingMore(true);

    const pagedFilters: FilterQueries = {
      ...(filters || {}),
      offset: String(page * PAGE_SIZE),
      max: String(PAGE_SIZE),
      sort: 'dateCreatedSort',
    };

    const resp = await api.biocollect.searchActivities(view, pagedFilters);

    setSearch(resp);

    setItems(prev =>
      page === 0 ? resp.activities : [...prev, ...resp.activities]
    );

    setHasMore(resp.activities.length === PAGE_SIZE);

    setLoadingMore(false);
  }

  getActivities();
}, [view, filters, page]);

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
          color={
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[2]
          }
        />
        <Drawer.Content>
          <Drawer.Header>
            <Group spacing="md">
              <IconFiles />
              <Stack spacing={0}>
                <Title order={3}>Records</Title>
                {recordsFor && (
                  <Text size="sm" color="dimmed">
                    For {recordsFor}
                  </Text>
                )}
              </Stack>
            </Group>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            <Stack pb="sm">
              {filters.projectActivityId && (
                <>
                  <Text
                    size="sm"
                    transform="uppercase"
                    color="dimmed"
                    weight="bold"
                  >
                    Unpublished
                  </Text>
                  <Button
                    id={`${filters.projectActivityId}UnpublishedRecords`}
                    leftIcon={<IconExternalLink size="1rem" />}
                    mb="xs"
                    variant="outline"
                    onClick={() => {
                      close();
                      frame.open(
                        `${
                          import.meta.env.VITE_API_BIOCOLLECT
                        }/pwa/offlineList?projectActivityId=${
                          filters.projectActivityId
                        }`,
                        'Unpublished Records'
                      );
                    }}
                  >
                    View unpublished records
                  </Button>
                </>
              )}
              <Text
                size="sm"
                transform="uppercase"
                color="dimmed"
                weight="bold"
              >
                Published
              </Text>
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
                          mt="md"
                          onClick={loadMore}
                          fullWidth
                          loading={loadingMore}
                          variant="light"
                        >
                          Load more
                        </Button>
                      )}
                    </>
                  ) : (
                    <Center h="100%">
                      <Text color="dimmed">No records found</Text>
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

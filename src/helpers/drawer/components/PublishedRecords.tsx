import { ActionIcon, Button, Center, Group, Loader, Stack, Text, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconRefresh, IconSearch, IconX } from '@tabler/icons-react';
import {
  Fragment,
  type PropsWithChildren,
  type ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { biocollect } from '#/helpers/api';

// Helpers
import type {
  BioCollectBioActivity,
  BioCollectBioActivitySearch,
  BioCollectBioActivityView,
  FilterQueries,
} from '#/types';
import { ActivityItem } from './ActivityItem';

export interface RecordsProps {
  view: BioCollectBioActivityView | null;
  filters: FilterQueries;
}

interface PublishedRecordsProps extends RecordsProps {
  publishedRefreshKey: number;
}

export const PublishedRecords = ({
  view,
  filters,
  publishedRefreshKey,
}: PropsWithChildren<PublishedRecordsProps>): ReactElement => {
  const [search, setSearch] = useState<BioCollectBioActivitySearch | null>(null);

  // search state hooks
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearchTerm] = useDebouncedValue(searchInput, 300);

  // paging/loading more hooks
  const PAGE_SIZE = 20;
  const [page, setPage] = useState<number>(0);
  const [items, setItems] = useState<BioCollectBioActivity[]>([]);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [refreshSwitch, setRefreshSwitch] = useState<boolean>(false);

  const refresh = useCallback(() => {
    setSearch(null);
    setItems([]);
    setPage(0);
    setRefreshSwitch((prevSwitch) => !prevSwitch);
  }, []);

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
  }, [view, filters, publishedRefreshKey, refreshSwitch, debouncedSearchTerm, page]);

  function clearSearch() {
    setSearchInput('');
    setPage(0);
    setItems([]);
    setHasMore(true);
  }

  const handleDelete = useCallback(
    (activityIdToDelete: string) => {
      setItems((prev) => prev.filter(({ activityId }) => activityId !== activityIdToDelete));
    },
    [setItems],
  );

  return (
    <Stack pb='sm'>
      <Group>
        <TextInput
          value={searchInput}
          onChange={(e) => setSearchInput(e.currentTarget.value)}
          placeholder='Search activities…'
          leftSection={<IconSearch size={16} />}
          rightSection={(() => {
            if (loadingMore) {
              return <Loader size='xs' />;
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
          })()}
          rightSectionWidth={36}
          aria-label='Search published activities'
          disabled={loadingMore || !search}
          style={{ flexGrow: 1 }}
        />
        <Button
          loading={loadingMore}
          variant='light'
          leftSection={<IconRefresh size='1rem' />}
          onClick={refresh}
        >
          Refresh
        </Button>
      </Group>

      {(() => {
        if (search) {
          return items.length > 0 ? (
            <>
              {items.map((activity) => (
                <ActivityItem
                  key={activity.activityId}
                  activity={activity}
                  onDelete={handleDelete}
                />
              ))}

              {hasMore && (
                <Button mt='md' onClick={loadMore} fullWidth loading={loadingMore} variant='light'>
                  Load more
                </Button>
              )}
            </>
          ) : (
            <Center h='100%' py='xl'>
              <Text c='dimmed'>No published records found</Text>
            </Center>
          );
        }

        return [0, 1, 2, 3, 4, 5, 6].map((num) => (
          <Fragment key={num}>
            <ActivityItem />
          </Fragment>
        ));
      })()}
    </Stack>
  );
};

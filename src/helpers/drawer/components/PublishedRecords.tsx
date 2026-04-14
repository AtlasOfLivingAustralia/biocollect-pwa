import { ActionIcon, Button, Center, Loader, Stack, Text, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconX } from '@tabler/icons-react';
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

export const PublishedRecords = ({
  view,
  filters,
}: PropsWithChildren<RecordsProps>): ReactElement => {
  const [search, setSearch] = useState<BioCollectBioActivitySearch | null>(null);

  // search state hooks
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearchTerm] = useDebouncedValue(searchInput, 300);

  // paging/loading more hooks
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<BioCollectBioActivity[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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

  const handleDelete = useCallback(
    (activityIdToDelete: string) => {
      setItems((prev) => prev.filter(({ activityId }) => activityId !== activityIdToDelete));
    },
    [setItems],
  );

  return (
    <Stack pb='sm'>
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
        w='100%'
        aria-label='Search published activities'
      />

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
            <Center h='100%'>
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

import {
  Checkbox,
  Grid,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useOnLine } from '#/helpers/funcs';
import { isEqual } from 'lodash-es';

import classes from './SearchControls.module.css';

export interface SearchState {
  max: number;
  sort: string;
  userPage: boolean;
  search: string;
  offline: boolean;
}

export const DEFAULTS: SearchState = {
  max: 10,
  sort: 'dateCreatedSort',
  userPage: true,
  search: '',
  offline: false
}

interface SearchControlsProps {
  onUpdate: (state: SearchState) => void;
  setPage: (page: number) => void;
}

export function SearchControls({ onUpdate, setPage }: SearchControlsProps) {
  const onLine = useOnLine();

  const [max, setMax] = useState<number>(DEFAULTS.max);
  const [sort, setSort] = useState<string>(DEFAULTS.sort);
  const [userPage] = useState<boolean>(DEFAULTS.userPage);
  const [offline, setOffline] = useState<boolean>(DEFAULTS.offline);
  const lastState = useRef<SearchState>(DEFAULTS);

  // Search state
  const [search, setSearch] = useDebouncedState<string>(DEFAULTS.search, 350);
  const lastSearch = useRef<string>(DEFAULTS.search);

  useEffect(() => {
    const update: SearchState = {
      max,
      sort,
      userPage,
      search,
      offline,
    };

    // Don't update if the state is the same
    if (isEqual(update, lastState.current)) return;

    onUpdate(update);

    if (lastSearch.current !== search) {
      lastSearch.current = search;
      setPage(1);
    }

    lastState.current = update;
  }, [max, sort, userPage, search, offline]);


  // Update the offline flag when our connectivity changes
  useEffect(() => {
    setOffline(!onLine);
  }, [onLine]);

  return (
    <Grid className={classes.controls}>
      <Grid.Col span={{ xs: 12, md: onLine ? 6 : 4 }}>
        <TextInput
          leftSection={<IconSearch />}
          placeholder='Project Name'
          defaultValue={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          label={
            <Text size='xs' fw='bold' c='dimmed'>
              Project Search
            </Text>
          }
        />
      </Grid.Col>
      {onLine && (
        <Grid.Col span={{ xs: 12, md: 6 }}>
          <Select
            value={sort}
            label={
              <Text size='xs' fw='bold' c='dimmed'>
                Sort By
              </Text>
            }
            data={[
              { value: 'dateCreatedSort', label: 'Most Recent' },
              { value: 'nameSort', label: 'Name' },
              { value: '_score', label: 'Relevance' },
              { value: 'organisationSort', label: 'Organisation' },
            ]}
            onChange={(sort) => setSort(sort || 'dateCreatedSort')}
          />
        </Grid.Col>
      )}
      <Grid.Col span={{ xs: 12, md: onLine ? 6 : 4 }}>
        <Select
          value={max.toString()}
          data={['10', '20', '30', '50'].map((maxOption) => ({
            value: maxOption,
            label: `${maxOption} items`,
          }))}
          onChange={(max) => setMax(parseInt(max || '10', 10))}
          label={
            <Text size='xs' fw='bold' c='dimmed'>
              Result Count
            </Text>
          }
        />
      </Grid.Col>
      <Grid.Col span={{ xs: 12, md: onLine ? 6 : 4 }}>
        <Stack justify='flex-end' h='100%'>
          <Paper py={7} px='xs' withBorder>
            <Checkbox
              label='Downloaded'
              checked={offline}
              onChange={() => setOffline(!offline)}
            />
          </Paper>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}

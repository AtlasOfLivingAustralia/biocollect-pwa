import { useEffect } from 'react';
import {
  TextInput,
  Box,
  Text,
  Group,
  Select,
  Checkbox,
  Paper,
  BoxProps,
  useMantineTheme,
  Grid,
  Stack,
} from '@mantine/core';
import { SetURLSearchParams } from 'react-router-dom';
import { IconSearch } from '@tabler/icons';

// Helper functions / components
import { getBool, getString } from 'helpers/params';

// Local components
import { useDebouncedState, useMediaQuery } from '@mantine/hooks';
import { useOnLine } from 'helpers/funcs';

interface SearchControlsProps extends BoxProps {
  params: URLSearchParams;
  setParams: SetURLSearchParams;
}

export function SearchControls({
  params,
  setParams,
  ...rest
}: SearchControlsProps) {
  const onLine = useOnLine();
  const paramSearch = getString('search', undefined, params);
  const paramOffline = getBool('offline', !onLine, params);

  // Styling hooks
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  // API data state
  const [searchQuery, setSearchQuery] = useDebouncedState('', 350);

  // Handle for updating the max result count
  const handleChangeMax = (newMax: number) => {
    params.set('page', '1');
    params.set('max', newMax.toString());
    setParams(params);
  };

  // Handle for updating the sort parameter
  const handleChangeSort = (pSort: string) => {
    setParams({ ...params, pSort });
  };

  // Handle for updating the sort parameter
  const handleChangeOffline = (offline: boolean) => {
    params.set('offline', offline.toString());
    setParams(params);
  };

  // Handling search querying
  useEffect(() => {
    if (searchQuery !== null && searchQuery.length > 0) {
      params.delete('page');
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }

    setParams(params);
  }, [searchQuery]);

  return mobile ? (
    <Grid>
      <Grid.Col span={12}>
        <TextInput
          icon={<IconSearch />}
          placeholder="Project Name"
          defaultValue={paramSearch}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          label={
            <Text size="xs" weight="bold" color="dimmed">
              Project Search
            </Text>
          }
        />
      </Grid.Col>
      {onLine && (
        <Grid.Col xs={6} sm={4}>
          <Select
            value={params.get('pSort') || 'dateCreatedSort'}
            label={
              <Text size="xs" weight="bold" color="dimmed">
                Sort By
              </Text>
            }
            data={[
              { value: 'dateCreatedSort', label: 'Most Recent' },
              { value: 'nameSort', label: 'Name' },
              { value: '_score', label: 'Relevance' },
              { value: 'organisationSort', label: 'Organisation' },
            ]}
            onChange={(sort) => handleChangeSort(sort || 'dateCreatedSort')}
          />
        </Grid.Col>
      )}
      <Grid.Col xs={6} sm={onLine ? 4 : 6}>
        <Select
          value={params.get('max') || '30'}
          data={['10', '20', '30', '50'].map((max) => ({
            value: max,
            label: `${max} items`,
          }))}
          onChange={(max) => handleChangeMax(parseInt(max || '20', 10))}
          label={
            <Text size="xs" weight="bold" color="dimmed">
              Result Count
            </Text>
          }
        />
      </Grid.Col>
      <Grid.Col xs={onLine ? 12 : 6} sm={onLine ? 4 : 6}>
        <Stack justify="flex-end" h="100%">
          <Paper py={7} px="xs" withBorder>
            <Checkbox
              label="Offline Surveys"
              checked={paramOffline}
              onChange={(e) => handleChangeOffline(!paramOffline)}
            />
          </Paper>
        </Stack>
      </Grid.Col>
    </Grid>
  ) : (
    <Grid>
      <Grid.Col span={5}>
        <TextInput
          icon={<IconSearch />}
          placeholder="Project Name"
          defaultValue={paramSearch}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          label={
            <Text size="xs" weight="bold" color="dimmed">
              Project Search
            </Text>
          }
        />
      </Grid.Col>
      {onLine && (
        <Grid.Col span={2}>
          <Select
            value={params.get('pSort') || 'dateCreatedSort'}
            label={
              <Text size="xs" weight="bold" color="dimmed">
                Sort By
              </Text>
            }
            data={[
              { value: 'dateCreatedSort', label: 'Most Recent' },
              { value: 'nameSort', label: 'Name' },
              { value: '_score', label: 'Relevance' },
              { value: 'organisationSort', label: 'Organisation' },
            ]}
            onChange={(sort) => handleChangeSort(sort || 'dateCreatedSort')}
          />
        </Grid.Col>
      )}
      <Grid.Col span={2}>
        <Select
          value={params.get('max') || '30'}
          data={['10', '20', '30', '50'].map((max) => ({
            value: max,
            label: `${max} items`,
          }))}
          onChange={(max) => handleChangeMax(parseInt(max || '20', 10))}
          label={
            <Text size="xs" weight="bold" color="dimmed">
              Result Count
            </Text>
          }
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <Stack justify="flex-end" h="100%">
          <Paper py={7} px="xs" withBorder>
            <Checkbox
              label="Offline Surveys"
              checked={paramOffline}
              onChange={(e) => handleChangeOffline(!paramOffline)}
            />
          </Paper>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}

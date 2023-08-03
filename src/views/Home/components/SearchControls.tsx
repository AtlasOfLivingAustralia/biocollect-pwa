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
} from '@mantine/core';
import { SetURLSearchParams } from 'react-router-dom';
import { IconSearch } from '@tabler/icons';

// Helper functions / components
import { getBool, getString } from 'helpers/params';

// Local components
import { useDebouncedState } from '@mantine/hooks';

interface SearchControlsProps extends BoxProps {
  params: URLSearchParams;
  setParams: SetURLSearchParams;
}

export function SearchControls({
  params,
  setParams,
  ...rest
}: SearchControlsProps) {
  // URL parameters & state
  const paramSearch = getString('search', undefined, params);
  const paramOffline = getBool('offline', true, params);

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

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        [theme.fn.smallerThan('xs')]: {
          flexDirection: 'column',
          alignItems: 'flex-start',
        },
      })}
      {...rest}
    >
      <TextInput
        sx={(theme) => ({
          flexGrow: 1,
          maxWidth: 300,
          marginRight: theme.spacing.xs,
          [theme.fn.smallerThan('xs')]: {
            width: '100%',
            maxWidth: '100%',
            marginBottom: theme.spacing.sm,
            marginRight: 0,
          },
        })}
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
      <Group
        sx={(theme) => ({
          [theme.fn.smallerThan('xs')]: {
            width: '100%',
          },
        })}
        spacing="xs"
        align="flex-end"
      >
        {navigator.onLine ? (
          <Select
            w={140}
            style={{ flexGrow: 1 }}
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
        ) : (
          <Paper py={7} px="xs" w={150} style={{ flexGrow: 1 }} withBorder>
            <Checkbox
              label="Offline Surveys"
              checked={paramOffline}
              onClick={(e) => handleChangeOffline(!paramOffline)}
            />
          </Paper>
        )}
        <Select
          w={140}
          style={{ flexGrow: 1 }}
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
      </Group>
    </Box>
  );
}

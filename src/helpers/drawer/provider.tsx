import {
  ReactElement,
  PropsWithChildren,
  useEffect,
  useState,
  useContext,
  Fragment,
} from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  BioCollectBioActivitySearch,
  BioCollectBioActivityView,
  FilterQueries,
} from 'types';

// Contexts
import RecordsDrawerContext from './context';
import {
  Center,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconFiles } from '@tabler/icons';
import { APIContext } from 'helpers/api';
import { ActivityItem } from './components/ActivityItem';

function shallowEqual(obj1: any, obj2: any) {
  const k1 = Object.keys(obj1);
  const k2 = Object.keys(obj2);

  if (k1.length !== k2.length) return false;
  for (let key of k1) {
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
}

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

  // Callback function to open the records drawer
  const open = (
    newView: BioCollectBioActivityView,
    newFilters?: FilterQueries,
    recordsFor?: string
  ) => {
    if (newView) setView(newView);
    if (newFilters) setFilters(newFilters);
    if (recordsFor) setRecordsFor(recordsFor);

    // Equality check to reset UI state to loading
    if (view !== newView || !shallowEqual(filters, newFilters || {}))
      setSearch(null);

    openDrawer();
  };

  useEffect(() => {
    async function getActivities() {
      if (view) {
        const data = await api.biocollect.searchActivities(view, filters);

        setTimeout(() => setSearch(data), 2000);
      }
    }

    if (view) getActivities();
  }, [view, filters]);

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
              {(() => {
                if (search) {
                  return search.activities.length > 0 ? (
                    search.activities.map((activity, index) => (
                      <Fragment key={activity.activityId}>
                        <ActivityItem activity={activity} />
                        {index + 1 < search.activities.length && <Divider />}
                      </Fragment>
                    ))
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

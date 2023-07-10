import {
  ReactElement,
  PropsWithChildren,
  useEffect,
  useState,
  useContext,
} from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  BioCollectBioActivitySearch,
  BioCollectBioActivityView,
  FilterQueries,
} from 'types';

// Contexts
import RecordsDrawerContext from './context';
import { Drawer, Group, Title } from '@mantine/core';
import { IconFiles } from '@tabler/icons';
import { APIContext } from 'helpers/api';

const RecordsDrawerProvider = (props: PropsWithChildren<{}>): ReactElement => {
  const [activities, setActivities] =
    useState<BioCollectBioActivitySearch | null>(null);
  const [view, setView] = useState<BioCollectBioActivityView | null>(null);
  const [filters, setFilters] = useState<FilterQueries>({});
  const [opened, { open: openDrawer, close }] = useDisclosure(false);
  const api = useContext(APIContext);

  // Callback function to open the records drawer
  const open = (
    newView: BioCollectBioActivityView,
    newFilters?: FilterQueries
  ) => {
    if (newView) setView(newView);
    if (newFilters) setFilters(newFilters);
    openDrawer();
  };

  useEffect(() => {
    async function getActivities() {
      if (view) {
        const activities = await api.biocollect.searchActivities(view, filters);
        console.log('activities', activities);
        setActivities(activities);
      }
    }

    if (view) getActivities();
  }, [view, filters]);

  return (
    <RecordsDrawerContext.Provider value={{ open, close }}>
      <Drawer.Root
        opened={opened}
        onClose={close}
        position="bottom"
        keepMounted
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Group spacing="md">
              <IconFiles />
              <Drawer.Title>
                <Title order={3}>Records</Title>
              </Drawer.Title>
            </Group>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            {activities ? activities.activities.length : 'Loading'}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
      {props.children}
    </RecordsDrawerContext.Provider>
  );
};

export default RecordsDrawerProvider;

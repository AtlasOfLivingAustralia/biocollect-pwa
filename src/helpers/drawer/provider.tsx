import {
  Alert,
  Drawer,
  Group,
  Stack,
  Tabs,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { type PropsWithChildren, type ReactElement, useState } from 'react';

// Helpers
import type { BioCollectSurvey } from '#/types';

// Local components
import RecordsDrawerContext from './context';
import { PublishedRecords } from './components/PublishedRecords';
import { useUnpublished } from '../pwa';
import { UnpublishedRecords } from './components/UnpublishedRecords';
import { useOnLine } from '../funcs';
import { IconDatabaseExclamation } from '@tabler/icons-react';

const RecordsDrawerProvider = (props: PropsWithChildren): ReactElement => {
  const [survey, setSurvey] = useState<BioCollectSurvey | null>(null);
  const [opened, { open: openDrawer, close }] = useDisclosure(false);
  const [initialUnpublished, setInitialUnpublished] = useState<boolean>(false);
  const [publishedRefreshKey, setPublishedRefreshKey] = useState(0);

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const { refresh: refreshAllUnpublished, unpublishedMap } = useUnpublished({
    refreshOnMount: false,
  });
  const isOnline = useOnLine();

  const projectActivityId = survey?.projectActivityId as string | undefined;
  const unpublishedCount = projectActivityId
    ? unpublishedMap.projectActivity[projectActivityId] || 0
    : 0;


  // Callback function to open the records drawer
  const open = async (
    newSurvey: BioCollectSurvey,
    showUnpublished?: boolean,
  ) => {
    setSurvey(newSurvey)

    const newUnpublishedCount = newSurvey.projectActivityId
      ? unpublishedMap.projectActivity[newSurvey.projectActivityId as string] || 0
      : 0;

    setInitialUnpublished(showUnpublished || newUnpublishedCount > 0);
    await refreshAllUnpublished();

    openDrawer();
  };

  const handleMutation = () => {
    setPublishedRefreshKey((current) => current + 1);
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
                {survey && (
                  <Text size='sm' c='dimmed'>
                    For {survey.name}
                  </Text>
                )}
              </Stack>
            </Group>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body mt='xs'>
            {unpublishedCount > 0 && (
              <Alert
                mb='xs'
                color='yellow'
                icon={<IconDatabaseExclamation />}
                title={`${unpublishedCount} unpublished record${unpublishedCount > 1 ? 's' : ''}`}
                p='xs'
              >
                These are currently <b>saved only on your device</b>, please upload them when
                completed
              </Alert>
            )}
            {survey && (<Tabs
              defaultValue={!isOnline || initialUnpublished ? 'unpublished' : 'published'}
              radius={0}
            >
              <Tabs.List mb='sm' mx={-16} grow>
                <Tabs.Tab
                  id='unpublishedTab'
                  value='unpublished'
                >
                  Unpublished
                </Tabs.Tab>
                <Tabs.Tab id='publishedTab' value='published' disabled={!isOnline}>
                  Published
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value='unpublished'>
                <UnpublishedRecords survey={survey} onMutation={handleMutation} />
              </Tabs.Panel>
              <Tabs.Panel value='published'>
                <PublishedRecords
                  publishedRefreshKey={publishedRefreshKey}
                  survey={survey}
                />
              </Tabs.Panel>
            </Tabs>)}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
      {props.children}
    </RecordsDrawerContext.Provider>
  );
};

export default RecordsDrawerProvider;

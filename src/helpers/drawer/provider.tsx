import { ReactElement, PropsWithChildren, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { BioCollectBioActivityView } from 'types';

// Contexts
import RecordsDrawerContext from './context';
import { Drawer, Group, Title } from '@mantine/core';
import { IconFiles } from '@tabler/icons';

const RecordsDrawerProvider = (props: PropsWithChildren<{}>): ReactElement => {
  const [opened, { open: openDrawer, close }] = useDisclosure(false);

  // Callback function to open the records drawer
  const open = (
    view: BioCollectBioActivityView,
    fq?: { [filter: string]: string },
    hub?: string
  ) => {
    console.log('Drawer open', view, fq, hub);
    openDrawer();
  };

  useEffect(() => {}, []);

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
          <Drawer.Body>Drawer content</Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
      {props.children}
    </RecordsDrawerContext.Provider>
  );
};

export default RecordsDrawerProvider;

import { ReactElement, PropsWithChildren, useState, useEffect } from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

// Contexts
import { Button, Group, Modal, Text, useMantineTheme } from '@mantine/core';
import { isFrame } from 'helpers/funcs';
import { Frame } from 'components';
import Logger from 'helpers/logger';
import FrameContext, { FrameCallbacks } from './context';

const FrameProvider = (props: PropsWithChildren<{}>): ReactElement => {
  const [title, setTitle] = useState<string | undefined>();
  const [src, setSrc] = useState<string>('');
  const [callbacks, setCallbacks] = useState<FrameCallbacks>();
  const [opened, { open: openFrame, close }] = useDisclosure(false);

  // Confirmation state
  const [canConfirm, setCanConfirm] = useState<boolean>(false);

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  useEffect(() => {
    if (callbacks?.confirm && !isFrame()) {
      // Define a message handler to listen for download events
      const messageHandler = (event: MessageEvent<string>) => {
        if (event.data === 'downloaded') {
          Logger.log('Recieved PWA downloaded event!');
          setCanConfirm(true);
        }
      };

      // Subscribe & setup unmount callback
      window.addEventListener('message', messageHandler);
      return () => window.removeEventListener('message', messageHandler);
    }
  }, [callbacks]);

  // Callback function to open the records drawer
  const open = (newSrc: string, title: string, callbacks?: FrameCallbacks) => {
    setSrc(newSrc);
    setTitle(title);

    // Update confirmation state
    setCallbacks(callbacks);
    setCanConfirm(false);

    openFrame();
  };

  return (
    <FrameContext.Provider value={{ open, close }}>
      <Modal
        fullScreen={mobile}
        opened={opened}
        onClose={close}
        title={
          <Text
            size="lg"
            sx={(theme) => ({ fontFamily: theme.headings.fontFamily })}
          >
            {title || 'BioCollect'}
          </Text>
        }
        size={1100}
        overlayProps={{
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
      >
        <Frame src={src} height={500} />
        {callbacks?.confirm && (
          <Group mt="sm" position="center" spacing="xs">
            <Button onClick={callbacks.confirm} loading={!canConfirm}>
              Confirm Download
            </Button>
            <Button onClick={close} color="gray">
              Cancel
            </Button>
          </Group>
        )}
      </Modal>
      {props.children}
    </FrameContext.Provider>
  );
};

export default FrameProvider;

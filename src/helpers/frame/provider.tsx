import {
  ReactElement,
  PropsWithChildren,
  useState,
  useEffect,
  useRef,
} from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

// Contexts
import { Button, Group, Modal, Text, useMantineTheme } from '@mantine/core';
import { isFrame } from 'helpers/funcs';
import { Frame } from 'components';
import FrameContext, { FrameCallbacks } from './context';
import { useAuth } from 'react-oidc-context';

interface FrameEvent {
  event: 'download-complete' | 'download-removed';
}

const FrameProvider = (props: PropsWithChildren<{}>): ReactElement => {
  const [title, setTitle] = useState<string | undefined>();
  const [src, setSrc] = useState<string>('');
  const [canConfirm, setCanConfirm] = useState<boolean>(false);
  const [callbacks, setCallbacks] = useState<FrameCallbacks>();
  const [opened, { open: openFrame, close }] = useDisclosure(false);

  // Refs & theming
  const frameRef = useRef<HTMLIFrameElement>(null);
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const auth = useAuth();

  useEffect(() => {
    if (callbacks?.confirm && !isFrame()) {
      // Define a message handler to listen for download events
      const messageHandler = (message: MessageEvent<FrameEvent>) => {
        const { data } = message;
        console.log('[iFrame Message]', message);
        if (data.event === 'download-complete') {
          setCanConfirm(true);
        } else if (data.event === 'download-removed') {
          setCanConfirm(false);
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

  // Callback function to pass user credentials when IFrame has loaded
  const handleLoad = () => {
    if (frameRef?.current?.contentWindow)
      frameRef.current.contentWindow.postMessage(
        {
          event: 'credentials',
          data: {
            userId: auth.user?.profile['custom:userid'],
            token: auth.user?.access_token,
          },
        },
        import.meta.env.VITE_API_BIOCOLLECT
      );
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
        zIndex={1000}
      >
        <Frame
          ref={frameRef}
          src={src}
          onLoad={handleLoad}
          allow="geolocation;"
        />
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

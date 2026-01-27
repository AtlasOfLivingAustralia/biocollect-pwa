import { Button, Group, Modal, Text, useMantineTheme } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { jwtDecode } from 'jwt-decode';
import {
  type PropsWithChildren,
  type ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAuth } from 'react-oidc-context';
import { Frame } from '#/components';
import { APIContext } from '#/helpers/api';
import { isFrame } from '#/helpers/funcs';

// Contexts
import FrameContext, { type FrameCallbacks } from './context';

interface FrameEvent {
  event: 'download-complete' | 'download-removed' | 'surveys-removed';
}

const FrameProvider = (props: PropsWithChildren): ReactElement => {
  const [title, setTitle] = useState<string | undefined>();
  const [src, setSrc] = useState<string | null>();
  const [canConfirm, setCanConfirm] = useState<boolean>(false);
  const [callbacks, setCallbacks] = useState<FrameCallbacks>();
  const [opened, { open: openFrame, close }] = useDisclosure(false);

  // Refs & theming
  const frameRef = useRef<HTMLIFrameElement>(null);
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const api = useContext(APIContext);
  const auth = useAuth();

  useEffect(() => {
    if (callbacks?.confirm && !isFrame()) {
      // Define a message handler to listen for download events
      const messageHandler = (message: MessageEvent<FrameEvent>) => {
        const { data } = message;
        if (message.data?.event) console.log('[iFrame Message]', message.data?.event);

        if (data.event === 'download-complete') {
          setCanConfirm(true);
        } else if (data.event === 'download-removed') {
          setCanConfirm(false);
        } else if (data.event === 'surveys-removed') {
          api.db.cached.clear();
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
    if (frameRef?.current?.contentWindow) {
      frameRef.current.contentWindow.postMessage(
        {
          event: 'credentials',
          data: {
            userId:
              auth.user?.profile['custom:userid'] ||
              (jwtDecode(auth?.user?.access_token || '') as { userid: number })?.userid,
            token: auth.user?.access_token,
          },
        },
        import.meta.env.VITE_API_BIOCOLLECT,
      );
    }
  };

  useEffect(handleLoad, [auth.user?.access_token]);

  return (
    <FrameContext.Provider value={{ open, close }}>
      <Modal
        fullScreen={mobile}
        opened={opened}
        onClose={() => {
          close();
          setTimeout(() => setSrc(null), 500);
        }}
        title={
          <Text size='lg' ff='heading'>
            {title || 'BioCollect'}
          </Text>
        }
        size={1100}
        overlayProps={{
          color: 'light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-6))',
          opacity: 0.55,
          blur: 3,
        }}
        zIndex={1000}
        styles={{ body: { paddingLeft: 0, paddingRight: 0 } }}
      >
        {src && (
          <>
            <Frame
              ref={frameRef}
              src={src}
              onLoad={handleLoad}
              allow='geolocation;'
              height={`calc(100vh - ${mobile ? 125 : 275}px)`}
            />
            {callbacks?.confirm && (
              <Group mt='sm' justify='center' gap='xs'>
                <Button id='confirmDownloadModal' onClick={callbacks.confirm} loading={!canConfirm}>
                  Confirm Download
                </Button>
                <Button onClick={close} color='gray'>
                  Cancel
                </Button>
              </Group>
            )}
          </>
        )}
      </Modal>
      {props.children}
    </FrameContext.Provider>
  );
};

export default FrameProvider;

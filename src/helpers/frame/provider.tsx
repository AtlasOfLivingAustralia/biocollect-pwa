import { Frame } from '#/components';
import { isFrame } from '#/helpers/funcs';
import { Button, Group, Modal, Text, useMantineTheme } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { jwtDecode } from 'jwt-decode';
import {
  type PropsWithChildren,
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

// Contexts
import { dexie } from '../api/dexie';
import { userManager } from '../auth';
import FrameContext, { type FrameCallbacks } from './context';
import { modals } from '@mantine/modals';

interface FrameEvent {
  event: 'download-complete' | 'download-removed' | 'surveys-removed';
}

const FrameProvider = (props: PropsWithChildren): ReactElement => {
  const [title, setTitle] = useState<string | undefined>();
  const [src, setSrc] = useState<string | null>();
  const [canConfirm, setCanConfirm] = useState<boolean | null>(null);
  const [opened, { open: openFrame, close: closeFrame }] = useDisclosure(false);
  const callbacks = useRef<FrameCallbacks>(null);

  // Refs & theming
  const frameRef = useRef<HTMLIFrameElement>(null);
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  useEffect(() => {
    if (!isFrame()) {
      // Define a message handler to listen for download events
      const messageHandler = (message: MessageEvent<FrameEvent>) => {
        const { data } = message;

        if (data.event === 'download-complete') {
          setCanConfirm(true);
        } else if (data.event === 'download-removed') {
          setCanConfirm(false);
        } else if (data.event === 'surveys-removed') {
          dexie.cached.clear();
        }
      };

      // Subscribe & setup unmount callback
      window.addEventListener('message', messageHandler);
      return () => window.removeEventListener('message', messageHandler);
    }
  }, [callbacks]);

  // Callback function to pass user credentials when IFrame has loaded
  const postToken = useCallback(async () => {
    if (frameRef?.current?.contentWindow) {
      const user = await userManager.getUser();

      frameRef.current.contentWindow.postMessage(
        {
          event: 'credentials',
          data: {
            userId:
              user?.profile['custom:userid'] ||
              (jwtDecode(user?.access_token || '') as { userid: number })?.userid,
            token: user?.access_token,
          },
        },
        import.meta.env.VITE_API_BIOCOLLECT,
      );

      console.log('Credentials posted!');
    }
  }, []);

  // Callback function to open the records drawer
  const open = useCallback((newSrc: string, newTitle: string, newCallbacks?: FrameCallbacks) => {
    setSrc(newSrc);
    setTitle(newTitle);

    // Update callbacks/confirmation state
    if (newCallbacks) {
      callbacks.current = newCallbacks;
      if (newCallbacks.confirm) {
        setCanConfirm(false);
      }
    }

    openFrame();
  }, []);

  const close = () => {
    modals.openConfirmModal({
      centered: true,
      title: (
        <Text size='lg' ff='heading'>
          Are you sure you want to close this dialog?
        </Text>
      ),
      children: <Text>Any unsaved data will be lost</Text>,
      labels: {
        confirm: 'Close',
        cancel: 'Cancel',
      },
      onConfirm: () => {
        // Trigger the close callback
        if (callbacks?.current?.close) {
          callbacks.current.close();
        }

        setSrc(null);
        setCanConfirm(null);
        callbacks.current = null;

        closeFrame();
      },
      zIndex: 2000,
    });
  };

  return (
    <FrameContext.Provider value={{ open, close }}>
      <Modal
        fullScreen={mobile}
        opened={opened}
        onClose={close}
        title={
          <Text size='lg' ff='heading' lineClamp={1}>
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
              allow='geolocation;'
              height={`calc(100vh - ${mobile ? 125 : 275}px)`}
              onLoad={postToken}
            />
            {canConfirm !== null && (
              <Group mt='sm' justify='center' gap='xs'>
                <Button
                  id='confirmDownloadModal'
                  onClick={callbacks.current?.confirm}
                  loading={!canConfirm}
                >
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

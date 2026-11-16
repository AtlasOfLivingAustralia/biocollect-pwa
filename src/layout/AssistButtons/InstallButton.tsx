import {
  Alert,
  Anchor,
  Button,
  Code,
  Flex,
  Group,
  Modal,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  IconBrandApple,
  IconBrandSafari,
  IconBrowser,
  IconDots,
  IconDownload,
  IconHandClick,
  IconMenu2,
  IconNewSection,
  IconPlus,
  IconPointer,
  IconShare2,
} from '@tabler/icons-react';
import { detect } from 'detect-browser';
import { pwaInstallHandler } from 'pwa-install-handler';
import { useEffect, useState } from 'react';

import { isPWAInstalled } from '#/helpers/funcs/isPWAInstalled';

export function InstallButton() {
  const [opened, { open, close }] = useDisclosure(false);
  const [canInstall, setCanInstall] = useState<boolean>(false);
  const [installing, setInstalling] = useState<boolean>(false);
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const browser = detect();
  // iPadOS Safari reports a desktop (Mac OS) user agent, so fall back to touch support
  const isIOS = browser?.os === 'iOS' || (browser?.os === 'Mac OS' && navigator.maxTouchPoints > 1);
  const isIOSChrome = isIOS && browser?.name === 'crios';
  const isIOSSupported =
    isIOSChrome || (isIOS && (browser?.name === 'ios' || browser?.name === 'safari'));
  let defaultTab = 'other';
  if (isIOS) defaultTab = 'ios';
  else if (browser?.name === 'safari') defaultTab = 'safari';

  useEffect(() => {
    const listener = (installable: boolean) => setCanInstall(installable);
    pwaInstallHandler.addListener(listener);
    return () => pwaInstallHandler.removeListener(listener);
  }, []);

  const onClick = async () => {
    if (canInstall) {
      setInstalling(true);
      try {
        await pwaInstallHandler.install();
      } finally {
        setInstalling(false);
      }
    } else {
      open();
    }
  };

  // Don't render the install button if the PWA has been installed
  if (isPWAInstalled()) return null;

  return (
    <>
      <Button
        loading={installing}
        onClick={onClick}
        size='compact-xs'
        variant='subtle'
        color='rust'
        leftSection={<IconDownload size='1rem' />}
      >
        {canInstall ? 'Install' : 'Instructions'}
      </Button>
      <Modal
        fullScreen={mobile}
        opened={opened}
        onClose={close}
        title={<Title order={2}>Install BioCollect</Title>}
        overlayProps={{
          color: 'light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-8))',
          opacity: 0.55,
          blur: 3,
        }}
        zIndex={1000}
        size='xl'
      >
        <Tabs defaultValue={defaultTab} mih={300}>
          <Tabs.List mb='md'>
            <Tabs.Tab value='ios' leftSection={<IconBrandApple size='0.9rem' />}>
              iOS
            </Tabs.Tab>
            <Tabs.Tab value='safari' leftSection={<IconBrandSafari size='0.9rem' />}>
              Safari Desktop
            </Tabs.Tab>
            <Tabs.Tab value='other' leftSection={<IconBrowser size='0.9rem' />}>
              Other
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='ios'>
            <Stack gap='sm'>
              {isIOS && !isIOSSupported ? (
                <Alert color='orange' title='Open this page in Safari or Chrome'>
                  Your current browser may not support installing BioCollect. Some iOS browsers,
                  such as <b>Microsoft Edge</b>, may not offer <b>Add to Home Screen</b>. Copy this
                  page&apos;s address into <b>Safari</b> or <b>Google Chrome</b>, then follow the
                  steps below.
                </Alert>
              ) : (
                <Alert>
                  Use <b>Safari</b> or <b>Google Chrome</b> to install BioCollect. Some other iOS
                  browsers, such as <b>Microsoft Edge</b>, may not offer <b>Add to Home Screen</b>.
                </Alert>
              )}
              <Flex gap='sm'>
                <ThemeIcon variant='light'>
                  <IconShare2 size='1rem' />
                </ThemeIcon>
                {isIOSChrome ? (
                  <Text>
                    Tap the&nbsp;
                    <ThemeIcon variant='subtle' size='sm'>
                      <IconShare2 size='1rem' />
                    </ThemeIcon>
                    &nbsp;<b>Share</b> button to the left of the address bar
                  </Text>
                ) : (
                  <Text>
                    <b>Safari:</b> tap the <b>Share</b> button in the toolbar. If you only see
                    the&nbsp;
                    <ThemeIcon variant='subtle' size='sm'>
                      <IconDots size='1rem' />
                    </ThemeIcon>
                    &nbsp;/&nbsp;
                    <ThemeIcon variant='subtle' size='sm'>
                      <IconMenu2 size='1rem' />
                    </ThemeIcon>
                    &nbsp;button, tap it first, then tap <b>Share</b>
                    <br />
                    <b>Chrome:</b> tap the&nbsp;
                    <ThemeIcon variant='subtle' size='sm'>
                      <IconShare2 size='1rem' />
                    </ThemeIcon>
                    &nbsp;<b>Share</b> button to the left of the address bar
                  </Text>
                )}
              </Flex>
              <Flex gap='sm'>
                <ThemeIcon variant='light'>
                  <IconNewSection size='1rem' />
                </ThemeIcon>
                <Text>
                  Scroll down and tap <b>Add to Home Screen</b> (tap <b>View More</b> if you
                  don&apos;t see it)
                </Text>
              </Flex>
              <Flex gap='sm'>
                <ThemeIcon variant='light'>
                  <IconHandClick size='1rem' />
                </ThemeIcon>
                <Text>
                  If shown, make sure <b>Open as Web App</b> is turned on, then tap <b>Add</b>
                </Text>
              </Flex>
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value='safari'>
            <Stack gap='sm'>
              <Alert>
                PWAs can be installed in <b>macOS 14 Sonoma (Safari 17)</b> and later.
              </Alert>
              <Group gap='sm'>
                <ThemeIcon variant='light'>
                  <IconPointer size='1rem' />
                </ThemeIcon>
                <Text>Click</Text>
                <Code>File &gt; Add to Dock</Code>
              </Group>
              <Group gap='sm'>
                <ThemeIcon variant='light'>
                  <IconPlus size='1rem' />
                </ThemeIcon>
                <Text>
                  Click <b>Add</b>
                </Text>
              </Group>
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value='other'>
            <Stack gap='sm'>
              <Alert>
                If BioCollect is already installed, your browser may show an <b>Open in app</b>{' '}
                button in the address bar.
              </Alert>
              <Flex gap='sm'>
                <ThemeIcon variant='light'>
                  <IconDownload size='1rem' />
                </ThemeIcon>
                <Text>
                  <b>Desktop:</b> click the install icon on the right of the address bar, or open
                  the browser menu and choose <b>Install BioCollect</b> (in Chrome, under{' '}
                  <b>Cast, save and share</b>; in Edge, under <b>Apps</b>)
                </Text>
              </Flex>
              <Flex gap='sm'>
                <ThemeIcon variant='light'>
                  <IconPlus size='1rem' />
                </ThemeIcon>
                <Text>
                  <b>Android:</b> open the browser menu and tap <b>Add to Home screen</b> or{' '}
                  <b>Install app</b>, then tap <b>Install</b>
                </Text>
              </Flex>
              <Text>
                If your browser doesn&apos;t offer an install option, please use{' '}
                <Anchor href='https://www.google.com/chrome/' target='_blank'>
                  Google Chrome
                </Anchor>{' '}
                or{' '}
                <Anchor href='https://www.microsoft.com/edge' target='_blank'>
                  Microsoft Edge
                </Anchor>{' '}
                to install BioCollect.
              </Text>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </>
  );
}

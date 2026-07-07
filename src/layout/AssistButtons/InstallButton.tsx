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
import { useDisclosure, useLocalStorage, useMediaQuery } from '@mantine/hooks';
import {
  IconBrandApple,
  IconBrandSafari,
  IconBrowser,
  IconDotsFilled,
  IconDownload,
  IconHandClick,
  IconNewSection,
  IconPlus,
  IconPointer,
  IconShare2,
  IconSwipeDown,
} from '@tabler/icons-react';
import { detect } from 'detect-browser';
import { useEffect, useState } from 'react';
import { pwaInstallHandler } from 'pwa-install-handler'

import { isPWAInstalled } from '#/helpers/funcs/isPWAInstalled';


export function InstallButton() {
  const [opened, { open, close }] = useDisclosure(false);
  const [canInstall, setCanInstall] = useState<boolean>(false);
  const [installing, setInstalling] = useState<boolean>(false);
  const [installed, setInstalled] = useLocalStorage<boolean | null>({
    key: 'pwa-installed',
    defaultValue: false,
  });
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const browser = detect();

  useEffect(() => {
    pwaInstallHandler.addListener((canInstallCallback) => {
      setCanInstall(canInstallCallback);
    });
  }, []);

  const onClick = async () => {
    if (canInstall) {
      setInstalling(true);
      const success = await pwaInstallHandler.install();

      if (success) {
        setInstalled(true);
      }

      setInstalling(false);
    } else {
      open();
    }
  };

  // Don't render the install button if the PWA has been installed
  if (installed || isPWAInstalled()) return null;

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
        <Tabs
          defaultValue={['ios', 'safari'].includes(browser?.name || '') ? browser?.name : 'other'}
          mih={300}
        >
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
              <Alert>
                On <b>iOS 16.3</b> and earlier, PWAs can only be installed with Safari.<br />
                On <b>iOS 16.4</b> and later, PWAs can be installed with the Share menu in Safari, Chrome, Edge and Firefox.
              </Alert>
              <Flex gap='sm'>
                <ThemeIcon variant='light'>
                  <IconSwipeDown size='1rem' />
                </ThemeIcon>
                <Text>
                  Swipe down on the page to reveal the&nbsp;
                  <ThemeIcon variant='subtle' size='sm'>
                    <IconDotsFilled size="1rem" />
                  </ThemeIcon>&nbsp;
                  button
                </Text>
              </Flex>
              <Flex gap='sm'>
                <ThemeIcon variant='light'>
                  <IconShare2 size='1rem' />
                </ThemeIcon>
                <Text>Tap <b>Share</b></Text>
              </Flex>
              <Flex gap='sm'>
                <ThemeIcon variant='light'>
                  <IconNewSection size='1rem' />
                </ThemeIcon>
                <Text>Swipe down, and tap <b>Add to Home Screen</b></Text>
              </Flex>
              <Flex gap='sm'>
                <ThemeIcon variant='light'>
                  <IconHandClick size='1rem' />
                </ThemeIcon>
                <Text>Tap <b>Add</b> in the top-right corner</Text>
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
                <Text>
                  Click
                </Text>
                <Code>File &gt; Add to Dock</Code>
              </Group>
              <Group gap='sm'>
                <ThemeIcon variant='light'>
                  <IconPlus size='1rem' />
                </ThemeIcon>
                <Text>Click <b>Add</b></Text>
              </Group>
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value='other'>
            <Text>
              Please use an alternative browser such as{' '}
              <Anchor href='https://www.google.com.au/intl/en_au/chrome/' target='_blank'>
                Google Chrome
              </Anchor>
              {' '}or{' '}
              <Anchor href='https://www.google.com.au/intl/en_au/chrome/' target='_blank'>
                Edge
              </Anchor>{' '}
              to install the BioCollect PWA.
            </Text>
          </Tabs.Panel>
        </Tabs>
      </Modal >
    </>
  );
}

import {
  Anchor,
  Button,
  List,
  Modal,
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
  IconDownload,
  IconHandClick,
  IconNewSection,
  IconQuestionMark,
  IconShare2,
} from '@tabler/icons-react';
import { detect } from 'detect-browser';
import { useEffect, useState } from 'react';

export function InstallButton() {
  const [opened, { open, close }] = useDisclosure(false);
  const [install, setInstall] = useState<Event | null>(null);
  const [installed, setInstalled] = useLocalStorage<boolean>({
    key: 'pwa-installed',
    defaultValue: false,
  });
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const browser = detect();

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      setInstall(event);
    });
  }, []);

  const onClick = async () => {
    if (install) {
      const { outcome } = await (install as any).prompt();
      if (outcome === 'accepted') setInstalled(true);
      return;
    }

    let url;

    if (!browser) {
      open();
      return;
    }

    // Redirect to different support URL based on browsers
    switch (browser?.name) {
      case 'chrome':
        if (browser.os === 'Android OS') {
          url =
            'https://support.google.com/chrome/answer/9658361?hl=en&co=GENIE.Platform%3DAndroid&oco=1';
        } else if (browser.os === 'iOS') {
          url =
            'https://support.google.com/chrome/answer/9658361?hl=en&co=GENIE.Platform%3DiOS&oco=1';
        } else {
          url =
            'https://support.google.com/chrome/answer/9658361?hl=en&co=GENIE.Platform%3DDesktop&oco=1';
        }
        break;
      case 'edge':
      case 'edge-ios':
      case 'edge-chromium':
        url =
          'https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/ux';
        break;
      case 'firefox':
        url =
          'https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing';
        break;
      case 'samsung':
        url =
          'https://developer.samsung.com/automation/progressive-web-app.html';
        break;
    }

    // Open a new tab with the support URL, otherwise show the instructions dialog
    if (url) {
      window.open(url, '_blank');
    } else open();
  };

  // Don't render the install button if the PWA has been installed
  if (installed) return null;

  return (
    <>
      <Button
        onClick={onClick}
        size="xs"
        variant="light"
        leftIcon={
          install ? (
            <IconDownload size="1rem" />
          ) : (
            <IconQuestionMark size="1rem" />
          )
        }
      >
        {install ? 'Install' : 'Installation Instructions'}
      </Button>
      <Modal
        fullScreen={mobile}
        opened={opened}
        onClose={close}
        title={<Title order={2}>Install BioCollect</Title>}
        overlayProps={{
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
        zIndex={1000}
        size="xl"
      >
        <Tabs
          defaultValue={
            ['ios', 'safari'].includes(browser?.name || '')
              ? browser?.name
              : 'other'
          }
          mih={300}
        >
          <Tabs.List mb="md">
            <Tabs.Tab value="ios" icon={<IconBrandApple size="0.9rem" />}>
              iOS
            </Tabs.Tab>
            <Tabs.Tab value="safari" icon={<IconBrandSafari size="0.9rem" />}>
              Safari Desktop
            </Tabs.Tab>
            <Tabs.Tab value="other" icon={<IconBrowser size="0.9rem" />}>
              Other
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="ios">
            <List spacing="xs">
              <List.Item
                icon={
                  <ThemeIcon variant="light">
                    <IconShare2 size="1rem" />
                  </ThemeIcon>
                }
              >
                Tap <b>Share</b>
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon variant="light">
                    <IconNewSection size="1rem" />
                  </ThemeIcon>
                }
              >
                Tap <b>Add to Home Screen</b>
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon variant="light">
                    <IconHandClick size="1rem" />
                  </ThemeIcon>
                }
              >
                Tap <b>Add</b> in the top-right corner
              </List.Item>
            </List>
          </Tabs.Panel>
          <Tabs.Panel value="safari">
            <Text>
              Progressive Web Applications (PWAs) cannot be installed using
              Safari. Please use an alternative browser such as{' '}
              <Anchor
                href="https://www.google.com.au/intl/en_au/chrome/"
                target="_blank"
              >
                Google Chrome
              </Anchor>
              ,{' '}
              <Anchor
                href="https://www.google.com.au/intl/en_au/chrome/"
                target="_blank"
              >
                Edge
              </Anchor>{' '}
              or{' '}
              <Anchor
                href="https://www.google.com.au/intl/en_au/chrome/"
                target="_blank"
              >
                Firefox
              </Anchor>
              .
            </Text>
          </Tabs.Panel>
          <Tabs.Panel value="other">
            <Text>
              Please use an alternative browser such as{' '}
              <Anchor
                href="https://www.google.com.au/intl/en_au/chrome/"
                target="_blank"
              >
                Google Chrome
              </Anchor>
              ,{' '}
              <Anchor
                href="https://www.google.com.au/intl/en_au/chrome/"
                target="_blank"
              >
                Edge
              </Anchor>{' '}
              or{' '}
              <Anchor
                href="https://www.google.com.au/intl/en_au/chrome/"
                target="_blank"
              >
                Firefox
              </Anchor>{' '}
              to install the BioCollect PWA.
            </Text>
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </>
  );
}

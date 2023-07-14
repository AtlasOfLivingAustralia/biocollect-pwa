import { ReactElement, PropsWithChildren, useState } from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

// Contexts
import { Modal, Text, useMantineTheme } from '@mantine/core';
import { Frame } from 'components';
import FrameContext from './context';

const RecordsDrawerProvider = (props: PropsWithChildren<{}>): ReactElement => {
  const [title, setTitle] = useState<string | undefined>();
  const [src, setSrc] = useState<string>('');
  const [opened, { open: openFrame, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  // Callback function to open the records drawer
  const open = (newSrc: string, title?: string) => {
    if (newSrc) {
      setSrc(newSrc);
      setTitle(title);
      openFrame();
    }
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
        size="xl"
        overlayProps={{
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
      >
        <Frame src={src} />
      </Modal>
      {props.children}
    </FrameContext.Provider>
  );
};

export default RecordsDrawerProvider;

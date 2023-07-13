import { ReactElement, PropsWithChildren, useState } from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

// Contexts
import { Modal, useMantineTheme } from '@mantine/core';
import { Frame } from 'components';
import FrameContext from './context';

const RecordsDrawerProvider = (props: PropsWithChildren<{}>): ReactElement => {
  const [src, setSrc] = useState<string>('');
  const [opened, { open: openFrame, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  // Callback function to open the records drawer
  const open = (newSrc: string) => {
    if (newSrc) {
      setSrc(newSrc);
      openFrame();
    }
  };

  return (
    <FrameContext.Provider value={{ open, close }}>
      <Modal
        fullScreen={mobile}
        opened={opened}
        onClose={close}
        title="Web Application"
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

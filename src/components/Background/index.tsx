import { PropsWithChildren } from 'react';
import { Box, BoxProps, useMantineTheme } from '@mantine/core';

import logoAlaBgLight from 'assets/logo-ala-background-light.png';
import logoAlaBgDark from 'assets/logo-ala-background-dark.png';
import { useMediaQuery } from '@mantine/hooks';

export function Background({ children, ...rest }: PropsWithChildren<BoxProps>) {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  return (
    <Box
      sx={{
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[2],
        backgroundImage: `url(${
          theme.colorScheme === 'light' ? logoAlaBgLight : logoAlaBgDark
        })`,
        backgroundRepeat: 'repeat',
        backgroundSize: 65,
        backgroundPosition: '-30px -30px',
        backgroundAttachment: mobile ? 'scroll' : 'fixed',
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}

import { PropsWithChildren } from 'react';
import {
  Box,
  BoxProps,
  MantineNumberSize,
  useMantineTheme,
} from '@mantine/core';

import logoAlaBgLight from '/assets/logo-ala-background-light.png';
import logoAlaBgDark from '/assets/logo-ala-background-dark.png';
import { useMediaQuery } from '@mantine/hooks';

interface BackgroundProps extends PropsWithChildren<BoxProps> {
  parallax?: boolean;
  radius?: MantineNumberSize;
}

export function Background({
  children,
  parallax = true,
  radius = 0,
  ...rest
}: BackgroundProps) {
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
        backgroundAttachment: !mobile && parallax ? 'fixed' : 'scroll',
        borderRadius:
          typeof radius === 'string' ? theme.radius[radius] : radius,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}

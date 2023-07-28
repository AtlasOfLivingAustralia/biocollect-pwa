import { PropsWithChildren } from 'react';
import {
  Box,
  BoxProps,
  MantineNumberSize,
  useMantineTheme,
} from '@mantine/core';

import logoLight from '/assets/logo-ala-background-light.png';
import logoLightTrans from '/assets/logo-ala-background-light-trans.png';
import logoDark from '/assets/logo-ala-background-dark.png';
import logoDarkTrans from '/assets/logo-ala-background-dark-trans.png';

import { useMediaQuery } from '@mantine/hooks';

interface BackgroundProps extends PropsWithChildren<BoxProps> {
  parallax?: boolean;
  semiTransparent?: boolean;
  radius?: MantineNumberSize;
}

export function Background({
  children,
  parallax = true,
  semiTransparent = false,
  radius = 0,
  ...rest
}: BackgroundProps) {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  const logoAlaBg =
    theme.colorScheme === 'light'
      ? semiTransparent
        ? logoLightTrans
        : logoLight
      : semiTransparent
      ? logoDarkTrans
      : logoDark;

  return (
    <Box
      sx={{
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[2],
        backgroundImage: `url(${logoAlaBg})`,
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

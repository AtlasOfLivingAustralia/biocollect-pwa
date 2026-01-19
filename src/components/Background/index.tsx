import type { PropsWithChildren } from 'react';
import {
  Box,
  type BoxProps,
  useComputedColorScheme,
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
}

export function Background({
  style,
  children,
  parallax = true,
  semiTransparent = false,
  ...rest
}: BackgroundProps) {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const isDark = useComputedColorScheme() === 'dark';

  // Determine which background image variant to use
  let logoAlaBg: string;
  if (!isDark) {
    logoAlaBg = semiTransparent ? logoLightTrans : logoLight;
  } else {
    logoAlaBg = semiTransparent ? logoDarkTrans : logoDark;
  }

  return (
    <Box
      style={{
        ...style,
        backgroundColor: 'light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-8))',
        backgroundImage: `url(${logoAlaBg})`,
        backgroundRepeat: 'repeat',
        backgroundSize: 65,
        backgroundPosition: '-30px -30px',
        backgroundAttachment: !mobile && parallax ? 'fixed' : 'scroll',
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}

import { Box, type BoxProps, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import type { PropsWithChildren } from 'react';
import logoLightTrans from '/assets/logo-ala-background-light-trans.png';

interface BackgroundProps extends PropsWithChildren<BoxProps> {
  parallax?: boolean;
}

export function Background({
  style,
  children,
  parallax = true,
  ...rest
}: BackgroundProps) {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  return (
    <Box
      style={{
        ...style,
        backgroundColor: 'light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-6))',
        backgroundBlendMode: 'multiply',
        backgroundImage: `url(${logoLightTrans})`,
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

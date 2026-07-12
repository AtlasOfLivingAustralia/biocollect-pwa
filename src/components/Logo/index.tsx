import { Box, type BoxProps } from '@mantine/core';
import { lazy, Suspense } from 'react';
import logo from './logo.lottie';

const DotLottie = lazy(() => import('./DotLottie'));

interface LogoProps extends BoxProps {
  size?: number;
}

export function Logo({ size: rawSize, ...rest }: LogoProps) {
  const size = rawSize || 100;

  return (
    <Box {...rest} w={size} h={size}>
      <Suspense>
        <DotLottie
          width={size}
          height={size}
          src={logo}
          autoplay
        />
      </Suspense>
    </Box>
  );
}
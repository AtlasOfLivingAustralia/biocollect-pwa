import { Box, Loader, LoadingOverlay, Stack, Text } from '@mantine/core';
import { forwardRef, useState } from 'react';

type IFrameProps = Omit<
  React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>,
  'style'
>;

const LoaderContent = (
  <Stack justify='center' align='center'>
    <Loader />
    <Text fw='bold' size='sm' ta='center'>Loading PWA</Text>
  </Stack>
)

export const Frame = forwardRef<HTMLIFrameElement, IFrameProps>(({ onLoad, ...props }, ref) => {
  const [loaded, setLoaded] = useState<boolean>(false);

  const width = props.width || '100%';
  const height = props.height || 'calc(100vh - 275px)';

  return (
    <Box w={width} h={height}>
      <LoadingOverlay visible={!loaded} loaderProps={{ children: LoaderContent }} />
      {/** biome-ignore lint/a11y/noNoninteractiveElementInteractions: We still need to hook into onLoad */}
      <iframe
        {...props}
        ref={ref}
        width='100%'
        height='100%'
        style={{
          border: 'none'
        }}
        onLoad={(event) => {
          setLoaded(true);
          if (onLoad) onLoad(event);
        }}
      ></iframe>
    </Box>
  );
});

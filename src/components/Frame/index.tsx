import { useState } from 'react';
import { Button, Skeleton, useMantineTheme } from '@mantine/core';

interface FrameProps {
  src: string;
  width?: number | string;
  height?: number | string;
  withConfirmButton?: boolean;
}

export function Frame(props: FrameProps) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const theme = useMantineTheme();

  const width = props.width || '100%';
  const height = props.height || 500;

  return (
    <Skeleton visible={!loaded} width={width} height={height}>
      <iframe
        width={width}
        height={height}
        src={props.src}
        onLoad={() => setLoaded(true)}
        style={{
          border: `1px solid ${
            theme.colorScheme === 'dark'
              ? theme.colors.dark[5]
              : theme.colors.gray[4]
          }`,
          borderRadius: theme.radius.md,
        }}
      ></iframe>
    </Skeleton>
  );
}

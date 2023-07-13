import { useState } from 'react';
import { Skeleton } from '@mantine/core';

interface FrameProps {
  src: string;
  width?: number | string;
  height?: number | string;
}

export function Frame(props: FrameProps) {
  const [loaded, setLoaded] = useState<boolean>(false);

  const width = props.width || '100%';
  const height = props.height || 500;

  return (
    <Skeleton visible={!loaded} width={width} height={height}>
      <iframe
        width={width}
        height={height}
        src={props.src}
        onLoad={() => setLoaded(true)}
      ></iframe>
    </Skeleton>
  );
}

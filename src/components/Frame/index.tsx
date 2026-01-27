import { Skeleton } from '@mantine/core';
import { forwardRef, useState } from 'react';

type IFrameProps = Omit<
  React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>,
  'style'
>;

export const Frame = forwardRef<HTMLIFrameElement, IFrameProps>(({ onLoad, ...props }, ref) => {
  const [loaded, setLoaded] = useState<boolean>(false);

  const width = props.width || '100%';
  const height = props.height || 'calc(100vh - 275px)';

  return (
    <Skeleton visible={!loaded} width={width} height={height} radius={0}>
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
    </Skeleton>
  );
});

import { Ref, forwardRef, useState } from 'react';
import { Skeleton, useMantineTheme } from '@mantine/core';

type IFrameProps = Omit<
  React.DetailedHTMLProps<
    React.IframeHTMLAttributes<HTMLIFrameElement>,
    HTMLIFrameElement
  >,
  'style'
>;

export const Frame = forwardRef<HTMLIFrameElement, IFrameProps>(
  ({ onLoad, ...props }, ref) => {
    const [loaded, setLoaded] = useState<boolean>(false);

    const width = props.width || '100%';
    const height = props.height || 'calc(100vh - 275px)';

    return (
      <Skeleton visible={!loaded} width={width} height={height} radius={0}>
        <iframe
          {...props}
          ref={ref}
          width="100%"
          height="100%"
          style={{
            border: `1px solid light-dark(var(--mantine-color-dark-5), var(--mantine-color-gray-4))`,
          }}
          onLoad={(event) => {
            setLoaded(true);
            if (onLoad) onLoad(event);
          }}
        ></iframe>
      </Skeleton>
    );
  }
);

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
    const theme = useMantineTheme();

    const width = props.width || '100%';
    const height = props.height || 500;

    return (
      <Skeleton visible={!loaded} width={width} height={height}>
        <iframe
          ref={ref}
          width={width}
          height={height}
          style={{
            border: `1px solid ${
              theme.colorScheme === 'dark'
                ? theme.colors.dark[5]
                : theme.colors.gray[4]
            }`,
            borderRadius: theme.radius.md,
          }}
          {...props}
          onLoad={(event) => {
            setLoaded(true);
            if (onLoad) onLoad(event);
          }}
        ></iframe>
      </Skeleton>
    );
  }
);

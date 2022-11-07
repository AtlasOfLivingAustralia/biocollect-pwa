import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Skeleton, Text } from '@mantine/core';
import axios from 'axios';

interface FrameProps
  extends React.DetailedHTMLProps<
    React.IframeHTMLAttributes<HTMLIFrameElement>,
    HTMLIFrameElement
  > {}

export default function Frame(props: FrameProps) {
  const auth = useAuth();
  const [authSrc, setAuthSrc] = useState<string | undefined>();

  useEffect(() => {
    async function fetchUrl() {
      const res = await fetch(props.src || '', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`,
        },
        mode: 'no-cors',
      });

      const url = URL.createObjectURL(await res.blob());
      console.log(res.body, url);
      setAuthSrc(url);
    }

    fetchUrl();
  }, []);

  return (
    <Skeleton
      visible={Boolean(authSrc)}
      width={props.width}
      height={props.height}
    >
      {authSrc && <iframe {...props} src={authSrc}></iframe>}
    </Skeleton>
  );
}

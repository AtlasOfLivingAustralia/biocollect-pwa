import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Skeleton, Text } from '@mantine/core';
import axios from 'axios';

interface FrameProps {
  src: string;
  baseUrl: string;
  width?: number | string;
  height?: number | string;
}

export default function Frame(props: FrameProps) {
  const auth = useAuth();
  const [pageData, setPageData] = useState<string | undefined>();

  useEffect(() => {
    async function fetchUrl() {
      const res = await axios.get<string>(props.src || '');
      const data = res.data
        .replaceAll('href="/assets', `href="${props.baseUrl}/assets`)
        .replaceAll('href="/acsa', `href="${props.baseUrl}/acsa`)
        .replaceAll('src="/assets', `src="${props.baseUrl}/assets`)
        .replaceAll('|| "/acsa/ajax', `|| "${props.baseUrl}/acsa/ajax`)
        .replaceAll(': "/acsa', `: "${props.baseUrl}/acsa`)
        .replaceAll(':"/acsa', `: "${props.baseUrl}/acsa`)
        .replaceAll(':"/assets', `: "${props.baseUrl}/assets`)
        .replaceAll(': "/ws', `: "${props.baseUrl}/ws`)
        .replaceAll(': "/search', `: "${props.baseUrl}/search`);

      console.log('text', data);
      setPageData(data);
    }

    fetchUrl();
  }, []);

  const width = props.width || '100%';
  const height = props.height || 500;

  return (
    <Skeleton visible={!Boolean(pageData)} width={width} height={height}>
      {pageData && (
        <iframe width={width} height={height} srcDoc={pageData}></iframe>
      )}
    </Skeleton>
  );
}

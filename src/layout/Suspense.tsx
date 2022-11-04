import { ReactElement, Suspense as ReactSuspense } from 'react';
import { Center, Loader } from '@mantine/core';

interface SuspenseProps {
  children?: ReactElement;
}
const Fallback = () => (
  <Center sx={{ display: 'flex', flexGrow: 1 }}>
    <Loader />
  </Center>
);

export default function Suspense({ children }: SuspenseProps) {
  return <ReactSuspense fallback={<Fallback />}>{children}</ReactSuspense>;
}

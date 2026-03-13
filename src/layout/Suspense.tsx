import { Center, Loader } from '@mantine/core';
import { type ReactElement, Suspense as ReactSuspense } from 'react';

interface SuspenseProps {
  children?: ReactElement;
}
const Fallback = () => (
  <Center style={{ display: 'flex', flexGrow: 1 }}>
    <Loader />
  </Center>
);

export default function Suspense({ children }: SuspenseProps) {
  return <ReactSuspense fallback={<Fallback />}>{children}</ReactSuspense>;
}

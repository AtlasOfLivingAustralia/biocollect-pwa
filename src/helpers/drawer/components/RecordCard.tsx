import { Box, Center, Divider, Flex, Group, Image, Paper, Skeleton, Stack } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';
import { type PropsWithChildren, type ReactElement, type ReactNode, useState } from 'react';

const IMAGE_SIZE = 100;

function RecordCardImage({ imageUrl, imageAlt }: { imageAlt: string; imageUrl?: string | null }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  if (!imageUrl || error) {
    return (
      <Box
        style={{ borderRadius: 'var(--mantine-radius-lg)' }}
        miw={IMAGE_SIZE}
        mih={IMAGE_SIZE}
        w={IMAGE_SIZE}
        h={IMAGE_SIZE}
        bg='light-dark(var(--mantine-color-gray-2),var(--mantine-color-dark-4))'
      >
        <Center h='100%'>
          <IconPhoto size='1.5rem' />
        </Center>
      </Box>
    );
  }

  return (
    <Skeleton visible={loading && !error} w={IMAGE_SIZE} h={IMAGE_SIZE}>
      <Image
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
        src={imageUrl}
        alt={imageAlt}
        radius='lg'
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
        }}
      />
    </Skeleton>
  );
}

interface RecordCardProps extends PropsWithChildren {
  actions?: ReactNode;
  imageAlt?: string;
  imageUrl?: string | null;
}

export function RecordCard({
  actions,
  children,
  imageAlt = 'Record image',
  imageUrl,
  ...rest
}: RecordCardProps): ReactElement {
  return (
    <Paper p='sm' pr='lg' withBorder {...rest}>
      <Stack>
        <Flex justify='space-between' gap='md'>
          <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
            {children}
          </Stack>
          <RecordCardImage imageUrl={imageUrl} imageAlt={imageAlt} />
        </Flex>
        <Divider />
        <Group justify='center' gap={6}>
          {actions}
        </Group>
      </Stack>
    </Paper>
  );
}

import { FrameContext } from "#/helpers/frame";
import { usePWA } from "#/helpers/pwa";
import { Box, Flex, Menu, Progress, Skeleton, Text } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import prettyBytes from "pretty-bytes";
import { useContext } from "react";

export function StorageSummary() {
  const { storageStats: stats } = usePWA();
  const frame = useContext(FrameContext);
  const progress = stats ? (stats.used / stats.maximum) * 100 : 0;

  return <>
    <Menu.Divider />
    <Menu.Label>Storage</Menu.Label>
    <Flex align="center" px='sm' pb='xs' gap='sm'>
      <Box style={{ flexGrow: 1 }}>
        <Skeleton mt={1.5} visible={!stats}>
          <Progress.Root size='xl'>
            <Progress.Section value={progress}>
              <Progress.Label>{prettyBytes(stats?.used || 0)}</Progress.Label>
            </Progress.Section>
            <Progress.Section color='transparent' value={100 - progress}>
              <Progress.Label>{prettyBytes(stats?.free || 0)}</Progress.Label>
            </Progress.Section>
          </Progress.Root>
        </Skeleton>
      </Box>
      <Box>
        <Skeleton visible={!stats}>
          <Text ta='right' size='xs' fw='bold'>{Math.round(progress)}%</Text>
        </Skeleton>
      </Box>
    </Flex>
    <Menu.Item
      onClick={() =>
        frame.open(
          `${import.meta.env.VITE_API_BIOCOLLECT}/pwa/settings`,
          'Manage Storage',
        )
      }
      leftSection={<IconSettings size='1rem' />}
    >
      Manage storage
    </Menu.Item>
  </>
}
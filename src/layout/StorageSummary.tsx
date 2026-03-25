import { usePWA } from "#/helpers/pwa";
import { Box, Flex, Loader, Menu, Progress, Skeleton, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import prettyBytes from "pretty-bytes";

export function StorageSummary() {
  const { storageStats: stats, clearingStorage, clearStorage } = usePWA();
  const progress = stats ? (stats.used / stats.maximum) * 100 : 0;

  return <>
    <Menu.Divider />
    <Menu.Label>Storage</Menu.Label>
    <Flex align="center" px='sm' pb='xs' gap='sm'>
      <Box style={{ flexGrow: 1 }}>
        <Skeleton mt={1.5} visible={!stats}>
          <Progress.Root size='xl'>
            {clearingStorage ? (
              <Progress.Section value={100} animated>
                <Progress.Label>Clearing storage</Progress.Label>
              </Progress.Section>
            ) : (
              <>
                <Progress.Section value={progress}>
                  <Progress.Label>{prettyBytes(stats?.used || 0)}</Progress.Label>
                </Progress.Section>
                <Progress.Section color='transparent' value={100 - progress}>
                  <Progress.Label c='light-dark(var(--mantine-color-dark-4), white)'>{prettyBytes(stats?.free || 0)}</Progress.Label>
                </Progress.Section>
              </>
            )}

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
      color='red'
      onClick={clearStorage}
      leftSection={clearingStorage ? <Loader size={16} color="grey" /> : <IconTrash size='1rem' />}
      closeMenuOnClick={false}
      disabled={clearingStorage}
    >
      Clear storage
    </Menu.Item>
  </>
}
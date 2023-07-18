import { Group, Text, Paper, Stack, Progress, PaperProps } from '@mantine/core';
import { IconCalendar, IconCalendarDue } from '@tabler/icons';

interface TimeSpanProps extends PaperProps {
  start?: string | null;
  end?: string | null;
}

export function TimeSpan({ start, end, ...rest }: TimeSpanProps) {
  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;

  if (!startDate && !endDate) return null;

  return (
    <Paper radius="md" withBorder {...rest}>
      <Group py={8} px="xs" position="center">
        {startDate && (
          <>
            <IconCalendar />
            <Stack spacing={0}>
              <Text size="xs" color="dimmed" weight="bold">
                Start Date
              </Text>
              <Text size="sm">
                {startDate.getDay()}/{startDate.getMonth() + 1}/
                {startDate.getFullYear()}
              </Text>
            </Stack>
          </>
        )}
        {startDate && endDate && <Text> - </Text>}
        {endDate && (
          <>
            <IconCalendarDue />
            <Stack spacing={0}>
              <Text size="xs" color="dimmed" weight="bold">
                End Date
              </Text>
              <Text size="sm">
                {endDate.getDay()}/{endDate.getMonth() + 1}/
                {endDate.getFullYear()}
              </Text>
            </Stack>
          </>
        )}
      </Group>
      {startDate &&
        endDate &&
        (() => {
          const value =
            ((endDate.getTime() - Date.now()) /
              (endDate.getTime() - startDate.getTime())) *
            100;

          return (
            <Progress
              styles={{
                root: { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
                bar: {
                  borderTopLeftRadius: `0!important`,
                  borderTopRightRadius: `${
                    value < 100 ? '0.25rem' : 0
                  }!important`,
                  borderBottomRightRadius: `${
                    value < 100 ? '0.25rem' : 0
                  }!important`,
                },
              }}
              value={value}
            />
          );
        })()}
    </Paper>
  );
}

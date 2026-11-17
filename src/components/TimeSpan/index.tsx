import { Box, Group, Paper, type PaperProps, Progress, Stack, Text } from '@mantine/core';
import { IconCalendar, IconCalendarDue } from '@tabler/icons-react';

const dateFormatter = new Intl.DateTimeFormat('en-AU', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  timeZone: 'Australia/Sydney',
});

interface TimeSpanProps extends PaperProps {
  start?: string | null;
  end?: string | null;
}

export function TimeSpan({ start, end, ...rest }: TimeSpanProps) {
  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;

  if (!startDate && !endDate) return null;

  return (
    <Paper withBorder {...rest}>
      <Group py={8} px='xs' justify='center'>
        {startDate && (
          <>
            <IconCalendar />
            <Stack gap={0}>
              <Text size='xs' c='dimmed' fw='bold'>
                Start Date
              </Text>
              <Text size='sm'>{dateFormatter.format(startDate)}</Text>
            </Stack>
          </>
        )}
        {startDate && endDate && <Text> - </Text>}
        {endDate && (
          <>
            <IconCalendarDue />
            <Stack gap={0}>
              <Text size='xs' c='dimmed' fw='bold'>
                End Date
              </Text>
              <Text size='sm'>{dateFormatter.format(endDate)}</Text>
            </Stack>
          </>
        )}
      </Group>
      {startDate &&
        endDate &&
        (() => {
          const value = Math.min(
            ((endDate.getTime() - Date.now()) / (endDate.getTime() - startDate.getTime())) * 100,
            100,
          );

          return (
            <Box px='sm' pb='sm'>
              <Progress value={value} />
            </Box>
          );
        })()}
    </Paper>
  );
}

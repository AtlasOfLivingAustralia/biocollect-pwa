import { Divider, Flex, Group, Text, ThemeIcon } from "@mantine/core";
import { IconDatabaseExclamation } from "@tabler/icons-react";

import classes from './index.module.css';
import type { CSSProperties, PropsWithChildren } from "react";

const fixedStyles: CSSProperties = { position: 'absolute', top: 'var(--mantine-spacing-md)', left: 'var(--mantine-spacing-md)', zIndex: 20 };

export function UnpublishedBadge({ count, fixed }: { count?: number, fixed?: boolean }) {
  if (!count) {
    return null;
  }

  return (
    <div style={fixed ? fixedStyles : undefined} className={classes.badge}>
      <Group gap={6} justify='center'>
        <IconDatabaseExclamation size="1rem" />
        <Text fz='xs' fw='bold' mt={2}>{count} Unpublished</Text>
      </Group>
    </div>
  );
}

export function UnpublishedWrapper({ children, count }: PropsWithChildren<{ count?: number }>) {
  if (!count) {
    return children;
  }

  return (
    <Flex className={classes.wrapper} align='center' gap='xs'>
      {children}
      <Divider orientation="vertical" />
      <ThemeIcon color='yellow' variant="light">
        <Text size='xs' fw="bold">{count}</Text>
      </ThemeIcon>
    </Flex>
  );
}
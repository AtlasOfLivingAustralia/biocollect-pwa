import {
  Header,
  Group,
  Text,
  Menu,
  Avatar,
  UnstyledButton,
} from '@mantine/core';
import { ReactElement } from 'react';

interface LayoutProps {
  children: ReactElement;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header height={71} p="md">
        <Group position="apart">
          <Text>BioCollect (temp)</Text>
          <Menu position="bottom-end">
            <Menu.Target>
              <Avatar component={UnstyledButton} radius="xl" variant="filled">
                JB
              </Avatar>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>User</Menu.Label>
              <Menu.Item>Testing</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Header>
      {children}
    </>
  );
}

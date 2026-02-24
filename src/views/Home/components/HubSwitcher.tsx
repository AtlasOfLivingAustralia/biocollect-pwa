import { useHub } from "#/helpers/funcs/useHub";
import { hubs } from '#/helpers/hubs';
import { Badge, Flex, Image, Stack, Text, UnstyledButton } from "@mantine/core";
import { Spotlight, spotlight } from "@mantine/spotlight";
import { useMemo } from "react";

import classes from './HubSwitcher.module.css';

interface HubSwitcherProps {
  onChange: () => void;
}

const LOGO_SIZE = 50;

export function HubSwitcher({ onChange }: HubSwitcherProps) {
  const [hub, setHub] = useHub();

  const actions = useMemo(() => Object.values(hubs).map(({ id, name, description, logo }) => ({
    id,
    label: name,
    description,
    leftSection: <Image width={50} height={50} src={logo} radius='xl' />,
    rightSection: id === hub.id ? <Badge variant='default'>Current hub</Badge> : undefined,
    onClick: () => {
      // Only trigger the update if we're switching to a new hub
      if (hub.id !== id) {
        setHub(id);
        onChange();
      }
    }
  })), [hub]);

  return (
    <>
      <Spotlight searchProps={{ placeholder: 'Search for a hub' }} actions={actions} />
      <UnstyledButton className={classes.root} onClick={spotlight.open}>
        <Flex align='center' gap='md'>
          <div style={{ width: LOGO_SIZE, height: LOGO_SIZE }} className={classes.wrapper}>
            <Image className={classes.logo} src={hub.logo} w="100%" h="100%" radius='xl' />
          </div>
          <Stack className={classes.details} gap={0} py={4}>
            <Text size='lg' fw='bold' ff='heading'>{hub.name}</Text>
            <Text c='dimmed' size='xs'>Switch hub</Text>
          </Stack>
        </Flex>
      </UnstyledButton>
    </>
  )
}
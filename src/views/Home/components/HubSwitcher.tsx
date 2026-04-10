import { DEFAULT_HUB, useHubId } from "#/helpers/funcs/useHub";
import { Badge, Flex, Image, Skeleton, Stack, Text, UnstyledButton } from "@mantine/core";
import { Spotlight, spotlight } from "@mantine/spotlight";
import { useEffect, useMemo, useState } from "react";

import classes from './HubSwitcher.module.css';
import type { BioCollectHub } from "#/types";
import { biocollect } from "#/helpers/api";

import logoAla from '/assets/logo-ala-background-light-trans.png';

interface HubSwitcherProps {
  onChange: () => void;
}

const LOGO_SIZE = 50;

interface HubLogoProps {
  logo?: string;
}

function HubLogo({ logo }: HubLogoProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  return (
    <Skeleton visible={loading && !error} w={LOGO_SIZE} h={LOGO_SIZE} circle>
      <Image
        width={LOGO_SIZE}
        height={LOGO_SIZE}
        src={(logo && logo.length > 0 && !error) ? logo : logoAla}
        radius='xl'
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
        }}
      />
    </Skeleton>
  );
}

export function HubSwitcher({ onChange }: HubSwitcherProps) {
  const [hubs, setHubs] = useState<BioCollectHub[] | null>(null);
  const [hubId, setHubId] = useHubId();
  const hub: BioCollectHub | null = hubs?.find(({ url }) => url === hubId) || null;

  useEffect(() => {
    if (hubs && !hub) {
      setHubId(DEFAULT_HUB);
    }
  }, [hub, hubs, hubId]);

  const actions = useMemo(() => Object.values(hubs || []).map(({ id, url, name, description, logo }) => ({
    id,
    label: name,
    description,
    leftSection: <HubLogo logo={logo} />,
    rightSection: url === hubId ? <Badge variant='default'>Current hub</Badge> : undefined,
    onClick: () => {
      // Only trigger the update if we're switching to a new hub
      if (url !== hubId) {
        setHubId(url);
        onChange();
      }
    }
  })), [hub]);

  useEffect(() => {
    async function fetchHubs() {
      const fetchedHubs = await biocollect.listHubs();
      setHubs(fetchedHubs);
    }

    fetchHubs();
  }, []);

  return (
    <>
      <Spotlight searchProps={{ placeholder: 'Search for a hub' }} actions={actions} />
      <UnstyledButton disabled={!hubs} className={classes.root} onClick={spotlight.open}>
        <Flex align='center' gap='md'>
          <HubLogo logo={hub?.logo} />
          <Stack className={classes.details} gap={4} py={4}>
            <Skeleton visible={!hub}>
              <Text size='lg' fw='bold' ff='heading'>{hub?.name || "Hub name"}</Text>
            </Skeleton>
            <Skeleton visible={!hub}>
              <Text c='dimmed' size='xs'>Switch hub</Text>
            </Skeleton>
          </Stack>
        </Flex>
      </UnstyledButton>
    </>
  )
}
import { DEFAULT_HUB, useHubId } from "#/helpers/funcs/useHub";
import { Badge, Flex, Image, Skeleton, Stack, Text, UnstyledButton } from "@mantine/core";
import { Spotlight, spotlight } from "@mantine/spotlight";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import classes from './HubSwitcher.module.css';
import type { BioCollectHub } from "#/types";
import { biocollect } from "#/helpers/api";

import logoAla from '/assets/logo-ala-background-light-trans.png';
import { IconArrowsDiff, IconRefresh } from "@tabler/icons-react";

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
        miw={LOGO_SIZE}
        mih={LOGO_SIZE}
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
  const didDiscard = useRef(false);

  const selectHub = useCallback(
    (nextHubId: string) => {
      if (!hubs?.some(({ url }) => url === nextHubId)) return false;

      if (nextHubId !== hubId) {
        setHubId(nextHubId);
        onChange();
      }

      return true;
    },
    [hubs, hubId, setHubId, onChange],
  );

  useEffect(() => {
    if (didDiscard.current || !hubs || hub) return;

    didDiscard.current = true;

    // Current hub is not in the retrieved list. Use the default when that
    // hub was retrieved; otherwise drop the stored selection.
    if (selectHub(DEFAULT_HUB)) return;

    setHubId(null);
    if (hubId !== DEFAULT_HUB) onChange();
  }, [hub, hubs, hubId, selectHub, setHubId, onChange]);

  const actions = useMemo(() => Object.values(hubs || []).map(({ id, url, name, description, logo }) => ({
    id,
    label: name,
    description,
    leftSection: <HubLogo logo={logo} />,
    rightSection: url === hubId ? <Badge variant='default'>Current hub</Badge> : undefined,
    onClick: () => {
      selectHub(url);
    }
  })), [hubs, hubId, selectHub]);

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
          <Stack className={classes.details} gap={0} py={4}>
            <Skeleton visible={!hub}>
              <Text size='xl' fw='bold' ff='heading'>{hub?.name || "Hub name"}</Text>
            </Skeleton>
            <Skeleton visible={!hub}>
              <Flex align='center' gap='xs'>
                <Flex className={classes.icon}>
                  <IconRefresh size='1rem' />
                </Flex>
                <Text c='dimmed' size='sm'>Switch hub</Text>
              </Flex>
            </Skeleton>
          </Stack>
        </Flex>
      </UnstyledButton>
    </>
  )
}
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Box, Group, ScrollArea, Title, useMantineTheme } from '@mantine/core';
import { BioCollectProject, BioCollectSurvey } from 'types';
import { useMediaQuery } from '@mantine/hooks';

// import { Frame } from 'components';
import { Header } from './components/Header';
import { Wave } from 'components/Wave';
import { SurveyCard } from './components/SurveyCard';

interface ProjectLoaderData {
  project: BioCollectProject;
  surveys: BioCollectSurvey[];
}

export function Project() {
  const { project, surveys } = useLoaderData() as ProjectLoaderData;
  const [survey, setSurvery] = useState<string | null>(null);

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const highlight =
    theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2];

  return (
    <>
      <Header project={project} mobile={mobile} />
      <Wave
        style={{ marginTop: theme.spacing.xl, marginBottom: -36 }}
        preserveAspectRatio="none"
        waveColour={highlight}
        waveType={mobile ? 'body' : 'bodyFull'}
        height={75}
        width="100%"
      />
      <Box py="xl" bg={highlight}>
        <Title px={36} order={2}>
          Surveys
        </Title>
        <ScrollArea maw="calc(100vw)">
          <Group noWrap p="xl">
            {surveys.map((survey) => (
              <SurveyCard key={survey.id} survey={survey} />
            ))}
          </Group>
        </ScrollArea>
        {/* {survey && (
          <Frame
            src={`https://biocollect.ala.org.au/acsa/bioActivity/create/${survey}`}
          />
        )} */}
      </Box>
      <Wave
        preserveAspectRatio="none"
        waveColour={highlight}
        waveType={mobile ? 'bodyBottom' : 'bodyBottomFull'}
        height={75}
        width="100%"
      />
    </>
  );
}

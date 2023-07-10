import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Box, Grid, Text, Title, useMantineTheme } from '@mantine/core';
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
        style={{ marginTop: theme.spacing.sm, marginBottom: -30 }}
        preserveAspectRatio="none"
        waveColour={highlight}
        waveType={mobile ? 'body' : 'bodyFull'}
        height={75}
        width="100%"
      />
      <Box py="xl" px={36} bg={highlight}>
        <Title order={2} mb="lg">
          Surveys
        </Title>
        <Grid gutter="xl">
          {surveys.length > 0 ? (
            surveys.map((survey) => (
              <Grid.Col key={survey.id} xs={12} sm={12} md={6} lg={4} xl={4}>
                <SurveyCard survey={survey} />
              </Grid.Col>
            ))
          ) : (
            <Grid.Col span={12}>
              <Text>No surveys</Text>
            </Grid.Col>
          )}
        </Grid>
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

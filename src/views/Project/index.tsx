import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Box, Button, Menu, useMantineTheme } from '@mantine/core';
import { BioCollectProject, BioCollectSurvey } from 'types';
import { useMediaQuery } from '@mantine/hooks';
import Logger from 'helpers/logger';

// import { Frame } from 'components';
import Header from './components/Header';
import { Wave } from 'components/Wave';

interface ProjectLoaderData {
  project: BioCollectProject;
  surveys: BioCollectSurvey[];
}

export default function Project() {
  const { project, surveys } = useLoaderData() as ProjectLoaderData;
  const [survey, setSurvery] = useState<string | null>(null);

  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const highlight =
    theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0];

  return (
    <>
      <Header project={project} mobile={mobile} />
      <Wave
        style={{ marginTop: theme.spacing.xl, marginBottom: -8 }}
        preserveAspectRatio="none"
        waveColour={highlight}
        waveType={mobile ? 'body' : 'bodyFull'}
        height={125}
        width="100%"
      />
      <Box px={36} pb={36} bg={highlight}>
        {surveys.length > 0 && (
          <Menu position="bottom-start">
            <Menu.Target>
              <Button>Add Record</Button>
            </Menu.Target>
            <Menu.Dropdown>
              {surveys.map((survey) => (
                <Menu.Item
                  key={survey.id}
                  onClick={() => setSurvery(survey.id)}
                >
                  {survey.name}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        )}
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
        height={125}
        width="100%"
      />
    </>
  );
}

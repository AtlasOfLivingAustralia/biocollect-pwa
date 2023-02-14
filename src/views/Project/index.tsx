import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Box, Button, Menu } from '@mantine/core';
import { BioCollectProject, BioCollectSurvey } from 'types';
import Logger from 'helpers/logger';

// import { Frame } from 'components';
import Header from './components/Header';

interface ProjectLoaderData {
  project: BioCollectProject;
  surveys: BioCollectSurvey[];
}

export default function Project() {
  const { project, surveys } = useLoaderData() as ProjectLoaderData;
  const [survey, setSurvery] = useState<string | null>(null);

  return (
    <>
      <Header project={project} />
      <Box p="xl">
        {surveys.length > 0 && (
          <Menu>
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
    </>
  );
}

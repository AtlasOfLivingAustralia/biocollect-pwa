import { useContext, useEffect, useState } from 'react';
import { useLoaderData, useLocation, useParams } from 'react-router-dom';
import { Box, Button, Image, Menu, Skeleton, Text, Title } from '@mantine/core';
import { APIContext } from 'helpers/api';
import { BioCollectProject, BioCollectSurvey } from 'types';
import Logger from 'helpers/logger';
import { useAuth } from 'react-oidc-context';

import { Frame } from 'components';

interface ProjectProps {}

export default function Project() {
  const { projectId } = useParams();
  const location = useLocation();
  const api = useContext(APIContext);
  const [project, setProject] = useState<BioCollectProject | null>(
    location.state?.project || null
  );
  const [survey, setSurvery] = useState<string | null>(null);
  const surveys = useLoaderData() as BioCollectSurvey[];

  // useEffect hook for fetching project data if not supplied by location state
  useEffect(() => {
    async function fetchProject() {
      try {
        const project = await api.biocollect.getProject(projectId as string);
        setProject(project);
      } catch (error) {
        Logger.error(error);
      }
    }

    if (!project) fetchProject();
  }, [location]);

  const loading = false;
  console.log(survey);

  return (
    <Box p="xl">
      {project?.urlImage && (
        <Skeleton visible={loading} width={200}>
          <Image
            src={project.urlImage}
            width={200}
            height={150}
            radius="lg"
            withPlaceholder
          />
        </Skeleton>
      )}
      <Skeleton visible={loading} mt="md">
        <Title>{project?.name || 'Project Name'}</Title>
      </Skeleton>
      <Skeleton visible={loading} mt="xs">
        <Title order={3}>{project?.projectType || 'Project Type'}</Title>
      </Skeleton>
      <Text>{projectId}</Text>
      {surveys.length > 0 && (
        <Menu>
          <Menu.Target>
            <Button>Add Record</Button>
          </Menu.Target>
          <Menu.Dropdown>
            {surveys.map((survey) => (
              <Menu.Item key={survey.id} onClick={() => setSurvery(survey.id)}>
                {survey.name}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      )}
      {survey && (
        <Frame
          src={`https://biocollect.ala.org.au/acsa/bioActivity/create/${survey}`}
          width="100%"
          height={400}
        />
      )}
      {/* <Text>{JSON.stringify(project || {}, null, 2)}</Text> */}
    </Box>
  );
}

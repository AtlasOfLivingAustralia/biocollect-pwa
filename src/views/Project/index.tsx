import { useContext, useEffect, useState } from 'react';
import { useLoaderData, useLocation, useParams } from 'react-router-dom';
import { Box, Image, Skeleton, Text, Title } from '@mantine/core';
import { APIContext } from 'helpers/api';
import { BioCollectProject, BioCollectSurvey } from 'types';
import Logger from 'helpers/logger';
import { useAuth } from 'react-oidc-context';

interface ProjectProps {}

export default function Project() {
  const { projectId } = useParams();
  const location = useLocation();
  const api = useContext(APIContext);
  const [project, setProject] = useState<BioCollectProject | null>(
    location.state?.project || null
  );
  const [surveys, setSurveys] = useState<BioCollectSurvey[] | null>(null);
  const data = useLoaderData();
  console.log('loader data', data);

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
      {/* <Text>{JSON.stringify(project || {}, null, 2)}</Text> */}
    </Box>
  );
}

import axios from 'axios';
import {
  BioCollectProject,
  BioCollectProjectSearch,
  BioCollectSurvey,
} from 'types';

const formatProjects = async (search: BioCollectProjectSearch) => ({
  ...search,
  projects: search.projects.map((project) => ({
    ...project,
    name: project.name.trim(),
    description: project.description,
  })),
});

type BioCollectProjectSort =
  | 'dateCreatedSort'
  | 'nameSort'
  | '_score'
  | 'organisationSort';

export default {
  projectSearch: async (
    offset = 0,
    max = 30,
    sort: string = 'dateCreatedSort',
    isUserPage = false,
    search?: string,
    geoSearchJSON?: object
  ): Promise<BioCollectProjectSearch> => {
    // Define basic query parameters
    const params: { [key: string]: any } = {
      fq: 'isExternal:F',
      initiator: 'biocollect',
      sort,
      mobile: true,
      max,
      offset,
      isUserPage,
    };

    // Append user search
    if (search && search.length > 0) {
      params['q'] = search;
    }

    // Append GeoJSON search
    if (geoSearchJSON) {
      params['geoSearchJSON'] = JSON.stringify(geoSearchJSON);
    }

    // Make the GET request
    const { data } = await axios.get<BioCollectProjectSearch>(
      `${import.meta.env.VITE_API_BIOCOLLECT}/ws/project/search`,
      { params }
    );

    return await formatProjects(data);
  },
  getProject: async (projectId: string): Promise<BioCollectProject> => {
    // Make the GET request
    const { data } = await axios.get<BioCollectProjectSearch>(
      `${import.meta.env.VITE_API_BIOCOLLECT}/ws/project/search`,
      {
        params: {
          fq: `projectId:${projectId}`,
        },
      }
    );

    const [project] = (await formatProjects(data)).projects;
    return project;
  },
  listSurveys: async (projectId: string): Promise<BioCollectSurvey[]> => {
    // Make the GET request
    const { data } = await axios.get<BioCollectSurvey[]>(
      `${import.meta.env.VITE_API_BIOCOLLECT}/ws/survey/list/${projectId}`
    );

    return data;
  },
};

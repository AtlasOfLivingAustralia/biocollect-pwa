import axios from 'axios';
import {
  BioCollectBioActivitySearch,
  BioCollectBioActivityView,
  BioCollectProject,
  BioCollectProjectSearch,
  BioCollectSurvey,
  FilterQueries,
} from 'types';
import { BioCollectDexie } from '../dexie';

const formatProjects = async (
  projects: BioCollectProject[],
  db: BioCollectDexie
) => {
  return projects.map((project) => ({
    ...project,
    name: project.name.trim(),
  }));
};

const formatProjectSearch = async (
  search: BioCollectProjectSearch,
  db: BioCollectDexie
) => ({
  ...search,
  projects: await formatProjects(search.projects, db),
});

// type BioCollectProjectSort =
//   | 'dateCreatedSort'
//   | 'nameSort'
//   | '_score'
//   | 'organisationSort';

export default (db: BioCollectDexie) => ({
  projectSearch: async (
    offset = 0,
    max = 30,
    sort: string = 'dateCreatedSort',
    isUserPage = false,
    search?: string,
    geoSearchJSON?: object
  ): Promise<BioCollectProjectSearch> => {
    if (navigator.onLine) {
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
      if (search && search.length > 0) params['q'] = search;

      // Append GeoJSON search
      if (geoSearchJSON)
        params['geoSearchJSON'] = JSON.stringify(geoSearchJSON);

      // Make the GET request
      const { data } = await axios.get<BioCollectProjectSearch>(
        `${import.meta.env.VITE_API_BIOCOLLECT}/ws/project/search`,
        { params }
      );
      const formatted = await formatProjectSearch(data, db);

      // Store the projects in IDB & return
      await db.projects.bulkPut(formatted.projects);
      return formatted;
    } else {
      let query: any = db.projects;

      // Append the search query
      if (search && search.length > 0)
        query = query
          .where('name')
          .startsWithAnyOfIgnoreCase(search?.split(' '));

      // Perform the query
      const projects = await query.offset(offset).limit(max).toArray();

      return {
        facets: [],
        total: await db.projects.count(),
        projects,
      };
    }
  },
  getProject: async (projectId: string): Promise<BioCollectProject | null> => {
    const cached = await db.projects.get(projectId);
    if (cached) {
      return cached;
    } else if (navigator.onLine) {
      // Make the GET request
      const { data } = await axios.get<BioCollectProjectSearch>(
        `${import.meta.env.VITE_API_BIOCOLLECT}/ws/project/search`,
        {
          params: {
            fq: `projectId:${projectId}`,
          },
        }
      );

      const [project] = await formatProjects(data.projects, db);
      return project;
    }

    return null;
  },

  listSurveys: async (projectId: string): Promise<BioCollectSurvey[]> => {
    if (navigator.onLine) {
      // Make the GET request
      const { data } = await axios.get<BioCollectSurvey[]>(
        `${import.meta.env.VITE_API_BIOCOLLECT}/ws/survey/list/${projectId}`
      );

      await db.surveys.bulkPut(data);

      return data;
    } else {
      return await db.surveys.where('projectId').equals(projectId).toArray();
    }
  },

  searchActivities: async (
    view: BioCollectBioActivityView,
    filters?: FilterQueries
  ): Promise<BioCollectBioActivitySearch> => {
    if (navigator.onLine) {
      // Transform the FilterQueries object
      const params = new URLSearchParams({
        view,
        ...(filters || {}),
      });

      // Make the GET request
      const { data } = await axios.get<BioCollectBioActivitySearch>(
        `${
          import.meta.env.VITE_API_BIOCOLLECT
        }/ws/bioactivity/search?${params.toString()}`
      );

      // await db.surveys.bulkPut(data);

      return data;
    } else {
      return { activities: [] };
    }
  },
});

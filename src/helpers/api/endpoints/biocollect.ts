import axios from 'axios';

// Helpers
import { toQueryString } from '#/helpers/funcs';
import type {
  BioCollectBioActivitySearch,
  BioCollectBioActivityView,
  BioCollectHub,
  BioCollectProject,
  BioCollectProjectSearch,
  BioCollectSurvey,
  FilterQueries,
} from '#/types';

// Local classes
import { BioCollectDexie } from '../dexie';
import { getHubId } from '#/helpers/funcs/useHub';

const escapeRegExp = (input: string) => input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const filterActiveSurveys = (surveys: BioCollectSurvey[], userIsProjectMember = false) =>
  surveys?.filter(
    ({ startDate, endDate, published, publicAccess }) =>
      new Date(startDate).getTime() <= Date.now() &&
      (!endDate || new Date(endDate).getTime() >= Date.now()) &&
      (published !== undefined ? published : true) &&
      (userIsProjectMember || publicAccess === true),
  ) || [];

const formatProject = (project: BioCollectProject) => ({
  ...project,
  name: project.name.trim(),
  projectActivities: filterActiveSurveys(
    project.projectActivities,
    project.userIsProjectMember === true,
  ),
});

const formatProjects = (projects: BioCollectProject[]) => {
  return projects.map((project) => formatProject(project));
};

const formatProjectSearch = (search: BioCollectProjectSearch) => ({
  ...search,
  projects: formatProjects(search.projects),
});

const replaceProjectSurveys = async (
  db: BioCollectDexie,
  projectIds: string[],
  surveys: BioCollectSurvey[],
) => {
  const surveyIds = new Set(surveys.map(({ id }) => id));

  await db.surveys
    .where('projectId')
    .anyOf(projectIds)
    .filter(({ id }) => !surveyIds.has(id))
    .delete();
  await db.surveys.bulkPut(surveys);
};

type BioCollectProjectSort = 'dateCreatedSort' | 'nameSort' | '_score' | 'organisationSort';

export default (db: BioCollectDexie) => ({
  projectSearch: async (
    offset = 0,
    max = 30,
    sort: BioCollectProjectSort | string = 'dateCreatedSort',
    isUserPage = false,
    search?: string,
    hasDownloadedSurveys = true,
  ): Promise<BioCollectProjectSearch> => {
    const hubId = getHubId();

    if (navigator.onLine && !hasDownloadedSurveys) {
      // Define basic query parameters
      const params = new URLSearchParams({
        fq: 'isExternal:F',
        initiator: 'biocollect',
        sort,
        mobile: 'true',
        max: max.toString(),
        offset: offset.toString(),
        isUserPage: isUserPage.toString(),
        hub: hubId,
      });

      // Append public projects filter query
      params.append('fq', 'allParticipants:ALL');

      // Append user search
      if (search && search.length > 0) {
        const searchQuery = `*${search.toLocaleLowerCase()}*`;
        params.append('q', searchQuery);
        params.append('queryText', searchQuery);
      }

      // Make the GET request
      const { data } = await axios.get<BioCollectProjectSearch>(
        `${import.meta.env.VITE_API_BIOCOLLECT}/ws/project/search?${params.toString()}`,
      );
      const formattedSearch = await formatProjectSearch(data);
      const surveys = formattedSearch.projects.flatMap(
        ({ projectActivities }) => projectActivities || [],
      );

      // Add the hub ID to the stored projects
      formattedSearch.projects.forEach((project) => {
        project.hub = hubId;
      });

      const projectIds = formattedSearch.projects.map(({ projectId }) => projectId);

      // User-page searches return both public and member projects, so an unfiltered search that
      // fits on one page lists every project the user can currently access in this hub
      const isCompleteListing =
        isUserPage &&
        offset === 0 &&
        !search &&
        formattedSearch.projects.length >= formattedSearch.total;

      // Store the projects & surveys in IDB, removing any that are no longer returned
      await db.transaction('rw', db.projects, db.surveys, db.cached, async () => {
        await db.projects.bulkPut(formattedSearch.projects);
        await replaceProjectSurveys(db, projectIds, surveys);

        if (isCompleteListing) {
          // Projects with downloaded surveys are kept so they stay reachable offline
          const returnedIds = new Set(projectIds);
          const downloadedIds = new Set(await db.cached.orderBy('projectId').uniqueKeys());
          const staleIds = await db.projects
            .filter(
              ({ projectId, hub }) =>
                hub === hubId && !returnedIds.has(projectId) && !downloadedIds.has(projectId),
            )
            .primaryKeys();

          await db.projects.bulkDelete(staleIds);
          await db.surveys.where('projectId').anyOf(staleIds).delete();
        }
      });

      return formattedSearch;
    } else {
      // Fix for WebKit empty DB issue
      // https://github.com/dexie/Dexie.js/issues/1052
      if (hasDownloadedSurveys && (await db.cached.count()) === 0) {
        return {
          facets: [],
          total: 0,
          projects: [],
        };
      }

      // Create the base collection query
      let query = db.projects.toCollection();

      // Append the hub
      query.and(({ hub }) => hubId === hub);

      // Append the search query
      if (search && search.length > 0)
        query = query.and(({ name }) => new RegExp(`.*${escapeRegExp(search)}.*`).test(name));

      // Only include projects that still list at least one downloaded survey
      if (hasDownloadedSurveys) {
        const downloadedSurveyIds = new Set(await db.cached.toCollection().primaryKeys());

        query = query.and(({ projectActivities }) =>
          projectActivities.some(({ id }) => downloadedSurveyIds.has(id)),
        );
      }

      // Count before paging, as offset() and limit() modify the collection in place
      const total = await query.count();
      const projects = await query.offset(offset).limit(max).toArray();

      return {
        facets: [],
        total,
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
      const { data } = await axios.get<BioCollectProject>(
        `${import.meta.env.VITE_API_BIOCOLLECT}/ws/project/${projectId}`,
      );

      return formatProject(data);
    }

    return null;
  },

  listSurveys: async (
    projectId: string,
    userIsProjectMember = false,
  ): Promise<BioCollectSurvey[]> => {
    if (navigator.onLine) {
      // Make the GET request
      const { data } = await axios.get<BioCollectSurvey[]>(
        `${import.meta.env.VITE_API_BIOCOLLECT}/ws/survey/list/${projectId}`,
      );

      // Filter out non-active surveys (not within date range)
      const surveys = filterActiveSurveys(data, userIsProjectMember);

      // The endpoint also returns an empty list (or null) when the server fails to load the project,
      // so an empty response can't be trusted to clear the cache
      if (data?.length > 0) {
        await db.transaction('rw', db.projects, db.surveys, async () => {
          await replaceProjectSurveys(db, [projectId], surveys);
          await db.projects.update(projectId, { projectActivities: surveys });
        });
      }

      return surveys;
    } else {
      return await db.surveys.where('projectId').equals(projectId).toArray();
    }
  },

  searchActivities: async (
    view: BioCollectBioActivityView,
    filters: FilterQueries = {},
  ): Promise<BioCollectBioActivitySearch> => {
    if (navigator.onLine) {
      const base = `${import.meta.env.VITE_API_BIOCOLLECT}/ws/bioactivity/search`;

      //Transform the FilterQueries object
      const qs = toQueryString({ view, ...filters });
      const url = `${base}?${qs}`;

      // Make the GET request
      const { data } = await axios.get<BioCollectBioActivitySearch>(url);
      await db.activities.bulkPut(data.activities);
      return data;
    } else {
      return { activities: [] };
    }
  },

  listHubs: async (): Promise<BioCollectHub[]> => {
    if (navigator.onLine) {
      const { data } = await axios.get<BioCollectHub[]>(
        `${import.meta.env.VITE_API_BIOCOLLECT}/ws/hub/pwaList`,
      );
      await db.hubs.bulkPut(data);
      return data;
    } else {
      return db.hubs.toArray();
    }
  },

  deleteActivity: async (activityId: string): Promise<void> => {
    if (navigator.onLine) {
      await axios.delete(
        `${import.meta.env.VITE_API_BIOCOLLECT}/ws/bioactivity/delete/${activityId}`,
      );
    }
  },
});

import { Router, Request, Response, NextFunction } from 'express';
import { tryCatch } from '../utils/try-catch';
import logger from '../config/logger';
import {
  getDashboardInfo,
  getProjectsData,
  getProjectByIdData,
  createProjectData,
  updateProjectData,
  deleteProjectData,
  getSourcesData,
  getSourceByIdData,
  createSourceData,
  updateSourceData,
  deleteSourceData,
  getDestinationsData,
  getDestinationByIdData,
  createDestinationData,
  updateDestinationData,
  deleteDestinationData,
} from '../controllers/api.controller';

const router = Router();

// Dashboard routes
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Fetching dashboard information`);

  const { data, error } = await tryCatch(getDashboardInfo());

  if (error) {
    logger.error(`Error in fetching the dashboard data `, error);
    res.json({
      status: false,
      message: `Unable to fetch the dashboard data. ${error?.message}`,
      error: error,
    });
    return;
  }

  res.json({ status: true, message: `Successfully fetched the dashboard data`, data: data });
});

// Project routes
router.get('/projects', async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Fetching projects information`);

  const {
    search = '',
    page = 1,
    limit = 100,
  } = req.query as {
    search?: string;
    page?: number;
    limit?: number;
  };

  const { data, error } = await tryCatch(getProjectsData({ search, page, limit }));

  if (error) {
    logger.error(`Error in fetching the project data `, error);
    res.json({
      status: false,
      message: `Unable to fetch the project data. ${error?.message}`,
      error: error,
    });
    return;
  }

  res.json({ status: true, message: `Successfully fetched the project data`, data: data });
});

// Get one project by ID
router.get('/projects/:id', async (req, res) => {
  const id = BigInt(req.params.id);
  const { data, error } = await tryCatch(getProjectByIdData(id));
  if (error) {
    logger.error(`Error in fetching project `, error);
    return res.status(404).json({ status: false, message: 'Project not found', error });
  }
  res.json({ status: true, message: 'Fetched project', data });
});

// Create a new project
router.post('/projects', async (req, res) => {
  const { name, description, retentionDays } = req.body;
  const userId = BigInt(req.body.userId);
  const { data, error } = await tryCatch(
    createProjectData({ name, description, userId, retentionDays }),
  );
  if (error) {
    logger.error(`Error in creating project `, error);
    return res.status(400).json({ status: false, message: 'Unable to create project', error });
  }
  res.status(201).json({ status: true, message: 'Project created', data });
});

// Update a project
router.put('/projects/:id', async (req, res) => {
  const id = BigInt(req.params.id);
  const { name, description, retentionDays } = req.body;
  const { data, error } = await tryCatch(
    updateProjectData(id, { name, description, retentionDays }),
  );
  if (error) {
    logger.error(`Error in updating project `, error);
    return res.status(400).json({ status: false, message: 'Unable to update project', error });
  }
  res.json({ status: true, message: 'Project updated', data });
});

// Delete a project
router.delete('/projects/:id', async (req, res) => {
  const id = BigInt(req.params.id);
  const { data, error } = await tryCatch(deleteProjectData(id));
  if (error) {
    logger.error(`Error in deleting project `, error);
    return res.status(400).json({ status: false, message: 'Unable to delete project', error });
  }
  res.json({ status: true, message: 'Project deleted', data });
});

// Source routes
router.get('/sources', async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Fetching sources information`);

  const {
    search = '',
    page = 1,
    limit = 100,
  } = req.query as {
    search?: string;
    page?: number;
    limit?: number;
  };

  const { data, error } = await tryCatch(getSourcesData({ search, page, limit }));

  if (error) {
    logger.error(`Error in fetching the source data `, error);
    res.json({
      status: false,
      message: `Unable to fetch the source data. ${error?.message}`,
      error: error,
    });
    return;
  }

  res.json({ status: true, message: `Successfully fetched the source data`, data: data });
});

// Get one source by ID
router.get('/sources/:id', async (req, res) => {
  const id = BigInt(req.params.id);
  const { data, error } = await tryCatch(getSourceByIdData(id));
  if (error) {
    logger.error(`Error in fetching the source data `, error);
    return res.status(404).json({ status: false, message: 'Source not found', error });
  }
  res.json({ status: true, message: 'Fetched source', data });
});

// Create a new source
router.post('/sources', async (req, res) => {
  const { projectId, name, token, urlPath, status } = req.body;
  const { data, error } = await tryCatch(
    createSourceData({
      projectId: BigInt(projectId),
      name,
      token,
      urlPath,
      status,
    }),
  );
  if (error) {
    logger.error(`Error in creating the source data `, error);
    return res.status(400).json({ status: false, message: 'Unable to create source', error });
  }
  res.status(201).json({ status: true, message: 'Source created', data });
});

// Update a source
router.put('/sources/:id', async (req, res) => {
  const id = BigInt(req.params.id);
  const { name, urlPath, status } = req.body;
  const { data, error } = await tryCatch(updateSourceData(id, { name, urlPath, status }));
  if (error) {
    logger.error(`Error in updating the source data `, error);
    return res.status(400).json({ status: false, message: 'Unable to update source', error });
  }
  res.json({ status: true, message: 'Source updated', data });
});

// Delete a source
router.delete('/sources/:id', async (req, res) => {
  const id = BigInt(req.params.id);
  const { data, error } = await tryCatch(deleteSourceData(id));
  if (error) {
    logger.error(`Error in deleting the source data `, error);
    return res.status(400).json({ status: false, message: 'Unable to delete source', error });
  }
  res.json({ status: true, message: 'Source deleted', data });
});

// Destination routes
router.get('/destinations', async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Fetching destinations information`);

  const {
    search = '',
    page = 1,
    limit = 100,
  } = req.query as {
    search?: string;
    page?: number;
    limit?: number;
  };

  const { data, error } = await tryCatch(getDestinationsData({ search, page, limit }));

  if (error) {
    logger.error(`Error in fetching the destination data `, error);
    res.json({
      status: false,
      message: `Unable to fetch the destination data. ${error?.message}`,
      error: error,
    });
    return;
  }

  res.json({ status: true, message: `Successfully fetched the destination data`, data: data });
});

// Get one destination by ID
router.get('/destinations/:id', async (req, res) => {
  const id = BigInt(req.params.id);
  const { data, error } = await tryCatch(getDestinationByIdData(id));
  if (error) {
    logger.error(`Error in fetching the destination data `, error);
    return res.status(404).json({ status: false, message: 'Destination not found', error });
  }
  res.json({ status: true, message: 'Fetched destination', data });
});

// Create a new destination
router.post('/destinations', async (req, res) => {
  const { projectId, name, url, secret, retryPolicy, timeoutMs, status } = req.body;
  const { data, error } = await tryCatch(
    createDestinationData({
      projectId: BigInt(projectId),
      name,
      url,
      secret,
      retryPolicy,
      timeoutMs,
      status,
    }),
  );
  if (error) {
    logger.error(`Error in updating the destination data `, error);
    return res.status(400).json({ status: false, message: 'Unable to create destination', error });
  }
  res.status(201).json({ status: true, message: 'Destination created', data });
});

// Update a destination
router.put('/destinations/:id', async (req, res) => {
  const id = BigInt(req.params.id);
  const { name, url, retryPolicy, timeoutMs, status } = req.body;
  const { data, error } = await tryCatch(
    updateDestinationData(id, { name, url, retryPolicy, timeoutMs, status }),
  );
  if (error) {
    logger.error(`Error in fetching the destination data `, error);
    return res.status(400).json({ status: false, message: 'Unable to update destination', error });
  }
  res.json({ status: true, message: 'Destination updated', data });
});

// Delete a destination
router.delete('/destinations/:id', async (req, res) => {
  const id = BigInt(req.params.id);
  const { data, error } = await tryCatch(deleteDestinationData(id));
  if (error) {
    logger.error(`Error in deleting the destination data `, error);
    return res.status(400).json({ status: false, message: 'Unable to delete destination', error });
  }
  res.json({ status: true, message: 'Destination deleted', data });
});

export default router;

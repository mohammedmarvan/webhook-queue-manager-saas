import { Router, Request, Response, NextFunction } from 'express';
import { tryCatch } from '../utils/try-catch';
import logger from '../config/logger';
import { getDashboardInfo } from '../controllers/api.controller';
import { getProjectsData, getProjectByIdData, createProjectData, updateProjectData, deleteProjectData } from '../controllers/api.controller';

const router = Router();

router.get(
  '/dashboard',
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Fetching dashboard information`);

    const { data, error } = await tryCatch(getDashboardInfo());

    if (error) {
        logger.error(`Error in fetching the dashboard data `,error);
        res.json({ status: false, message: `Unable to fetch the dashboard data. ${error?.message}`, error: error });
        return;
    }

    res.json({ status: true, message: `Successfully fetched the dashboard data`, data: data });
  },
);

router.get('/projects',
    async(req: Request, res: Response, next: NextFunction) => {
        logger.info(`Fetching projects information`);

        const { search = "", page = 1, limit = 100 } = req.query as {
            search?: string
            page?: number
            limit?: number
          }

        const { data, error } = await tryCatch(getProjectsData({ search, page, limit}));

        if (error) {
            logger.error(`Error in fetching the project data `,error);
            res.json({ status: false, message: `Unable to fetch the project data. ${error?.message}`, error: error });
            return;
        }

        res.json({ status: true, message: `Successfully fetched the project data`, data: data });
    },
);

// Get one project by ID
router.get("/projects/:id", async (req, res) => {
    const id = BigInt(req.params.id)
    const { data, error } = await tryCatch(getProjectByIdData(id))
    if (error) {
      return res.status(404).json({ status: false, message: "Project not found", error })
    }
    res.json({ status: true, message: "Fetched project", data })
  })
  
  // Create a new project
  router.post("/projects", async (req, res) => {
    const { name, description } = req.body
    const userId = BigInt(req.body.userId);
    const { data, error } = await tryCatch(createProjectData({ name, description, userId }))
    if (error) {
      return res.status(400).json({ status: false, message: "Unable to create project", error })
    }
    res.status(201).json({ status: true, message: "Project created", data })
  })
  
  // Update a project
  router.put("/projects/:id", async (req, res) => {
    const id = BigInt(req.params.id)
    const { name, description } = req.body
    const { data, error } = await tryCatch(updateProjectData(id, { name, description }))
    if (error) {
      return res.status(400).json({ status: false, message: "Unable to update project", error })
    }
    res.json({ status: true, message: "Project updated", data })
  })
  
  // Delete a project
  router.delete("/projects/:id", async (req, res) => {
    const id = BigInt(req.params.id)
    const { data, error } = await tryCatch(deleteProjectData(id))
    if (error) {
      return res.status(400).json({ status: false, message: "Unable to delete project", error })
    }
    res.json({ status: true, message: "Project deleted", data })
  })

export default router;

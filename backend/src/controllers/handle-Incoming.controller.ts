import { Request } from 'express';
import logger from '../config/logger';
import { tryCatch } from '../utils/try-catch';
import { getProject } from '../db/project-repo';
import { getActiveSource } from '../db/source-repo';
import { addEvent } from '../services/event-service';

type param = string | null | undefined;

export default async function handleIncomingController(
  req: Request,
  projectName: param,
  sourceName: param,
) {
  if (!req || !projectName || !sourceName) return null;
  const body = req.body;

  const { data: project, error: projectError } = await tryCatch(getProject(projectName));

  if (projectError) {
    logger.error(`Error in handleIncomingController `, projectError);
    throw projectError;
  }

  if (!project) {
    throw new Error(`No project found with this name ${projectName} | ${sourceName}`);
  }

  const { data: source, error: sourceError } = await tryCatch(
    getActiveSource(sourceName, project.id),
  );

  if (sourceError) {
    logger.error(`Error in handleIncomingController `, sourceError);
    throw sourceError;
  }

  if (!source) {
    throw new Error(`No source found for this project ${projectName} | source: ${sourceName}`);
  }

  const event = await addEvent({
    projectId: project.id,
    sourceId: source.id,
    payload: req.body,
    headers: req.headers,
  });

  return event.eventUid;
}

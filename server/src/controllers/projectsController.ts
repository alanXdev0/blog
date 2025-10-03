import { Request, Response } from 'express';
import {
  listProjects,
  listAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../db/projectRepository';

export const listProjectsHandler = (_req: Request, res: Response) => {
  res.json(listProjects());
};

export const listAdminProjectsHandler = (_req: Request, res: Response) => {
  res.json(listAllProjects());
};

export const createProjectHandler = (req: Request, res: Response) => {
  const project = createProject(req.body);
  res.status(201).json(project);
};

export const updateProjectHandler = (req: Request, res: Response) => {
  const project = updateProject(req.params.id, req.body);
  res.json(project);
};

export const deleteProjectHandler = (req: Request, res: Response) => {
  deleteProject(req.params.id);
  res.status(204).end();
};

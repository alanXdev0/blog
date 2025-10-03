import { Router } from 'express';
import { listPublicPosts, getPublicPost } from '../controllers/postsController';
import { listProjectsHandler } from '../controllers/projectsController';
import { listTaxonomyHandler } from '../controllers/taxonomyController';

export const publicRouter = Router();

publicRouter.get('/posts', listPublicPosts);
publicRouter.get('/posts/:id', getPublicPost);
publicRouter.get('/projects', listProjectsHandler);
publicRouter.get('/taxonomy', listTaxonomyHandler);

export default publicRouter;

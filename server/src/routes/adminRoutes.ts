import { Router } from 'express';
import {
  listAdminPosts,
  getAdminPost,
  createAdminPost,
  postValidators,
  updateAdminPost,
  deleteAdminPostHandler,
  publishAdminPost,
} from '../controllers/postsController';
import { mediaUpload, uploadMediaHandler, listMediaHandler } from '../controllers/mediaController';
import {
  listAdminProjectsHandler,
  createProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
} from '../controllers/projectsController';
import {
  listTaxonomyHandler,
  createCategoryHandler,
  deleteCategoryHandler,
  createTagHandler,
  deleteTagHandler,
  taxonomyValidators,
} from '../controllers/taxonomyController';
import { requireAuth } from '../middleware/auth';

export const adminRouter = Router();

adminRouter.use(requireAuth);

adminRouter.get('/posts', listAdminPosts);
adminRouter.get('/posts/:id', getAdminPost);
adminRouter.post('/posts', postValidators, createAdminPost);
adminRouter.put('/posts/:id', postValidators, updateAdminPost);
adminRouter.patch('/posts/:id/publish', publishAdminPost);
adminRouter.delete('/posts/:id', deleteAdminPostHandler);

adminRouter.get('/projects', listAdminProjectsHandler);
adminRouter.post('/projects', createProjectHandler);
adminRouter.put('/projects/:id', updateProjectHandler);
adminRouter.delete('/projects/:id', deleteProjectHandler);

adminRouter.get('/media', listMediaHandler);
adminRouter.post('/media', mediaUpload.single('file'), uploadMediaHandler);

adminRouter.get('/taxonomy', listTaxonomyHandler);
adminRouter.post('/taxonomy/categories', taxonomyValidators.category, createCategoryHandler);
adminRouter.delete('/taxonomy/categories/:id', deleteCategoryHandler);
adminRouter.post('/taxonomy/tags', taxonomyValidators.tag, createTagHandler);
adminRouter.delete('/taxonomy/tags/:id', deleteTagHandler);

export default adminRouter;

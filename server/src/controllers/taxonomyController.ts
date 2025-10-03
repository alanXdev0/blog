import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { listCategories, createCategory, deleteCategory } from '../db/categoryRepository';
import { listTags, createTag, deleteTag } from '../db/tagRepository';

export const taxonomyValidators = {
  category: [body('name').isLength({ min: 2 }).withMessage('Category name is required')],
  tag: [body('name').isLength({ min: 2 }).withMessage('Tag name is required')],
};

export const listTaxonomyHandler = (_req: Request, res: Response) => {
  res.json({ categories: listCategories(), tags: listTags() });
};

export const createCategoryHandler = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const category = createCategory(req.body.name);
  res.status(201).json(category);
};

export const deleteCategoryHandler = (req: Request, res: Response) => {
  deleteCategory(req.params.id);
  res.status(204).end();
};

export const createTagHandler = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const tag = createTag({ name: req.body.name, color: req.body.color });
  res.status(201).json(tag);
};

export const deleteTagHandler = (req: Request, res: Response) => {
  deleteTag(req.params.id);
  res.status(204).end();
};

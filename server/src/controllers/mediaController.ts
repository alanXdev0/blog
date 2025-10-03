import path from 'node:path';
import fs from 'node:fs';
import { Request, Response } from 'express';
import multer from 'multer';
import { customAlphabet } from 'nanoid';
import { addMediaAsset, listMediaAssets } from '../db/mediaRepository';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 16);

const uploadDir = path.resolve(process.cwd(), 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${nanoid()}${ext}`);
  },
});

export const mediaUpload = multer({ storage });

export const uploadMediaHandler = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const asset = addMediaAsset({
    filename: req.file.originalname,
    url: `/uploads/${req.file.filename}`,
    size: req.file.size,
  });
  res.status(201).json(asset);
};

export const listMediaHandler = (_req: Request, res: Response) => {
  res.json(listMediaAssets());
};

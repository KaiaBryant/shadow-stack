import express from 'express';
import { getQuestionByLevel, getQuestionsBatch } from '../controllers/questionsController.js';

const router = express.Router();

// Batch route with 'batch' keyword first
router.get('/batch/:level', getQuestionsBatch);

// Single question route
router.get('/:level', getQuestionByLevel);

export default router;
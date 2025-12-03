import express from 'express';
import { getLeaderboard, submitScore, checkLevelCompletion } from '../controllers/leaderboardController.js';

const router = express.Router();

// GET /api/leaderboard
router.get('/', getLeaderboard);              
// GET /api/leaderboard/check-completion
router.get('/check-completion', checkLevelCompletion);  
// POST /api/leaderboard
router.post('/', submitScore);                

export default router;
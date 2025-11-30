//Simulation questions route
import express from "express";
import { getQuestionByLevel } from "../controllers/questionsController.js";

const router = express.Router();

router.get("/:level", getQuestionByLevel);

export default router;

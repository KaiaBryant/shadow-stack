import express from "express";
import {
    startSession,
    updateSession,
    endSession
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/start", startSession);
router.put("/update", updateSession);
router.put("/end", endSession);

export default router;

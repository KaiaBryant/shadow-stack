import express from "express";
import {
    startSession,
    updateSession,
    endSession,
    expireOldSessions
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/start", startSession);
router.put("/update", updateSession);
router.put("/end", endSession);
router.put("/expire-old", expireOldSessions);


export default router;

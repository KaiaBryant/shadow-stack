//Users route
import express from "express";
import { createUser, updateUserCharacter } from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);
router.put("/character", updateUserCharacter);

export default router;

//Character route with exports from characterController.js
import express from "express";
import { getCharacters, selectCharacter } from "../controllers/characterController.js";

const router = express.Router();

router.get("/", getCharacters);
router.post("/select", selectCharacter);

export default router;

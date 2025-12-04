//Users route
import express from "express";
import { createUser, getUserById, updateUserCharacter } from "../controllers/userController.js";

const router = express.Router();

// POST /api/users - Create new user
router.post("/", createUser);

// GET /api/users/:id - Get user by ID
router.get("/:id", getUserById);

// PUT /api/users/character - Update user's character
router.put("/character", updateUserCharacter);

export default router;
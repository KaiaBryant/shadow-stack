// Admin route for login and admin access in account
import express from "express";
import { adminLogin } from "../controllers/adminController.js";
import { verifyAdmin } from "../middleware/authAdmin.js";

// Controllers used by admin
import { getAllUsers } from "../controllers/userController.js";
import { getAllSessions } from "../controllers/sessionController.js";

const router = express.Router();

// Public route (no auth)
router.post("/login", adminLogin);

// Protected admin routes
router.get("/users", verifyAdmin, getAllUsers);
router.get("/sessions", verifyAdmin, getAllSessions);

export default router;

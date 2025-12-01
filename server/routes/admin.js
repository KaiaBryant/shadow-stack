// Admin route for login and admin access
import express from "express";
import { adminLogin, createAdmin, adminGetAllUsers, adminGetAllSessions, adminDeleteUser }
    from "../controllers/adminController.js";

import { verifyAdmin } from "../middleware/authAdmin.js";

const router = express.Router();

// Public route
router.post("/login", adminLogin);

// Protected admin routes
router.get("/users", verifyAdmin, adminGetAllUsers);         // View all users
router.get("/sessions", verifyAdmin, adminGetAllSessions);   // View all sessions
router.delete("/users/:id", verifyAdmin, adminDeleteUser);   // Delete a user
router.post("/create-admin", verifyAdmin, createAdmin);      // Create new admin

export default router;

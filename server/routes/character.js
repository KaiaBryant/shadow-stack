import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
    pool.query("SELECT * FROM characters ORDER BY id ASC", (err, rows) => {
        if (err) {
            console.error("Error loading characters:", err);
            return res.status(500).json({ error: "Failed to load characters" });
        }

        const characters = rows.map(c => ({
            ...c,
            url: `/assets/avatars/${c.character_url}`
        }));

        res.json(characters);
    });
});

export default router;





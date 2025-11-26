import connection from "../db.js";

// GET /api/characters
export const getCharacters = (req, res) => {
    const query = "SELECT * FROM characters";

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching characters:", err);
            return res.status(500).json({ error: "Failed loading characters" });
        }

        return res.json(results);
    });
};

// POST /api/characters/select
export const selectCharacter = (req, res) => {
    const { username, characterId } = req.body;

    if (!username || !characterId) {
        return res.status(400).json({ error: "Username and characterId are required" });
    }

    const query = `
        UPDATE users
        SET character_id = ?
        WHERE username = ?
    `;

    connection.query(query, [characterId, username], (err, result) => {
        if (err) {
            console.error("Error saving character:", err);
            return res.status(500).json({ error: "Failed to save character selection" });
        }

        return res.json({ message: "Character selected", username, characterId });
    });
};


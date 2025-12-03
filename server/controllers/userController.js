// // Users table retreival
// import pool from "../db.js";

// // POST /api/users
// export const createUser = (req, res) => {
//     const { username } = req.body;

//     if (!username) {
//         return res.status(400).json({ error: "Username is required" });
//     }

//     const query = `
//     INSERT INTO users (username)
//     VALUES (?)
//   `;

//     pool.query(query, [username], (err, result) => {
//         if (err) {

//             if (err.code === "ER_DUP_ENTRY") {
//                 // Username exists -> fetch its user_id
//                 pool.query(
//                     "SELECT id FROM users WHERE username = ?",
//                     [username],
//                     (err2, rows) => {
//                         if (err2) {
//                             return res
//                                 .status(500)
//                                 .json({ error: "Failed to fetch existing user" });
//                         }

//                         return res.status(409).json({
//                             error: "USERNAME_EXISTS",
//                             existing_user_id: rows[0].id,
//                         });
//                     }
//                 );

//                 return;
//             }
//             console.error("Error creating user:", err);
//             return res.status(500).json({ error: "Failed to create user" });
//         }

//         return res.json({ id: result.insertId, username });
//     });
// };

// // Update users character of choice
// export const updateUserCharacter = (req, res) => {
//     const { user_id, character_id } = req.body;

//     if (!user_id || !character_id) {
//         return res.status(400).json({ error: "user_id and character_id required" });
//     }

//     const query = `
//     UPDATE users
//     SET character_id = ?
//     WHERE id = ?
//   `;

//     pool.query(query, [character_id, user_id], (err) => {
//         if (err) {
//             console.error("Error updating character:", err);
//             return res.status(500).json({ error: "Failed to save character" });
//         }

//         res.json({ message: "Character saved!" });
//     });
// };


// GET /api/admin/users   ← Admin-only
// export const getAllUsers = (req, res) => {
//     const query = `
//         SELECT id, username, character_id, created_at
//         FROM users
//         ORDER BY created_at DESC
//     `;

//     pool.query(query, (err, results) => {
//         if (err) {
//             if (err.code === "ER_DUP_ENTRY") {
//                 return res.status(409).json({ error: "USERNAME_EXISTS" });
//             }

//             console.error("Error creating user:", err);
//             return res.status(500).json({ error: "Failed to create user" });

//             return res.json(results);
//         });
// };

// server/controllers/userController.js
import pool from "../db.js";

// CREATE USER (already exists)
export const createUser = (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    pool.query(
        "INSERT INTO users (username) VALUES (?)",
        [username],
        (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    pool.query(
                        "SELECT id FROM users WHERE username = ?",
                        [username],
                        (err2, rows) => {
                            if (err2) {
                                return res.status(500).json({ error: "Failed to fetch user" });
                            }

                            return res.status(409).json({
                                error: "USERNAME_EXISTS",
                                existing_user_id: rows[0].id
                            });
                        }
                    );
                    return;
                }

                return res.status(500).json({ error: "Failed to create user" });
            }

            return res.json({ id: result.insertId, username });
        }
    );
};

// UPDATE USER CHARACTER (this is your function)
export const updateUserCharacter = (req, res) => {
    const { user_id, character_id } = req.body;

    if (!user_id || !character_id) {
        return res.status(400).json({ error: "user_id and character_id required" });
    }

    pool.query(
        "UPDATE users SET character_id = ? WHERE id = ?",
        [character_id, user_id],
        (err, result) => {
            if (err) {
                console.error("Error updating character:", err);
                return res.status(500).json({ error: "Failed to save character" });
            }

            return res.json({ message: "Character saved!" });
        }
    );
};

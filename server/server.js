import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import questionsRoute from "./routes/questions.js";
import usersRoute from "./routes/users.js";
import characterRoutes from "./routes/character.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import sessionRoutes from "./routes/session.js";
import adminRoutes from "./routes/admin.js";
import adminRegisterRoutes from "./routes/adminRegister.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


// ----------- ROUTES ------------

app.use("/api/questions", questionsRoute);
app.use("/api/users", usersRoute);
app.use("/api/characters", characterRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminRegisterRoutes);

// --------- START SERVER ---------
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
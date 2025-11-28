import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Missing authorization header" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }

        req.admin = admin;
        next();
    });
};

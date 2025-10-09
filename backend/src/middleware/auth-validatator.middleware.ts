import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export function authValidator(req: Request, res: Response, next: NextFunction) {
    try {
        const apiKey = req.header("X-API-Key");
        const expectedKey = process.env.X_API_KEY;

        if (!expectedKey) {
            logger.error("API_KEY not configured in environment");
            return res.status(500).json({ error: "Server misconfiguration" });
        }

        if (!apiKey || apiKey !== expectedKey) {
            logger.warn("Unauthorized access attempt with invalid API key");
            return res.status(401).json({ error: "Not valid API key" });
        }

        next();
    } catch (err) {
        logger.error("Error in authValidator middleware", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

import type { Request, Response, NextFunction } from "express";
import db from "../lib/drizzle.js";
import User from "../db/schema/user.js";
import { eq } from "drizzle-orm";

async function show_profile(req: Request, res: Response, next: NextFunction) {

    try {

        const user = req.user;

        return res.status(200).json(user);

    } catch (error) {
        next(error);
    }

}

export {
    show_profile
};

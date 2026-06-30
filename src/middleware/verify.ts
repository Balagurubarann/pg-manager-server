import type { Response, Request, NextFunction } from "express"; 
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import "dotenv/config";

declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload;
        }
    }
}

async function authenticate_user(req: Request, res: Response, next: NextFunction) {

    try {

        const token = req.headers?.authorization?.split(" ")[1];

        if (!token) {
            return res.status(403).json({
                message: "Access Forbidden"
            });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized Access, Expired or Invalid token"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        next(error);
        return res.status(500).json({
            message: "Something went wrong! Unable to verify user"
        })
    }

}

export {
    authenticate_user
};

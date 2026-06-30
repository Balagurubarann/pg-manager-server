import db from "../lib/drizzle.js";
import User from "../db/schema/user.js";
import type { Request, Response, NextFunction } from "express";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { IRegisterBody } from "../interfaces/auth.interface.js"

async function register(req: Request, res: Response, next: NextFunction) {

    try {

        const {
            first_name,
            email,
            last_name, 
            password, 
            phone
        }: IRegisterBody = req.body;

        if (!first_name || !last_name || !email || !phone || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const [existing_user] = await db.select().from(User)
            .where(
                or(
                    eq(User.email, email),
                    eq(User.phone, phone)
                )
            )
            .limit(1);

        if (existing_user) {
            return res.status(409).json({
                message: "User email or phone number already exists!"
            });
        }

        const hashed_password = await bcrypt.hash(password, 10);

        await db.insert(User).values({
            first_name,
            last_name,
            email,
            password: hashed_password,
            phone
        });

        return res.status(201).json({
            message: "User created successfully"
        });

    } catch (error) {

        next(error);
        
        return res.status(500).json({
            message: "Error happened while registering user"
        });
    }

};

async function login(req: Request, res: Response, next: NextFunction) {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const [existing_user] = await db.select().from(User)
            .where(eq(User.email, email)).limit(1);

        if (!existing_user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const auth_user = await bcrypt.compare(password, existing_user.password);

        if (!auth_user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const payload = {
            id: existing_user.id,
            first_name: existing_user.first_name,
            last_name: existing_user.last_name,
            email: existing_user.email
        }

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET!,
            { expiresIn: '2h'}
        );

        res.cookie('access_token', token);

        return res.status(200).json({
            message: "User logged in successful"
        });

    } catch (error) {
        next(error);

        if (error instanceof Error) {
            return res.status(500).json({
                message: "Error happened while logging in."
            });
        }
        
        return res.status(500).json({
            message: "Error happened while logging in."
        });
    }

};

export {
    register,
    login
};

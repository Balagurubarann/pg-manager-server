import express from "express";
import type { Application, Request, Response } from "express";

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";

const app: Application = express();

app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);

app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({
        message: "PG manager running successfully"
    });
});

export default app;

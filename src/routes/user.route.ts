import { Router } from "express";
import { showProfile } from "../controllers/user.controller.js";
import { authenticateUser } from "../middleware/verify.js"

const router: Router = Router();

router.use(authenticateUser);

router
    .get('/profile', showProfile)

export default router;

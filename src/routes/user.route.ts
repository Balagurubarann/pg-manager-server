import { Router } from "express";
import { show_profile } from "../controllers/user.controller.js";
import { authenticate_user } from "../middleware/verify.js"

const router: Router = Router();

router.use(authenticate_user);

router
    .get('/profile', show_profile)

export default router;

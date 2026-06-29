import { Router } from "express";
import { show_profile } from "../controllers/user.controller.js"

const router: Router = Router();

router
    .post('/profile', show_profile)
    
export default router;

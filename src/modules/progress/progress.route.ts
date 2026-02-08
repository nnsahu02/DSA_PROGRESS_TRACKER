import { Router } from "express";
import {
    markCompleted,
    unmarkCompleted,
    getMyProgress
} from "./progress.controller.ts";
import { authentication } from "../../middlewares/auth.middleware.ts";

const ProgressRouter = Router();

ProgressRouter.post("/complete", authentication, markCompleted);
ProgressRouter.post("/uncomplete", authentication, unmarkCompleted);
ProgressRouter.get("/me", authentication, getMyProgress);

export default ProgressRouter;

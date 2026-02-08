import { Router } from "express";
import { getProblemsByTopic } from "./problem.controller.ts";
import { authentication } from "../../middlewares/auth.middleware.ts";

const problemRouter = Router();

problemRouter.get("/topic/:topicId", authentication, getProblemsByTopic);

export default problemRouter;

import { Router } from "express";
import { getProblemsByTopic, getProblemsByTopicWithProgress } from "./problem.controller.ts";
import { authentication } from "../../middlewares/auth.middleware.ts";

const problemRouter = Router();

problemRouter.get("/v1/topic/:topicId", authentication, getProblemsByTopic);
problemRouter.get("/v2/topic/:topicId", authentication, getProblemsByTopicWithProgress);

export default problemRouter;

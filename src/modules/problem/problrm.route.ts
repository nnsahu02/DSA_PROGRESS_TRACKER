import { Router } from "express";
import { getProblemsByTopic, getProblemsByTopicWithProgress } from "./problem.controller";
import { authentication } from "../../middlewares/auth.middleware";

const problemRouter = Router();

problemRouter.get("/v1/topic/:topicId", authentication, getProblemsByTopic);
problemRouter.get("/v2/topic/:topicId", authentication, getProblemsByTopicWithProgress);

export default problemRouter;

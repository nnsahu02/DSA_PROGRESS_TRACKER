import { Router } from "express";
import { authentication } from "../../middlewares/auth.middleware.ts";
import { getAllTopics } from "./topic.controller.ts";
const topicRouter = Router();

topicRouter.get("/", authentication, getAllTopics);

export default topicRouter;
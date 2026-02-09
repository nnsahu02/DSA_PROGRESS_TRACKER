import { Router } from "express";
import { authentication } from "../../middlewares/auth.middleware";
import { getAllTopics } from "./topic.controller";
const topicRouter = Router();

topicRouter.get("/", authentication, getAllTopics);

export default topicRouter;
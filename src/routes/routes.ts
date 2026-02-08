import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.ts";
import userRouter from "../modules/user/user.route.ts";
import topicRouter from "../modules/topic/topic.routes.ts";
const router = Router();

router.get("/", (req, res) => {
    return res.status(200).json({ message: "Server is Up", _v: 1, ip: req.ip });
});

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/topic", topicRouter);

export default router;
import { Router } from "express";
import { authentication } from "../../middlewares/auth.middleware.ts";
import { getMyProfile } from "./user.controller.ts";
const userRouter = Router();

userRouter.get("/me", authentication, getMyProfile)

export default userRouter;
import { Router } from "express";
import { authentication } from "../../middlewares/auth.middleware";
import { getMyProfile, updateMyProfile } from "./user.controller";
const userRouter = Router();

userRouter.get("/me", authentication, getMyProfile);
userRouter.patch("/me", authentication, updateMyProfile);

export default userRouter;
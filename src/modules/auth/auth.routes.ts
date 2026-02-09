import { Router } from "express";
import { login, logOut, refreshToken, register } from "./auth.controller";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/logout", logOut);

export default authRouter;
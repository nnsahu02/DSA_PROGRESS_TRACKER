import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.ts";
const router = Router();

router.get("/", (req, res) => {
    return res.status(200).json({ message: "Server is Up", _v: 1, ip: req.ip });
});

router.use("/auth", authRouter);

export default router;
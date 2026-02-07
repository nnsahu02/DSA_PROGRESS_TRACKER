import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
    return res.status(200).json({ message: "Server is Up", _v: 1, ip: req.ip });
});

export default router;
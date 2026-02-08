import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.ts";
import { UserModel } from "../modules/user/user.model.ts";

export const authentication = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized, Token is missing." });
        }

        const decoded: any = jwt.verify(
            token,
            env.JWT_SECRET!
        );
        req.userInfoFromTkn = decoded;

        const userData = await UserModel.findById(decoded.id);
        if (!userData) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = userData;
        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(403).json({ message: "Invalid token" });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
};

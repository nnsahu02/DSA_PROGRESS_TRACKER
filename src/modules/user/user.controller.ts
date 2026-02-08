import type { Request, Response } from "express";
import { UserModel } from "./user.model.ts";

export const getMyProfile = async (req: Request | any, res: Response) => {
    try {
        const userId = req.user.id;

        const user = await UserModel.findById(userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error: any) {
        console.error("getMyProfile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message
        });
    }
};
import type { Request, Response } from "express";
import { UserModel } from "./user.model";

export const getMyProfile = async (req: Request | any, res: Response) => {
    try {
        const userId = req.user._id;

        const user = await UserModel.findById(userId).populate("lastWorkingOnTopic", "title");

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

export const updateMyProfile = async (req: Request | any, res: Response) => {
    try {
        const userId = req.user._id;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required"
            });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { name },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (error: any) {
        console.error("updateMyProfile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
};
import type { Request, Response } from "express";
import { ProgressModel } from "./progress.model.ts";

export const markCompleted = async (req: Request | any, res: Response) => {
    try {
        const userId = req.user.id;
        const { problemId } = req.body;

        if (!problemId) {
            return res.status(400).json({
                success: false,
                message: "Problem ID required"
            });
        }

        await ProgressModel.findOneAndUpdate(
            { userId, problemId },
            {
                completed: true,
                completedAt: new Date()
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            message: "Problem marked as completed"
        });
    } catch (error: any) {
        console.error("markCompleted error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update progress",
            error: error.message
        });
    }
};


export const unmarkCompleted = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const { problemId } = req.body;

        await ProgressModel.deleteOne({
            userId,
            problemId
        });

        res.status(200).json({
            success: true,
            message: "Problem unmarked"
        });
    } catch (error: any) {
        console.error("unmarkCompleted error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update progress",
            error: error.message
        });
    }
};

export const getMyProgress = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;

        const progress = await ProgressModel.find({ userId }).select("problemId completed");

        res.status(200).json({
            success: true,
            data: progress
        });
    } catch (error) {
        console.error("getMyProgress error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch progress"
        });
    }
};

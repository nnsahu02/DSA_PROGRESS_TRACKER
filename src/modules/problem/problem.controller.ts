import type { Request, Response } from "express";
import { ProblemModel } from "./problem.model.ts";

export const getProblemsByTopic = async (req: Request, res: Response) => {
    try {
        const { topicId } = req.params;
        if (!topicId) {
            return res.status(400).json({
                success: false,
                message: "Topic ID is required"
            });
        }

        const problems = await ProblemModel.find({ topicId }).sort({ order: 1 });

        res.status(200).json({
            success: true,
            data: problems
        });
    } catch (error: any) {
        console.error("getProblemsByTopic error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch problems",
            error: error.message
        });
    }
};

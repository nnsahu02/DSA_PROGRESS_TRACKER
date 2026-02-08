import type { Request, Response } from "express";
import { TopicModel } from "./topic.model.ts";

export const getAllTopics = async (_req: Request, res: Response) => {
    try {
        const topics = await TopicModel.find().sort({ order: 1 });

        res.status(200).json({
            success: true,
            data: topics
        });
    } catch (error) {
        console.error("getAllTopics error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch topics"
        });
    }
};

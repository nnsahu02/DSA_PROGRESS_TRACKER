import mongoose from "mongoose";
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

export const getProblemsByTopicWithProgress = async (req: Request | any, res: Response) => {
    try {
        const { topicId } = req.params;
        const userId = req.user.id;

        if (!topicId || topicId == undefined) {
            return res.status(400).json({
                success: false,
                message: "Topic ID is required"
            });
        }

        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 10, 1);
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || "order";
        const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

        const difficulty = req.query.difficulty;
        const search = req.query.search;

        const match: any = {
            topicId: new mongoose.Types.ObjectId(topicId)
        };

        if (difficulty) {
            match.difficulty = difficulty;
        }

        if (search) {
            match.title = {
                $regex: search,
                $options: "i"
            };
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const docsPipeline: any = [
            { $match: match },

            {
                $lookup: {
                    from: "progresses",
                    let: { problemId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$problemId", "$$problemId"] },
                                        { $eq: ["$userId", userObjectId] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "progress"
                }
            },

            {
                $addFields: {
                    isCompleted: {
                        $gt: [{ $size: "$progress" }, 0]
                    }
                }
            },

            { $project: { progress: 0 } },
            { $sort: { [sortBy]: sortOrder } },
            { $skip: skip },
            { $limit: limit }
        ];

        const countPipeline = [
            { $match: match },
            { $count: "totalDocs" }
        ];

        const [docs, countResult] = await Promise.all([
            ProblemModel.aggregate(docsPipeline),
            ProblemModel.aggregate(countPipeline)
        ]);

        const totalDocs = countResult[0]?.totalDocs || 0;
        const totalPages = Math.ceil(totalDocs / limit);

        res.status(200).json({
            docs,
            totalDocs,
            limit,
            page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null
        });
    } catch (error) {
        console.error("getProblems error:", error);
        res.status(500).json({
            message: "Failed to fetch problems"
        });
    }
};
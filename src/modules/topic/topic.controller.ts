import type { Request, Response } from "express";
import { TopicModel } from "./topic.model.ts";
import mongoose from "mongoose";

export const getAllTopics = async (req: any, res: Response) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const topics = await TopicModel.aggregate([
            { $sort: { order: 1 } },

            {
                $lookup: {
                    from: "problems",
                    localField: "_id",
                    foreignField: "topicId",
                    as: "problems"
                }
            },

            {
                $lookup: {
                    from: "progresses",
                    let: { problemIds: "$problems._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $in: ["$problemId", "$$problemIds"] },
                                        { $eq: ["$userId", userId] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "completedProgress"
                }
            },

            {
                $addFields: {
                    totalProblems: { $size: "$problems" },
                    completedProblems: { $size: "$completedProgress" }
                }
            },

            {
                $addFields: {
                    remainingProblems: {
                        $subtract: ["$totalProblems", "$completedProblems"]
                    },
                    progressPercent: {
                        $cond: [
                            { $eq: ["$totalProblems", 0] },
                            0,
                            {
                                $round: [
                                    {
                                        $multiply: [
                                            {
                                                $divide: [
                                                    "$completedProblems",
                                                    "$totalProblems"
                                                ]
                                            },
                                            100
                                        ]
                                    },
                                    2
                                ]
                            }
                        ]
                    }
                }
            },

            {
                $project: {
                    problems: 0,
                    completedProgress: 0
                }
            }
        ]);

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


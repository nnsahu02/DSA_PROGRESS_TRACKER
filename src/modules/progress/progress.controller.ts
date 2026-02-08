import type { Request, Response } from "express";
import { ProgressModel } from "./progress.model.ts";
import mongoose from "mongoose";
import { ProblemModel } from "../problem/problem.model.ts";

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

export const getDashboardStats = async (req: any, res: Response) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const result: any = await ProblemModel.aggregate([
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
                                        { $eq: ["$userId", userId] }
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

            {
                $group: {
                    _id: "$difficulty",
                    total: { $sum: 1 },
                    completed: {
                        $sum: {
                            $cond: ["$isCompleted", 1, 0]
                        }
                    }
                }
            },

            {
                $project: {
                    _id: 0,
                    difficulty: "$_id",
                    total: 1,
                    completed: 1,
                    remaining: {
                        $subtract: ["$total", "$completed"]
                    },
                    progressPercent: {
                        $cond: [
                            { $eq: ["$total", 0] },
                            0,
                            {
                                $round: [
                                    {
                                        $multiply: [
                                            { $divide: ["$completed", "$total"] },
                                            100
                                        ]
                                    },
                                    2
                                ]
                            }
                        ]
                    }
                }
            }
        ]);

        const base: any = {
            easy: { total: 0, completed: 0, remaining: 0, progressPercent: 0 },
            medium: { total: 0, completed: 0, remaining: 0, progressPercent: 0 },
            hard: { total: 0, completed: 0, remaining: 0, progressPercent: 0 }
        };

        let totalProblems = 0;
        let completedProblems = 0;

        result.forEach((r: any) => {
            base[r.difficulty] = {
                total: r.total,
                completed: r.completed,
                remaining: r.remaining,
                progressPercent: r.progressPercent
            };
            totalProblems += r.total;
            completedProblems += r.completed;
        });

        const remainingProblems = totalProblems - completedProblems;
        const progressPercent =
            totalProblems === 0
                ? 0
                : Math.round((completedProblems / totalProblems) * 100);

        res.status(200).json({
            overall: {
                totalProblems,
                completedProblems,
                remainingProblems,
                progressPercent
            },
            difficultyWise: base
        });
    } catch (error: any) {
        console.error("Dashboard error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load dashboard",
            error: error.message
        });
    }
};

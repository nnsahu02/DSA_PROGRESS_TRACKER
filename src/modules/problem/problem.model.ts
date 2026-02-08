import { Schema, model, Types } from "mongoose";

const problemSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        topicId: {
            type: Types.ObjectId,
            ref: "Topic",
            required: true
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true
        },
        youtubeUrl: {
            type: String
        },
        practiceUrl: {
            type: String
        },
        articleUrl: {
            type: String
        },
        order: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

export const ProblemModel = model("Problem", problemSchema);

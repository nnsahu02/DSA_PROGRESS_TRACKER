import { Schema, model, Types } from "mongoose";

const progressSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: "User",
            required: true
        },
        problemId: {
            type: Types.ObjectId,
            ref: "Problem",
            required: true
        },
        completed: {
            type: Boolean,
            default: true
        },
        completedAt: {
            type: Date
        }
    },
    { timestamps: true }
);

progressSchema.index(
    { userId: 1, problemId: 1 },
    { unique: true }
);

export const ProgressModel = model("Progress", progressSchema);

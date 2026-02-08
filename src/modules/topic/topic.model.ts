import { Schema, model } from "mongoose";

const topicSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        order: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

export const TopicModel = model("Topic", topicSchema);

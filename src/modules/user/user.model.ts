import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student"
        }
    },
    { timestamps: true }
);

export const UserModel = model("User", userSchema);

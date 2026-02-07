import { Schema, model, Types } from "mongoose";

const refreshTokenSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: "User",
            required: true
        },
        token: {
            type: String,
            required: true,
            unique: true
        },
        expiresAt: {
            type: Date,
            required: true
        },
        used: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = model("RefreshToken", refreshTokenSchema);

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import type { Request, Response } from "express";
import { UserModel } from "../user/user.model.ts";
import { env } from "../../config/env.ts";
import mongoose, { ObjectId } from "mongoose";
import { RefreshTokenModel } from "../refreshToken/refreshtoken.model.ts";
import { clearCookies, setCookie } from "../../utils/cookie.util.ts";

const { JWT_SECRET, JWT_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_DAYS }: any = env;

const generateAccessToken = (payload: { _id: ObjectId, role: string }) => {
    return jwt.sign(
        { id: payload._id, role: payload.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

const generateRefreshToken = () => {
    return crypto.randomBytes(40).toString("hex");
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    } catch (error: any) {
        console.error("ERROR IN REGISTER :", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
            error: error.message
        });
    }
};

export const login = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user: { _id: ObjectId, role: string, password: string } | null | any = await UserModel.findOne({ email }).select("+password role").session(session);

        if (!user) {
            await session.abortTransaction();
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            await session.abortTransaction();
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateAccessToken({ _id: user._id, role: user.role });

        const refreshToken = generateRefreshToken();

        await RefreshTokenModel.create([{
            userId: user._id,
            token: refreshToken,
            expiresAt: new Date(
                Date.now() + Number(REFRESH_TOKEN_EXPIRES_DAYS) * 24 * 60 * 60 * 1000
            )
        }], { session });

        setCookie(res, token, refreshToken);

        await session.commitTransaction();
        await session.endSession();

        return res.status(200).json({
            success: true,
            message: "Login successful"
        });
    } catch (error) {
        console.error("ERROR IN LOGIN:", error);

        await session.abortTransaction();
        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    } finally {
        await session.endSession();
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token missing" });
        }

        const tokenDoc = await RefreshTokenModel.findOne({ token: refreshToken });

        if (!tokenDoc) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        if (tokenDoc.used) {
            await RefreshTokenModel.deleteMany({ userId: tokenDoc.userId });

            clearCookies(res);

            return res.status(401).json({
                message: "Session compromised. Logged out."
            });
        }

        if (tokenDoc.expiresAt < new Date()) {
            await RefreshTokenModel.deleteOne({ _id: tokenDoc._id });

            return res.status(401).json({ message: "Refresh token expired" });
        }

        tokenDoc.used = true;
        await tokenDoc.save();

        const user: any = await UserModel.findById(tokenDoc.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newToken = generateAccessToken({ _id: user._id, role: user.role });

        const newRefreshToken = generateRefreshToken();

        await RefreshTokenModel.create({
            userId: user._id,
            token: newRefreshToken,
            expiresAt: new Date(
                Date.now() + Number(REFRESH_TOKEN_EXPIRES_DAYS) * 24 * 60 * 60 * 1000
            )
        });

        setCookie(res, newToken, newRefreshToken);

        return res.status(200).json({ message: "Token refreshed" });
    } catch (err) {
        console.error("refresh error:", err);
        return res.status(500).json({ message: "Could not refresh token" });
    }
};
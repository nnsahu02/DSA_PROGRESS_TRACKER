import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import type { Request, Response } from "express";
import { UserModel } from "../user/user.model.ts";
import { env } from "../../config/env.ts";
import mongoose, { ObjectId } from "mongoose";
import { RefreshTokenModel } from "../refreshToken/refreshtoken.model.ts";
import { setCookie } from "../../utils/cookie.util.ts";

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
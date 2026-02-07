import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { UserModel } from "../user/user.model.ts";

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
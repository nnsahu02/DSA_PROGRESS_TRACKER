import type { Response } from "express";
import { env } from "../config/env";

export const setCookie = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: (env.JWT_EXPIRES_IN as any).endsWith("m") ? Number(env.JWT_EXPIRES_IN!.slice(0, -1)) * 60 * 1000 : Number(env.JWT_EXPIRES_IN) * 1000
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: Number(env.REFRESH_TOKEN_EXPIRES_DAYS) * 24 * 60 * 60 * 1000
    });
};

export const clearCookies = (res: Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
};
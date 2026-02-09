import { config } from "dotenv";
config();

export const env : any = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_DAYS : process.env.REFRESH_TOKEN_EXPIRES_DAYS
};
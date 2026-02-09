import mongoose from "mongoose";
import { env } from "./env";

export const dbConnection = () => {
    try {
        mongoose.connect(env.MONGO_URI as string);
        console.log("🍂 MongoDB is connected.");
    } catch (error) {
        console.log("Error connecting to database:", error);
    }
};
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/routes';
import { env } from './config/env';
import { dbConnection } from './config/dbConnection';
import { seedDataInDb } from './seed/seed';

const app = express();
const allowedOrigins = [
    "http://localhost:5173"
];
app.use(
    cors({
        origin: (origin, callback) => {
            // allow server-to-server & tools like Postman
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Authorization", "Content-Type"]
    })
);
app.use(express.json());
app.use(morgan("dev"))
app.use(cookieParser());
dbConnection();

app.use("/", router);

seedDataInDb().then((result) => console.log("🔃", result.message)).catch(err => console.log(err));

app.listen(env.PORT, () => {
    console.log(`💻 Server is running on port ${env.PORT}.`);
});
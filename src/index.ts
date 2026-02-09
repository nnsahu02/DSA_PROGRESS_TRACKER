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
    "http://localhost:5173",
    "http://localhost:3000",
    "http://3.110.166.182"
];

app.use(
    cors({
        origin: (origin, callback) => {
            // allow requests with no origin (Postman, curl)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());
app.use(morgan("dev"))
app.use(cookieParser());
dbConnection();

app.use("/", router);

seedDataInDb().then((result) => console.log("🔃", result.message)).catch(err => console.log(err));

app.listen(env.PORT!, "0.0.0.0", () => {
    console.log(`💻 Server is running on port ${env.PORT}.`);
});
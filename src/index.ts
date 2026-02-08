import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import router from './routes/routes.ts';
import { env } from './config/env.ts';
import { dbConnection } from './config/dbConnection.ts';
import { seedDataInDb } from './seed/seed.ts';

const app = express();
app.use(express.json());
app.use(morgan("dev"))
app.use(cookieParser());
dbConnection();

app.use("/", router);

seedDataInDb().then((result) => console.log("🔃", result.message)).catch(err => console.log(err));

app.listen(env.PORT, () => {
    console.log(`💻 Server is running on port ${env.PORT}.`);
});
import express from 'express';
import morgan from 'morgan';
import router from './routes/routes.ts';
import { env } from './config/env.ts';
import { dbConnection } from './config/dbConnection.ts';

const app = express();
app.use(express.json());
app.use(morgan("dev"))

dbConnection();

app.use("/", router);

app.listen(env.PORT, () => {
    console.log(`💻 Server is running on port ${env.PORT}.`);
});
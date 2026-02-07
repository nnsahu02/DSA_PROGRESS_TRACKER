import express from 'express';
import { env } from './config/env.ts';
import { dbConnection } from './config/dbConnection.ts';

const app = express();
app.use(express.json());

dbConnection();

app.listen(env.PORT, () => {
    console.log(`💻 Server is running on port ${env.PORT}.`);
});
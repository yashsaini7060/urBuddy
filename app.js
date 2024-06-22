import express from 'express';
import {config} from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js'
config();

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

app.use('/ping',(req, res) => {
  res.send("Pong");
})



app.use('/api/v1/user', userRoutes);

export default app;